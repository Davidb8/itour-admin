import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getAuthUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Heart } from 'lucide-react'
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

  // Only super admins can manage donors
  if (!user.isSuperAdmin) {
    redirect('/dashboard')
  }

  const supabase = await createClient()

  // Fetch tour and donors in parallel
  const [tourResult, donorsResult] = await Promise.all([
    supabase
      .from('tours')
      .select('id, name, slug, donation_url')
      .eq('id', id)
      .single(),
    supabase
      .from('donors')
      .select('*')
      .eq('tour_id', id)
      .order('amount', { ascending: false })
  ])

  const tour = tourResult.data
  const donors = donorsResult.data || []

  if (!tour) {
    notFound()
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Donors</h1>
          <p className="text-gray-600 mt-1">{tour.name}</p>
        </div>
      </div>

      {!tour.donation_url && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Heart className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800">No Stripe link configured</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Configure a Stripe donation link in the{' '}
                  <Link href={`/tours/${id}`} className="underline font-medium">
                    tour settings
                  </Link>{' '}
                  to enable contributions for this tour.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Tour Donors</CardTitle>
          <CardDescription>
            Manage donors who have contributed to {tour.name}. These donors appear on the app&apos;s donation screen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DonorList donors={donors} tourId={id} />
        </CardContent>
      </Card>
    </div>
  )
}
