import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getAuthUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { UserList } from './user-list'

export default async function UsersPage() {
  const user = await getAuthUser()

  if (!user) {
    redirect('/login')
  }

  if (!user.isSuperAdmin) {
    redirect('/dashboard')
  }

  const supabase = await createClient()

  // Fetch all users with their tours
  const { data: users } = await supabase
    .from('users')
    .select(`
      *,
      tours(name)
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">
            Manage admin users across all tours
          </p>
        </div>
        <Button asChild>
          <Link href="/users/new">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            Users who have access to the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users && users.length > 0 ? (
            <UserList users={users} currentUserId={user.id} />
          ) : (
            <p className="text-center text-gray-500 py-8">
              No users found.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
