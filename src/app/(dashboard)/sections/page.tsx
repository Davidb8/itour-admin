import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionList } from '@/components/section-list'

export default async function SectionsPage() {
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

  // Fetch sections
  const { data: sections } = await supabase
    .from('tour_sections')
    .select('*')
    .eq('tour_id', user.tourId)
    .order('display_order', { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Content Sections</h1>
        <p className="text-gray-600 mt-1">
          Add informational content like History, About Us, Visitor Info, etc.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sections</CardTitle>
          <CardDescription>
            These appear as tabs in the app&apos;s Discover area alongside Stops.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SectionList sections={sections || []} tourId={user.tourId} />
        </CardContent>
      </Card>
    </div>
  )
}
