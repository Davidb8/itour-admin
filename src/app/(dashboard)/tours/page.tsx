import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getAuthUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, MapPin, ExternalLink, Users } from 'lucide-react'

// Light caching for tour list - helps with back/forward navigation
export const revalidate = 10

export default async function ToursPage() {
  const user = await getAuthUser()

  if (!user) {
    redirect('/login')
  }

  if (!user.isSuperAdmin) {
    redirect('/dashboard')
  }

  const supabase = await createClient()

  // Fetch all tours with stats
  const { data: tours } = await supabase
    .from('tours')
    .select(`
      *,
      stops(id),
      donors(id),
      users(id)
    `)
    .order('name')

  const toursWithStats = tours?.map(tour => ({
    ...tour,
    stop_count: tour.stops?.length || 0,
    donor_count: tour.donors?.length || 0,
    admin_count: tour.users?.length || 0,
  })) || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Tours</h1>
          <p className="text-gray-600 mt-1">
            Manage all tours on the platform
          </p>
        </div>
        <Button asChild>
          <Link href="/tours/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Tour
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {toursWithStats.length > 0 ? (
          toursWithStats.map((tour) => (
            <Card key={tour.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {tour.cover_image_url ? (
                      <img
                        src={tour.cover_image_url}
                        alt={tour.name}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{tour.name}</h3>
                        <Badge variant={tour.is_published ? 'default' : 'secondary'}>
                          {tour.is_published ? 'Published' : 'Draft'}
                        </Badge>
                      </div>
                      <p className="text-gray-500">{tour.location || 'No location set'}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>{tour.stop_count} stops</span>
                        <span>{tour.donor_count} donors</span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {tour.admin_count} admins
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/tours/${tour.id}`}>
                        Manage
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 mb-4">No tours yet. Create your first tour to get started.</p>
              <Button asChild>
                <Link href="/tours/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Tour
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
