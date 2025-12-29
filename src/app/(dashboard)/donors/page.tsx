import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DonorList } from './donor-list'

export default async function DonorsPage() {
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

  // Fetch tour with donation settings
  const { data: tour } = await supabase
    .from('tours')
    .select('donation_url')
    .eq('id', user.tourId)
    .single()

  // Fetch donors
  const { data: donors } = await supabase
    .from('donors')
    .select('*')
    .eq('tour_id', user.tourId)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Donor Management</h1>
        <p className="text-gray-600 mt-1">
          Manage your tour supporters and donation settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Donation Link</CardTitle>
          <CardDescription>
            Your Stripe Payment Link for receiving donations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tour?.donation_url ? (
            <div className="flex items-center gap-4">
              <code className="flex-1 p-3 bg-gray-100 rounded text-sm truncate">
                {tour.donation_url}
              </code>
              <a
                href={tour.donation_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                Test link
              </a>
            </div>
          ) : (
            <p className="text-gray-500">
              No donation link configured. Go to{' '}
              <a href="/settings" className="text-blue-600 hover:underline">
                Tour Settings
              </a>{' '}
              to add one.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Donors</CardTitle>
          <CardDescription>
            Add and manage donors who will appear on your donor wall
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DonorList donors={donors || []} tourId={user.tourId} />
        </CardContent>
      </Card>
    </div>
  )
}
