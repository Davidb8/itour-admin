import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getAuthUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { StopForm } from '@/components/stop-form'

interface EditStopPageProps {
  params: Promise<{ id: string; stopId: string }>
}

export default async function EditStopPage({ params }: EditStopPageProps) {
  const { id, stopId } = await params
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

  // Fetch the stop with its images
  const { data: stop } = await supabase
    .from('stops')
    .select(`
      *,
      stop_images(*)
    `)
    .eq('id', stopId)
    .eq('tour_id', id)
    .single()

  if (!stop) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/tours/${id}/stops`}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Stop</h1>
          <p className="text-gray-600 mt-1">{tour.name} - {stop.title}</p>
        </div>
      </div>

      <StopForm stop={stop} tourId={id} redirectPath={`/tours/${id}/stops`} />
    </div>
  )
}
