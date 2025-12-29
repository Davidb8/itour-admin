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
import { Badge } from '@/components/ui/badge'
import { Loader2, Save, Eye, EyeOff } from 'lucide-react'
import { Tour } from '@/lib/database.types'

interface TourSettingsFormProps {
  tour: Tour
}

export function TourSettingsForm({ tour }: TourSettingsFormProps) {
  const [name, setName] = useState(tour.name)
  const [description, setDescription] = useState(tour.description || '')
  const [location, setLocation] = useState(tour.location || '')
  const [durationMinutes, setDurationMinutes] = useState(tour.duration_minutes?.toString() || '')
  const [coverImageUrl, setCoverImageUrl] = useState(tour.cover_image_url || '')
  const [donationUrl, setDonationUrl] = useState(tour.donation_url || '')
  const [supportText, setSupportText] = useState(tour.support_text || '')
  const [isPublished, setIsPublished] = useState(tour.is_published || false)

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
      const { error: updateError } = await supabase
        .from('tours')
        .update({
          name,
          description: description || null,
          location: location || null,
          duration_minutes: durationMinutes ? parseInt(durationMinutes) : null,
          cover_image_url: coverImageUrl || null,
          donation_url: donationUrl || null,
          support_text: supportText || null,
          is_published: isPublished,
          updated_at: new Date().toISOString(),
        })
        .eq('id', tour.id)

      if (updateError) throw updateError

      setSuccess(true)
      router.refresh()

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Error saving settings:', err)
      setError('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const togglePublish = async () => {
    const newState = !isPublished
    setIsPublished(newState)

    try {
      const { error } = await supabase
        .from('tours')
        .update({
          is_published: newState,
          updated_at: new Date().toISOString(),
        })
        .eq('id', tour.id)

      if (error) throw error
      router.refresh()
    } catch (err) {
      console.error('Error toggling publish:', err)
      setIsPublished(!newState) // Revert
      setError('Failed to update publish status')
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
          <AlertDescription>Settings saved successfully!</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tour Information</CardTitle>
              <CardDescription>
                Basic information about your tour
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isPublished ? 'default' : 'secondary'}>
                {isPublished ? 'Published' : 'Draft'}
              </Badge>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={togglePublish}
              >
                {isPublished ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-1" />
                    Unpublish
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-1" />
                    Publish
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tour Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
              placeholder="Describe your tour..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Estimated Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              placeholder="e.g., 60"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image URL</Label>
            <Input
              id="coverImage"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              placeholder="https://..."
            />
            {coverImageUrl && (
              <div className="mt-2 w-48 h-27 bg-gray-100 rounded overflow-hidden">
                <img
                  src={coverImageUrl}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Donation Settings</CardTitle>
          <CardDescription>
            Configure how visitors can support your tour
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="donationUrl">Stripe Payment Link</Label>
            <Input
              id="donationUrl"
              value={donationUrl}
              onChange={(e) => setDonationUrl(e.target.value)}
              placeholder="https://donate.stripe.com/..."
            />
            <p className="text-xs text-gray-500">
              Create a Payment Link in your{' '}
              <a
                href="https://dashboard.stripe.com/payment-links"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Stripe Dashboard
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supportText">&quot;Support Us&quot; Message</Label>
            <Textarea
              id="supportText"
              value={supportText}
              onChange={(e) => setSupportText(e.target.value)}
              placeholder="Help us preserve history by making a donation..."
              rows={4}
            />
            <p className="text-xs text-gray-500">
              This text appears on the donation screen in the app
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={saving || !name}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
