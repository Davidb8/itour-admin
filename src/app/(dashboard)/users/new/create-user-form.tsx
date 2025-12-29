'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Save } from 'lucide-react'
import { Tour } from '@/lib/database.types'

interface CreateUserFormProps {
  tours: Pick<Tour, 'id' | 'name'>[]
  preselectedTourId?: string
}

export function CreateUserForm({ tours, preselectedTourId }: CreateUserFormProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [tourId, setTourId] = useState(preselectedTourId || '')
  const [role, setRole] = useState<'admin' | 'super_admin'>('admin')
  const [password, setPassword] = useState('')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setSaving(true)

    try {
      // First, create the auth user via Supabase Admin API
      // Note: In production, this should be done via a server action or API route
      // with the service_role key for security
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })

      if (authError) {
        if (authError.message.includes('already registered')) {
          setError('A user with this email already exists.')
        } else {
          throw authError
        }
        return
      }

      if (!authData.user) {
        throw new Error('Failed to create user')
      }

      // Create the user profile in our users table
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          name: name || null,
          tour_id: role === 'super_admin' ? null : tourId || null,
          role,
        })

      if (profileError) throw profileError

      setSuccess(true)

      // Redirect after a brief delay
      setTimeout(() => {
        router.push('/users')
        router.refresh()
      }, 1500)
    } catch (err) {
      console.error('Error creating user:', err)
      setError('Failed to create user. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>
            User created successfully! They will receive an email to confirm their account.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
          <CardDescription>
            Create a new admin user account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label>Role *</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={() => setRole('admin')}
                  className="text-blue-600"
                />
                <span>Tour Admin</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="super_admin"
                  checked={role === 'super_admin'}
                  onChange={() => setRole('super_admin')}
                  className="text-blue-600"
                />
                <span>Super Admin</span>
              </label>
            </div>
            <p className="text-xs text-gray-500">
              {role === 'super_admin'
                ? 'Super admins can manage all tours and users'
                : 'Tour admins can only manage their assigned tour'}
            </p>
          </div>

          {role === 'admin' && (
            <div className="space-y-2">
              <Label htmlFor="tour">Assign to Tour</Label>
              <select
                id="tour"
                value={tourId}
                onChange={(e) => setTourId(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm"
              >
                <option value="">Select a tour...</option>
                {tours.map((tour) => (
                  <option key={tour.id} value={tour.id}>
                    {tour.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500">
                The user will only be able to manage this tour
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/users')}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={saving || !email || !password || success}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Create User
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
