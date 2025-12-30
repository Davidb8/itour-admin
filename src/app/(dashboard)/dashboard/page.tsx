import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getAuthUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Image, Heart, Settings, Map, Users, Plus, ExternalLink } from 'lucide-react'

export default async function DashboardPage() {
  const user = await getAuthUser()

  if (!user) {
    redirect('/login')
  }

  const supabase = await createClient()

  // Super admin dashboard
  if (user.isSuperAdmin) {
    const { data: tours } = await supabase
      .from('tours')
      .select('id, name, slug, is_published, location')
      .order('name')

    const { data: users } = await supabase
      .from('users')
      .select('id')

    const tourCount = tours?.length || 0
    const userCount = users?.length || 0
    const publishedCount = tours?.filter(t => t.is_published).length || 0

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage all tours and users across the platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Tours</CardTitle>
              <Map className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{tourCount}</div>
              <p className="text-xs text-gray-500 mt-1">{publishedCount} published</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Admin Users</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{userCount}</div>
              <p className="text-xs text-gray-500 mt-1">Across all tours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild size="sm" className="w-full justify-start">
                <Link href="/tours/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Tour
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="w-full justify-start">
                <Link href="/users/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Admin User
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Tours</CardTitle>
            <CardDescription>Overview of all tours on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tours?.map((tour) => (
                <div
                  key={tour.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    {tour.cover_image_url ? (
                      <img
                        src={tour.cover_image_url}
                        alt={tour.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">{tour.name}</h3>
                      <p className="text-sm text-gray-500">{tour.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={tour.is_published ? 'default' : 'secondary'}>
                      {tour.is_published ? 'Published' : 'Draft'}
                    </Badge>
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/tours/${tour.id}`}>
                        Manage
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
              {(!tours || tours.length === 0) && (
                <p className="text-center text-gray-500 py-8">
                  No tours yet. Create your first tour to get started.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Tenant admin dashboard
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

  // Fetch tour data with stats - run all queries in parallel
  const [tourResult, stopCountResult, imageCountResult, donorCountResult] = await Promise.all([
    supabase
      .from('tours')
      .select('*')
      .eq('id', user.tourId)
      .single(),
    supabase
      .from('stops')
      .select('*', { count: 'exact', head: true })
      .eq('tour_id', user.tourId),
    supabase
      .from('stop_images')
      .select('*, stops!inner(tour_id)', { count: 'exact', head: true })
      .eq('stops.tour_id', user.tourId),
    supabase
      .from('donors')
      .select('*', { count: 'exact', head: true })
      .eq('tour_id', user.tourId)
  ])

  const tour = tourResult.data
  const stopCount = stopCountResult.count
  const imageCount = imageCountResult.count
  const donorCount = donorCountResult.count

  if (!tour) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Tour Not Found</h1>
        <p className="text-gray-600 mt-2">
          The tour assigned to your account could not be found.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{tour.name}</h1>
          <p className="text-gray-600 mt-1">{tour.location}</p>
        </div>
        <Badge variant={tour.is_published ? 'default' : 'secondary'} className="text-sm">
          {tour.is_published ? 'Published' : 'Draft'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Stops</CardTitle>
            <MapPin className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stopCount || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Tour stops</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Photos</CardTitle>
            <Image className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{imageCount || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Across all stops</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Donors</CardTitle>
            <Heart className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{donorCount || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Supporters</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for managing your tour</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link href="/stops">
                <MapPin className="h-4 w-4 mr-2" />
                Manage Stops
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/stops/new">
                <Plus className="h-4 w-4 mr-2" />
                Add New Stop
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/donors">
                <Heart className="h-4 w-4 mr-2" />
                Manage Donors
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/settings">
                <Settings className="h-4 w-4 mr-2" />
                Tour Settings
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tour Information</CardTitle>
            <CardDescription>Overview of your tour settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p className="text-sm mt-1">
                {tour.description || 'No description set'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Duration</p>
              <p className="text-sm mt-1">
                {tour.duration_minutes ? `${tour.duration_minutes} minutes` : 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Donation Link</p>
              <p className="text-sm mt-1">
                {tour.donation_url ? (
                  <a href={tour.donation_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {tour.donation_url}
                  </a>
                ) : (
                  'Not configured'
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
