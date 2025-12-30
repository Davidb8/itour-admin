import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getAuthUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, GripVertical, Image, Edit, Trash2 } from 'lucide-react'
import { StopList } from './stop-list'

export default async function StopsPage() {
  const user = await getAuthUser()

  if (!user) {
    redirect('/login')
  }

  if (user.isSuperAdmin) {
    redirect('/dashboard')
  }

  if (!user.tourId) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">No Tour Assigned</h1>
        <p className="text-gray-600 mt-2">
          Contact your administrator to be assigned to a tour.
        </p>
      </div>
    )
  }

  const supabase = await createClient()

  // Fetch stops with images (ordered by display_order to get first image)
  const { data: stops } = await supabase
    .from('stops')
    .select(`
      *,
      stop_images(id, image_url, display_order)
    `)
    .eq('tour_id', user.tourId)
    .order('display_order')

  const stopsWithImages = stops?.map(stop => {
    // Sort images by display_order and get the first one
    const sortedImages = (stop.stop_images || []).sort(
      (a: { display_order: number | null }, b: { display_order: number | null }) =>
        (a.display_order ?? 0) - (b.display_order ?? 0)
    )
    return {
      ...stop,
      image_count: stop.stop_images?.length || 0,
      first_image_url: sortedImages[0]?.image_url || null,
    }
  }) || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Stops</h1>
          <p className="text-gray-600 mt-1">
            Add, edit, and reorder your tour stops
          </p>
        </div>
        <Button asChild>
          <Link href="/stops/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Stop
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tour Stops</CardTitle>
          <CardDescription>
            Drag to reorder stops. The order here is how they appear in the app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stopsWithImages.length > 0 ? (
            <StopList stops={stopsWithImages} tourId={user.tourId} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No stops yet. Add your first stop to get started.</p>
              <Button asChild>
                <Link href="/stops/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Stop
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
