import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getAuthUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { DonorList } from '@/app/(dashboard)/donors/donor-list'

interface TourDonorsPageProps {
  params: Promise<{ id: string }>
}

export default async function TourDonorsPage({ params }: TourDonorsPageProps) {
  const { id } = await params
  const user = await getAuthUser()

  if (!user) {
    redirect('/login')
  }

  if (!user.isSuperAdmin) {
    redirect('/dashboard')
  }

  const supabase = await createClient()

  // Fetch the tour with donation settings
  const { data: tour } = await supabase
    .from('tours')
    .select('id, name, donation_url')
    .eq('id', id)
    .single()

  if (!tour) {
    notFound()
  }

  // Fetch donors
  const { data: donors } = await supabase
    .from('donors')
    .select('*')
    .eq('tour_id', id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/tours/${id}`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Tour
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Donor Management</h1>
          <p className="text-gray-600 mt-1">
            {tour.name} - Manage tour supporters
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Donation Link</CardTitle>
          <CardDescription>
            Stripe Payment Link for receiving donations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tour.donation_url ? (
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
              No donation link configured. Edit the tour settings to add one.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Donors</CardTitle>
          <CardDescription>
            Add and manage donors who will appear on the donor wall
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DonorList donors={donors || []} tourId={id} />
        </CardContent>
      </Card>
    </div>
  )
}
