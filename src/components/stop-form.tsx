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
import { Loader2, Save, Trash2, Plus, X, GripVertical } from 'lucide-react'
import { Stop, StopImage } from '@/lib/database.types'

interface StopFormProps {
  stop?: Stop & { stop_images: StopImage[] }
  tourId: string
  isNew?: boolean
}

export function StopForm({ stop, tourId, isNew = false }: StopFormProps) {
  const [title, setTitle] = useState(stop?.title || '')
  const [content, setContent] = useState(stop?.content || '')
  const [latitude, setLatitude] = useState(stop?.latitude?.toString() || '')
  const [longitude, setLongitude] = useState(stop?.longitude?.toString() || '')
  const [images, setImages] = useState<StopImage[]>(stop?.stop_images || [])
  const [newImageUrl, setNewImageUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      if (isNew) {
        // Get the next display order
        const { data: maxOrderStop } = await supabase
          .from('stops')
          .select('display_order')
          .eq('tour_id', tourId)
          .order('display_order', { ascending: false })
          .limit(1)
          .single()

        const nextOrder = (maxOrderStop?.display_order || 0) + 1

        const { data: newStop, error: createError } = await supabase
          .from('stops')
          .insert({
            tour_id: tourId,
            title,
            content,
            latitude: latitude ? parseFloat(latitude) : null,
            longitude: longitude ? parseFloat(longitude) : null,
            display_order: nextOrder,
          })
          .select()
          .single()

        if (createError) throw createError

        // Add images to the new stop
        if (images.length > 0 && newStop) {
          const imageInserts = images.map((img, index) => ({
            stop_id: newStop.id,
            image_url: img.image_url,
            alt_text: img.alt_text,
            display_order: index,
          }))

          const { error: imageError } = await supabase
            .from('stop_images')
            .insert(imageInserts)

          if (imageError) throw imageError
        }

        router.push('/stops')
        router.refresh()
      } else if (stop) {
        // Update existing stop
        const { error: updateError } = await supabase
          .from('stops')
          .update({
            title,
            content,
            latitude: latitude ? parseFloat(latitude) : null,
            longitude: longitude ? parseFloat(longitude) : null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', stop.id)

        if (updateError) throw updateError

        // Delete existing images and re-insert
        await supabase
          .from('stop_images')
          .delete()
          .eq('stop_id', stop.id)

        if (images.length > 0) {
          const imageInserts = images.map((img, index) => ({
            stop_id: stop.id,
            image_url: img.image_url,
            alt_text: img.alt_text,
            display_order: index,
          }))

          const { error: imageError } = await supabase
            .from('stop_images')
            .insert(imageInserts)

          if (imageError) throw imageError
        }

        router.push('/stops')
        router.refresh()
      }
    } catch (err) {
      console.error('Error saving stop:', err)
      setError('Failed to save stop. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const addImage = () => {
    if (!newImageUrl.trim()) return

    setImages([
      ...images,
      {
        id: `new-${Date.now()}`,
        stop_id: stop?.id || '',
        image_url: newImageUrl.trim(),
        alt_text: null,
        display_order: images.length,
      },
    ])
    setNewImageUrl('')
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= images.length) return

    const newImages = [...images]
    const [moved] = newImages.splice(index, 1)
    newImages.splice(newIndex, 0, moved)
    setImages(newImages)
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
          <CardTitle>Stop Details</CardTitle>
          <CardDescription>
            Enter the information for this tour stop
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., South Gun Ramp"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Description</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe this stop for visitors..."
              rows={8}
            />
            <p className="text-xs text-gray-500">
              This content will be displayed in the app and used for text-to-speech narration.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="e.g., 30.2499"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="e.g., -88.0708"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Photos</CardTitle>
          <CardDescription>
            Add photos for this stop. Drag to reorder.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {images.length > 0 && (
            <div className="space-y-2">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50"
                >
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => moveImage(index, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(index, 'down')}
                      disabled={index === images.length - 1}
                      className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={image.image_url}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="%23ccc"><rect width="64" height="64"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="10" fill="%23999">No image</text></svg>'
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600 truncate">{image.image_url}</p>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => removeImage(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Input
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Enter image URL"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addImage()
                }
              }}
            />
            <Button type="button" variant="outline" onClick={addImage}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Enter the URL of an image. Images will be displayed in the order shown above.
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/stops')}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={saving || !title}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {isNew ? 'Create Stop' : 'Save Changes'}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
