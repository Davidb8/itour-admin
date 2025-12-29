'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Save, Plus, X, Link, Volume2 } from 'lucide-react'
import { Stop, StopImage } from '@/lib/database.types'
import { ImageUpload } from './image-upload'
import { RichTextEditor } from './rich-text-editor'
import { SortableList } from './sortable-list'

interface StopFormProps {
  stop?: Stop & { stop_images: StopImage[] }
  tourId: string
  isNew?: boolean
  redirectPath?: string // Path to redirect to after save/cancel
}

// Generate English TTS audio for a stop
async function generateTTS(stopId: string, title: string, content: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-tts`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ stop_id: stopId, title, content }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error('TTS generation failed:', data)
      return { success: false, error: data.error || 'TTS generation failed' }
    }

    return { success: true }
  } catch (err) {
    console.error('TTS generation error:', err)
    return { success: false, error: 'Failed to connect to TTS service' }
  }
}

export function StopForm({ stop, tourId, isNew = false, redirectPath = '/stops' }: StopFormProps) {
  const [title, setTitle] = useState(stop?.title || '')
  const [content, setContent] = useState(stop?.content || '')
  const [latitude, setLatitude] = useState(stop?.latitude?.toString() || '')
  const [longitude, setLongitude] = useState(stop?.longitude?.toString() || '')
  const [images, setImages] = useState<StopImage[]>(stop?.stop_images || [])
  const [newImageUrl, setNewImageUrl] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [saving, setSaving] = useState(false)
  const [generatingTTS, setGeneratingTTS] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ttsStatus, setTtsStatus] = useState<string | null>(null)
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

        // Generate English TTS audio for the new stop
        if (newStop) {
          setGeneratingTTS(true)
          setTtsStatus('Generating audio narration...')
          const ttsResult = await generateTTS(newStop.id, title, content)
          setGeneratingTTS(false)
          if (!ttsResult.success) {
            console.warn('TTS generation failed:', ttsResult.error)
            setTtsStatus('Audio generation failed (stop saved)')
          } else {
            setTtsStatus(null)
          }
        }

        router.push(redirectPath)
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

        // Regenerate English TTS audio when stop is updated
        setGeneratingTTS(true)
        setTtsStatus('Regenerating audio narration...')
        const ttsResult = await generateTTS(stop.id, title, content)
        setGeneratingTTS(false)
        if (!ttsResult.success) {
          console.warn('TTS generation failed:', ttsResult.error)
          setTtsStatus('Audio generation failed (stop saved)')
        } else {
          setTtsStatus(null)
        }

        router.push(redirectPath)
        router.refresh()
      }
    } catch (err) {
      console.error('Error saving stop:', err)
      setError('Failed to save stop. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const addImageFromUrl = () => {
    if (!newImageUrl.trim()) return

    addImage(newImageUrl.trim())
    setNewImageUrl('')
    setShowUrlInput(false)
  }

  const addImage = (imageUrl: string) => {
    setImages([
      ...images,
      {
        id: `new-${Date.now()}`,
        stop_id: stop?.id || '',
        image_url: imageUrl,
        alt_text: null,
        display_order: images.length,
      },
    ])
  }

  const removeImage = (imageId: string) => {
    setImages(images.filter((img) => img.id !== imageId))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {ttsStatus && (
        <Alert>
          <Volume2 className="h-4 w-4" />
          <AlertDescription>{ttsStatus}</AlertDescription>
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
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Describe this stop for visitors..."
              disabled={saving}
            />
            <p className="text-xs text-gray-500">
              This content will be displayed in the app. For text-to-speech, HTML formatting will be stripped.
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
            <SortableList
              items={images}
              onReorder={setImages}
              disabled={saving}
              className="space-y-2"
              renderItem={(image) => (
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50 flex-1">
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
                    onClick={() => removeImage(image.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              renderOverlay={(image) => (
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-white">
                  <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                    <img src={image.image_url} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600 truncate">{image.image_url}</p>
                  </div>
                </div>
              )}
            />
          )}

          {/* Image Upload */}
          <ImageUpload
            tourId={tourId}
            onUpload={addImage}
            disabled={saving}
          />

          {/* URL Input Option */}
          {showUrlInput ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Enter image URL (https://...)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addImageFromUrl()
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addImageFromUrl}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowUrlInput(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowUrlInput(true)}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <Link className="h-3 w-3" />
              Or add image by URL
            </button>
          )}

          <p className="text-xs text-gray-500">
            Upload images or add by URL. Images will be displayed in the order shown above.
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(redirectPath)}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={saving || generatingTTS || !title}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : generatingTTS ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Audio...
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
