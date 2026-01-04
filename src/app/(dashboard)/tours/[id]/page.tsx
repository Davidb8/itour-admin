import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getAuthUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, MapPin, Heart, Users, FileText } from 'lucide-react'
import { TourManageForm } from './tour-manage-form'

interface TourDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { id } = await params
  const user = await getAuthUser()

  if (!user) {
    redirect('/login')
  }

  if (!user.isSuperAdmin) {
    redirect('/dashboard')
  }

  const supabase = await createClient()

  // Run all queries in parallel
  const [tourResult, stopCountResult, donorCountResult, adminsResult, sectionCountResult] = await Promise.all([
    supabase
      .from('tours')
      .select('*')
      .eq('id', id)
      .single(),
    supabase
      .from('stops')
      .select('*', { count: 'exact', head: true })
      .eq('tour_id', id),
    supabase
      .from('donors')
      .select('*', { count: 'exact', head: true })
      .eq('tour_id', id),
    supabase
      .from('users')
      .select('*')
      .eq('tour_id', id),
    supabase
      .from('tour_sections')
      .select('*', { count: 'exact', head: true })
      .eq('tour_id', id)
  ])

  const tour = tourResult.data
  const stopCount = stopCountResult.count
  const donorCount = donorCountResult.count
  const admins = adminsResult.data
  const sectionCount = sectionCountResult.count

  if (!tour) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/tours">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">{tour.name}</h1>
            <Badge variant={tour.is_published ? 'default' : 'secondary'}>
              {tour.is_published ? 'Published' : 'Draft'}
            </Badge>
          </div>
          <p className="text-gray-600 mt-1">{tour.location || 'No location set'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:border-blue-300 transition-colors cursor-pointer">
          <Link href={`/tours/${id}/stops`} className="block">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Stops</CardTitle>
              <MapPin className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stopCount || 0}</div>
              <p className="text-xs text-blue-600 mt-1">Manage stops →</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:border-blue-300 transition-colors cursor-pointer">
          <Link href={`/tours/${id}/sections`} className="block">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Sections</CardTitle>
              <FileText className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{sectionCount || 0}</div>
              <p className="text-xs text-blue-600 mt-1">Manage content →</p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:border-blue-300 transition-colors cursor-pointer">
          <Link href={`/tours/${id}/donors`} className="block">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Donors</CardTitle>
              <Heart className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{donorCount || 0}</div>
              <p className="text-xs text-blue-600 mt-1">Manage donors →</p>
            </CardContent>
          </Link>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Admins</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{admins?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TourManageForm tour={tour} />

        <Card>
          <CardHeader>
            <CardTitle>Tour Admins</CardTitle>
            <CardDescription>
              Users who can manage this tour
            </CardDescription>
          </CardHeader>
          <CardContent>
            {admins && admins.length > 0 ? (
              <div className="space-y-3">
                {admins.map((admin) => (
                  <div
                    key={admin.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{admin.name || admin.email}</p>
                      <p className="text-sm text-gray-500">{admin.email}</p>
                    </div>
                    <Badge variant="outline">{admin.role}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No admins assigned to this tour yet.
              </p>
            )}
            <div className="mt-4">
              <Button asChild variant="outline" size="sm">
                <Link href={`/users/new?tour=${id}`}>
                  Add Admin
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
