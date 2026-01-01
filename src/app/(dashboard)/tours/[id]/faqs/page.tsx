import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getAuthUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { FaqList } from '@/components/faq-list'

interface TourFaqsPageProps {
  params: Promise<{ id: string }>
}

export default async function TourFaqsPage({ params }: TourFaqsPageProps) {
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

  // Fetch FAQs
  const { data: faqs } = await supabase
    .from('tour_faqs')
    .select('*')
    .eq('tour_id', id)
    .order('display_order', { ascending: true })

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
          <h1 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
          <p className="text-gray-600 mt-1">
            {tour.name} - Manage visitor FAQs
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>FAQs</CardTitle>
          <CardDescription>
            Add common questions and answers that visitors may have. These appear in the app&apos;s FAQ section.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FaqList faqs={faqs || []} tourId={id} />
        </CardContent>
      </Card>
    </div>
  )
}
