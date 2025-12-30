'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, MoreVertical, Edit, Trash2, Loader2, User, Eye, EyeOff } from 'lucide-react'
import { Donor } from '@/lib/database.types'

interface DonorListProps {
  donors: Donor[]
  tourId: string
}

const TIERS = [
  { value: 'silver', label: 'Silver', color: 'bg-gray-400' },
  { value: 'gold', label: 'Gold', color: 'bg-yellow-500' },
  { value: 'platinum', label: 'Platinum', color: 'bg-purple-500' },
]

export function DonorList({ donors: initialDonors, tourId }: DonorListProps) {
  const [donors, setDonors] = useState(initialDonors)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Form state
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [tier, setTier] = useState('silver')
  const [isAnonymous, setIsAnonymous] = useState(false)

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const resetForm = () => {
    setName('')
    setAmount('')
    setTier('silver')
    setIsAnonymous(false)
    setEditingDonor(null)
  }

  const openAddDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (donor: Donor) => {
    setEditingDonor(donor)
    setName(donor.name)
    setAmount(donor.amount?.toString() || '')
    setTier(donor.tier || 'silver')
    setIsAnonymous(donor.is_anonymous || false)
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const donorData = {
        tour_id: tourId,
        name,
        amount: amount ? parseFloat(amount) : null,
        tier,
        is_anonymous: isAnonymous,
      }

      if (editingDonor) {
        const { error } = await supabase
          .from('donors')
          .update(donorData)
          .eq('id', editingDonor.id)

        if (error) throw error

        setDonors(donors.map(d =>
          d.id === editingDonor.id ? { ...d, ...donorData } : d
        ))
      } else {
        const { data, error } = await supabase
          .from('donors')
          .insert(donorData)
          .select()
          .single()

        if (error) throw error

        setDonors([data, ...donors])
      }

      setIsDialogOpen(false)
      resetForm()
      router.refresh()
    } catch (error) {
      console.error('Error saving donor:', error)
      toast.error('Failed to save donor')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)
    try {
      const { error } = await supabase
        .from('donors')
        .delete()
        .eq('id', deleteId)

      if (error) throw error

      setDonors(donors.filter(d => d.id !== deleteId))
      setDeleteId(null)
      router.refresh()
    } catch (error) {
      console.error('Error deleting donor:', error)
      toast.error('Failed to delete donor')
    } finally {
      setDeleting(false)
    }
  }

  const getTierBadge = (tierValue: string | null) => {
    const tierConfig = TIERS.find(t => t.value === tierValue)
    if (!tierConfig) return null

    return (
      <Badge className={`${tierConfig.color} text-white`}>
        {tierConfig.label}
      </Badge>
    )
  }

  const donorToDelete = donors.find(d => d.id === deleteId)

  // Group donors by tier
  const platinumDonors = donors.filter(d => d.tier === 'platinum')
  const goldDonors = donors.filter(d => d.tier === 'gold')
  const silverDonors = donors.filter(d => d.tier === 'silver')

  return (
    <>
      <div className="space-y-6">
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Donor
        </Button>

        {donors.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No donors yet. Add your first donor to get started.
          </p>
        ) : (
          <div className="space-y-6">
            {platinumDonors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full" />
                  Platinum Donors ({platinumDonors.length})
                </h3>
                <div className="space-y-2">
                  {platinumDonors.map(donor => (
                    <DonorRow
                      key={donor.id}
                      donor={donor}
                      onEdit={() => openEditDialog(donor)}
                      onDelete={() => setDeleteId(donor.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {goldDonors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  Gold Donors ({goldDonors.length})
                </h3>
                <div className="space-y-2">
                  {goldDonors.map(donor => (
                    <DonorRow
                      key={donor.id}
                      donor={donor}
                      onEdit={() => openEditDialog(donor)}
                      onDelete={() => setDeleteId(donor.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {silverDonors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full" />
                  Silver Donors ({silverDonors.length})
                </h3>
                <div className="space-y-2">
                  {silverDonors.map(donor => (
                    <DonorRow
                      key={donor.id}
                      donor={donor}
                      onEdit={() => openEditDialog(donor)}
                      onDelete={() => setDeleteId(donor.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open)
        if (!open) resetForm()
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDonor ? 'Edit Donor' : 'Add Donor'}</DialogTitle>
            <DialogDescription>
              {editingDonor
                ? 'Update donor information'
                : 'Add a new donor to your donor wall'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Donor name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label>Tier *</Label>
                <div className="flex gap-2">
                  {TIERS.map((t) => (
                    <Button
                      key={t.value}
                      type="button"
                      variant={tier === t.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setTier(t.value)}
                      className={tier === t.value ? t.color : ''}
                    >
                      {t.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="anonymous" className="cursor-pointer">
                  Show as anonymous on donor wall
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving || !name}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingDonor ? 'Save Changes' : 'Add Donor'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Donor</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove &quot;{donorToDelete?.name}&quot; from your donor wall? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function DonorRow({
  donor,
  onEdit,
  onDelete,
}: {
  donor: Donor
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg bg-white hover:bg-gray-50">
      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
        <User className="h-5 w-5 text-gray-500" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-gray-900">
            {donor.is_anonymous ? 'Anonymous' : donor.name}
          </h3>
          {donor.is_anonymous && (
            <EyeOff className="h-3 w-3 text-gray-400" />
          )}
        </div>
        <p className="text-sm text-gray-500">
          {donor.amount ? `$${donor.amount.toLocaleString()}` : 'Amount not specified'}
        </p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete} className="text-red-600">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
