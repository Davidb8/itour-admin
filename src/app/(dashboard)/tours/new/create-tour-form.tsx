'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Save } from 'lucide-react'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export function CreateTourForm() {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()

  const handleNameChange = (value: string) => {
    setName(value)
    // Auto-generate slug from name if slug hasn't been manually edited
    if (!slug || slug === slugify(name)) {
      setSlug(slugify(value))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      // Check if slug is unique
      const { data: existing } = await supabase
        .from('tours')
        .select('id')
        .eq('slug', slug)
        .single()

      if (existing) {
        setError('A tour with this URL slug already exists. Please choose a different one.')
        setSaving(false)
        return
      }

      const { data: newTour, error: createError } = await supabase
        .from('tours')
        .insert({
          name,
          slug,
          location: location || null,
          description: description || null,
          is_published: false,
        })
        .select()
        .single()

      if (createError) throw createError

      router.push(`/tours/${newTour.id}`)
      router.refresh()
    } catch (err) {
      console.error('Error creating tour:', err)
      setError('Failed to create tour. Please try again.')
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

      <Card>
        <CardHeader>
          <CardTitle>Tour Details</CardTitle>
          <CardDescription>
            Basic information for the new tour
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tour Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., Fort Gaines"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug *</Label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">itourapp.com/</span>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                placeholder="fort-gaines"
                required
                className="flex-1"
              />
            </div>
            <p className="text-xs text-gray-500">
              This is used in URLs and API calls. Use lowercase letters, numbers, and hyphens only.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Dauphin Island, Alabama"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this tour..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/tours')}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={saving || !name || !slug}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Create Tour
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
