import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getAuthUser } from '@/lib/auth'
import { StopForm } from '@/components/stop-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default async function NewStopPage() {
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
          <h1 className="text-3xl font-bold text-gray-900">Add New Stop</h1>
          <p className="text-gray-600 mt-1">Create a new tour stop</p>
        </div>
      </div>

      <StopForm tourId={user.tourId} isNew />
    </div>
  )
}
