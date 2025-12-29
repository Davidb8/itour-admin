import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getAuthUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, User, Crown } from 'lucide-react'

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
            <div className="space-y-3">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      {u.role === 'super_admin' ? (
                        <Crown className="h-5 w-5 text-purple-600" />
                      ) : (
                        <User className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{u.name || u.email}</p>
                        {u.id === user.id && (
                          <Badge variant="outline" className="text-xs">You</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <Badge variant={u.role === 'super_admin' ? 'default' : 'secondary'}>
                        {u.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                      </Badge>
                      {u.tours && (
                        <p className="text-sm text-gray-500 mt-1">{u.tours.name}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
