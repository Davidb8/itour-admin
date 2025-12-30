'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Save } from 'lucide-react'
import { Tour } from '@/lib/database.types'
import { createUser } from '../actions'

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setSaving(true)

    const result = await createUser({
      email,
      password,
      name: name || undefined,
      role,
      tourId: role === 'admin' ? tourId : undefined,
    })

    if (result.success) {
      setSuccess(true)
      setTimeout(() => {
        router.push('/users')
        router.refresh()
      }, 1500)
    } else {
      setError(result.error || 'Failed to create user')
    }

    setSaving(false)
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
            User created successfully! Redirecting...
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
