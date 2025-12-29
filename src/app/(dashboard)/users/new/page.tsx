import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getAuthUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { CreateUserForm } from './create-user-form'

interface NewUserPageProps {
  searchParams: Promise<{ tour?: string }>
}

export default async function NewUserPage({ searchParams }: NewUserPageProps) {
  const { tour: preselectedTourId } = await searchParams
  const user = await getAuthUser()

  if (!user) {
    redirect('/login')
  }

  if (!user.isSuperAdmin) {
    redirect('/dashboard')
  }

  const supabase = await createClient()

  // Fetch all tours for the dropdown
  const { data: tours } = await supabase
    .from('tours')
    .select('id, name')
    .order('name')

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/users">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add User</h1>
          <p className="text-gray-600 mt-1">Create a new admin user</p>
        </div>
      </div>

      <CreateUserForm tours={tours || []} preselectedTourId={preselectedTourId} />
    </div>
  )
}
