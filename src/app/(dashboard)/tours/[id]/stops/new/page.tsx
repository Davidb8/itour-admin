import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getAuthUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { StopForm } from '@/components/stop-form'

interface NewStopPageProps {
  params: Promise<{ id: string }>
}

export default async function NewStopPage({ params }: NewStopPageProps) {
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
          <h1 className="text-3xl font-bold text-gray-900">Add Stop</h1>
          <p className="text-gray-600 mt-1">{tour.name}</p>
        </div>
      </div>

      <StopForm tourId={id} isNew redirectPath={`/tours/${id}/stops`} />
    </div>
  )
}
