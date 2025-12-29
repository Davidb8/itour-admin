import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getAuthUser } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { CreateTourForm } from './create-tour-form'

export default async function NewTourPage() {
  const user = await getAuthUser()

  if (!user) {
    redirect('/login')
  }

  if (!user.isSuperAdmin) {
    redirect('/dashboard')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/tours">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Tour</h1>
          <p className="text-gray-600 mt-1">Set up a new tour for a tenant</p>
        </div>
      </div>

      <CreateTourForm />
    </div>
  )
}
