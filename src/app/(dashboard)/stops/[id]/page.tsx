import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getAuthUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { StopForm } from '@/components/stop-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface StopEditPageProps {
  params: Promise<{ id: string }>
}

export default async function StopEditPage({ params }: StopEditPageProps) {
  const { id } = await params
  const user = await getAuthUser()

  if (!user) {
    redirect('/login')
  }

  if (user.isSuperAdmin) {
    redirect('/dashboard')
  }

  if (!user.tourId) {
    redirect('/dashboard')
  }

  const supabase = await createClient()

  const { data: stop } = await supabase
    .from('stops')
    .select(`
      *,
      stop_images(*)
    `)
    .eq('id', id)
    .eq('tour_id', user.tourId)
    .single()

  if (!stop) {
    notFound()
  }

  // Sort images by display_order
  const sortedImages = stop.stop_images?.sort((a, b) =>
    (a.display_order || 0) - (b.display_order || 0)
  ) || []

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/stops">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Stop</h1>
          <p className="text-gray-600 mt-1">{stop.title}</p>
        </div>
      </div>

      <StopForm
        stop={{ ...stop, stop_images: sortedImages }}
        tourId={user.tourId}
      />
    </div>
  )
}
