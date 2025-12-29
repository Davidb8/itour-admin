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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Loader2, Save, Trash2, Eye, EyeOff } from 'lucide-react'
import { Tour } from '@/lib/database.types'

interface TourManageFormProps {
  tour: Tour
}

export function TourManageForm({ tour }: TourManageFormProps) {
  const [name, setName] = useState(tour.name)
  const [slug, setSlug] = useState(tour.slug)
  const [location, setLocation] = useState(tour.location || '')
  const [description, setDescription] = useState(tour.description || '')
  const [isPublished, setIsPublished] = useState(tour.is_published || false)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setSaving(true)

    try {
      const { error: updateError } = await supabase
        .from('tours')
        .update({
          name,
          slug,
          location: location || null,
          description: description || null,
          is_published: isPublished,
          updated_at: new Date().toISOString(),
        })
        .eq('id', tour.id)

      if (updateError) throw updateError

      setSuccess(true)
      router.refresh()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Error saving tour:', err)
      setError('Failed to save tour. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)

    try {
      // Delete tour (cascades to stops, stop_images, donors)
      const { error } = await supabase
        .from('tours')
        .delete()
        .eq('id', tour.id)

      if (error) throw error

      router.push('/tours')
      router.refresh()
    } catch (err) {
      console.error('Error deleting tour:', err)
      setError('Failed to delete tour. Please try again.')
    } finally {
      setDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const togglePublish = () => {
    setIsPublished(!isPublished)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Tour Settings</CardTitle>
          <CardDescription>
            Manage basic tour information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription>Settings saved successfully!</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Tour Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={isPublished}
                onChange={togglePublish}
                className="rounded border-gray-300"
              />
              <Label htmlFor="published" className="cursor-pointer">
                Published (visible in app)
              </Label>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Tour
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tour</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{tour.name}&quot;? This will permanently delete:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>All stops and their images</li>
                <li>All donors</li>
                <li>Admin user assignments</li>
              </ul>
              <p className="mt-2 font-medium text-red-600">This action cannot be undone.</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Tour'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
