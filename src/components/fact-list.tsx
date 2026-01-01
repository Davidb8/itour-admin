'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { Plus, MoreVertical, Edit, Trash2, Loader2, Lightbulb, Eye, EyeOff, GripVertical } from 'lucide-react'
import { TourFact } from '@/lib/database.types'

interface FactListProps {
  facts: TourFact[]
  tourId: string
}

export function FactList({ facts: initialFacts, tourId }: FactListProps) {
  const [facts, setFacts] = useState(initialFacts)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFact, setEditingFact] = useState<TourFact | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Form state
  const [fact, setFact] = useState('')
  const [isPublished, setIsPublished] = useState(true)

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const resetForm = () => {
    setFact('')
    setIsPublished(true)
    setEditingFact(null)
  }

  const openAddDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (factItem: TourFact) => {
    setEditingFact(factItem)
    setFact(factItem.fact)
    setIsPublished(factItem.is_published ?? true)
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const maxOrder = facts.length > 0
        ? Math.max(...facts.map(f => f.display_order || 0))
        : 0

      const factData = {
        tour_id: tourId,
        fact,
        is_published: isPublished,
        display_order: editingFact?.display_order ?? maxOrder + 1,
      }

      if (editingFact) {
        const { error } = await supabase
          .from('tour_facts')
          .update(factData)
          .eq('id', editingFact.id)

        if (error) throw error

        setFacts(facts.map(f =>
          f.id === editingFact.id ? { ...f, ...factData } : f
        ))
        toast.success('Fact updated')
      } else {
        const { data, error } = await supabase
          .from('tour_facts')
          .insert(factData)
          .select()
          .single()

        if (error) throw error

        setFacts([...facts, data])
        toast.success('Fact created')
      }

      setIsDialogOpen(false)
      resetForm()
      router.refresh()
    } catch (error) {
      console.error('Error saving fact:', error)
      toast.error('Failed to save fact')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)
    try {
      const { error } = await supabase
        .from('tour_facts')
        .delete()
        .eq('id', deleteId)

      if (error) throw error

      setFacts(facts.filter(f => f.id !== deleteId))
      setDeleteId(null)
      toast.success('Fact deleted')
      router.refresh()
    } catch (error) {
      console.error('Error deleting fact:', error)
      toast.error('Failed to delete fact')
    } finally {
      setDeleting(false)
    }
  }

  const togglePublished = async (factItem: TourFact) => {
    try {
      const newValue = !factItem.is_published
      const { error } = await supabase
        .from('tour_facts')
        .update({ is_published: newValue })
        .eq('id', factItem.id)

      if (error) throw error

      setFacts(facts.map(f =>
        f.id === factItem.id ? { ...f, is_published: newValue } : f
      ))
      toast.success(newValue ? 'Fact published' : 'Fact unpublished')
    } catch (error) {
      console.error('Error toggling published:', error)
      toast.error('Failed to update fact')
    }
  }

  const factToDelete = facts.find(f => f.id === deleteId)
  const sortedFacts = [...facts].sort((a, b) => (a.display_order || 0) - (b.display_order || 0))

  return (
    <>
      <div className="space-y-6">
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Fact
        </Button>

        {facts.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No facts yet. Add your first &quot;Did you know?&quot; fact to get started.
          </p>
        ) : (
          <div className="space-y-2">
            {sortedFacts.map((factItem, index) => (
              <div
                key={factItem.id}
                className={`flex items-start gap-4 p-4 border rounded-lg bg-white hover:bg-gray-50 ${
                  !factItem.is_published ? 'opacity-60' : ''
                }`}
              >
                <div className="text-gray-400 mt-1">
                  <GripVertical className="h-5 w-5" />
                </div>

                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="h-5 w-5 text-green-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-gray-400">#{index + 1}</span>
                    {!factItem.is_published && (
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-gray-900 line-clamp-2">{factItem.fact}</p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditDialog(factItem)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => togglePublished(factItem)}>
                      {factItem.is_published ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Unpublish
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Publish
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDeleteId(factItem.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open)
        if (!open) resetForm()
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingFact ? 'Edit Fact' : 'Add Fact'}</DialogTitle>
            <DialogDescription>
              {editingFact
                ? 'Update this interesting fact'
                : 'Add a new "Did you know?" fact'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="fact">Fact *</Label>
                <Textarea
                  id="fact"
                  value={fact}
                  onChange={(e) => setFact(e.target.value)}
                  placeholder="e.g., The fort took 40 years to construct..."
                  rows={3}
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="published" className="cursor-pointer">
                  Published (visible in the app)
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving || !fact}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingFact ? 'Save Changes' : 'Add Fact'
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
            <DialogTitle>Delete Fact</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this fact? This action cannot be undone.
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
