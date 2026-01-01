import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getAuthUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { FactList } from '@/components/fact-list'

interface TourFactsPageProps {
  params: Promise<{ id: string }>
}

export default async function TourFactsPage({ params }: TourFactsPageProps) {
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

  // Fetch facts
  const { data: facts } = await supabase
    .from('tour_facts')
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
          <h1 className="text-3xl font-bold text-gray-900">Did You Know?</h1>
          <p className="text-gray-600 mt-1">
            {tour.name} - Manage interesting facts
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Curious Facts</CardTitle>
          <CardDescription>
            Add bite-sized &quot;Did you know?&quot; facts that engage visitors. These appear as quick facts in the app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FactList facts={facts || []} tourId={id} />
        </CardContent>
      </Card>
    </div>
  )
}
