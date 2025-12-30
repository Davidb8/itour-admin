'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { User, Crown, MoreVertical, Trash2, KeyRound, Loader2 } from 'lucide-react'
import { deleteUser, setUserPassword } from './actions'

interface UserWithTour {
  id: string
  email: string
  name: string | null
  role: string | null
  tour_id: string | null
  tours: { name: string } | null
}

interface UserListProps {
  users: UserWithTour[]
  currentUserId: string
}

export function UserList({ users, currentUserId }: UserListProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserWithTour | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!selectedUser) return

    setLoading(true)
    setError(null)

    const result = await deleteUser(selectedUser.id)

    if (result.success) {
      setSuccess(`User "${selectedUser.name || selectedUser.email}" has been deleted.`)
      setDeleteDialogOpen(false)
      router.refresh()
    } else {
      setError(result.error || 'Failed to delete user')
    }

    setLoading(false)
  }

  const handleSetPassword = async () => {
    if (!selectedUser || !newPassword) return

    setLoading(true)
    setError(null)

    const result = await setUserPassword(selectedUser.id, newPassword)

    if (result.success) {
      setSuccess(`Password updated for ${selectedUser.name || selectedUser.email}`)
      setPasswordDialogOpen(false)
      setNewPassword('')
    } else {
      setError(result.error || 'Failed to set password')
    }

    setLoading(false)
  }

  const openDeleteDialog = (user: UserWithTour) => {
    setSelectedUser(user)
    setError(null)
    setSuccess(null)
    setDeleteDialogOpen(true)
  }

  const openPasswordDialog = (user: UserWithTour) => {
    setSelectedUser(user)
    setNewPassword('')
    setError(null)
    setSuccess(null)
    setPasswordDialogOpen(true)
  }

  return (
    <>
      {success && (
        <Alert className="mb-4">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

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
                  {u.id === currentUserId && (
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
              {u.id !== currentUserId && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openPasswordDialog(u)}>
                      <KeyRound className="h-4 w-4 mr-2" />
                      Reset Password
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => openDeleteDialog(u)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{' '}
              <span className="font-medium">{selectedUser?.name || selectedUser?.email}</span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete User
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Set a new password for{' '}
              <span className="font-medium">{selectedUser?.name || selectedUser?.email}</span>
            </DialogDescription>
          </DialogHeader>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                minLength={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPasswordDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSetPassword}
              disabled={loading || newPassword.length < 6}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4 mr-2" />
                  Set Password
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
