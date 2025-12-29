import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getAuthUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, ArrowLeft } from 'lucide-react'
import { TourStopList } from './tour-stop-list'

interface TourStopsPageProps {
  params: Promise<{ id: string }>
}

export default async function TourStopsPage({ params }: TourStopsPageProps) {
  const { id } = await params
  const user = await getAuthUser()

  if (!user) {
    redirect('/login')
  }

  if (!user.isSuperAdmin) {
    redirect('/dashboard')
  }

  const supabase = await createClient()

  // Fetch the tour
  const { data: tour } = await supabase
    .from('tours')
    .select('id, name')
    .eq('id', id)
    .single()

  if (!tour) {
    notFound()
  }

  // Fetch stops with image counts
  const { data: stops } = await supabase
    .from('stops')
    .select(`
      *,
      stop_images(id)
    `)
    .eq('tour_id', id)
    .order('display_order')

  const stopsWithImageCounts = stops?.map(stop => ({
    ...stop,
    image_count: stop.stop_images?.length || 0,
  })) || []

  const basePath = `/tours/${id}/stops`

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/tours/${id}`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Tour
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Manage Stops</h1>
          <p className="text-gray-600 mt-1">
            {tour.name} - Add, edit, and reorder tour stops
          </p>
        </div>
        <Button asChild>
          <Link href={`${basePath}/new`}>
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
          {stopsWithImageCounts.length > 0 ? (
            <TourStopList stops={stopsWithImageCounts} tourId={id} basePath={basePath} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No stops yet. Add your first stop to get started.</p>
              <Button asChild>
                <Link href={`${basePath}/new`}>
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
