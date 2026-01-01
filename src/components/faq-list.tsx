'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Plus, MoreVertical, Edit, Trash2, Loader2, HelpCircle, Eye, EyeOff, GripVertical } from 'lucide-react'
import { TourFaq } from '@/lib/database.types'

interface FaqListProps {
  faqs: TourFaq[]
  tourId: string
}

export function FaqList({ faqs: initialFaqs, tourId }: FaqListProps) {
  const [faqs, setFaqs] = useState(initialFaqs)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFaq, setEditingFaq] = useState<TourFaq | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Form state
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [isPublished, setIsPublished] = useState(true)

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const resetForm = () => {
    setQuestion('')
    setAnswer('')
    setIsPublished(true)
    setEditingFaq(null)
  }

  const openAddDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (faq: TourFaq) => {
    setEditingFaq(faq)
    setQuestion(faq.question)
    setAnswer(faq.answer)
    setIsPublished(faq.is_published ?? true)
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const maxOrder = faqs.length > 0
        ? Math.max(...faqs.map(f => f.display_order || 0))
        : 0

      const faqData = {
        tour_id: tourId,
        question,
        answer,
        is_published: isPublished,
        display_order: editingFaq?.display_order ?? maxOrder + 1,
      }

      if (editingFaq) {
        const { error } = await supabase
          .from('tour_faqs')
          .update(faqData)
          .eq('id', editingFaq.id)

        if (error) throw error

        setFaqs(faqs.map(f =>
          f.id === editingFaq.id ? { ...f, ...faqData } : f
        ))
        toast.success('FAQ updated')
      } else {
        const { data, error } = await supabase
          .from('tour_faqs')
          .insert(faqData)
          .select()
          .single()

        if (error) throw error

        setFaqs([...faqs, data])
        toast.success('FAQ created')
      }

      setIsDialogOpen(false)
      resetForm()
      router.refresh()
    } catch (error) {
      console.error('Error saving FAQ:', error)
      toast.error('Failed to save FAQ')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)
    try {
      const { error } = await supabase
        .from('tour_faqs')
        .delete()
        .eq('id', deleteId)

      if (error) throw error

      setFaqs(faqs.filter(f => f.id !== deleteId))
      setDeleteId(null)
      toast.success('FAQ deleted')
      router.refresh()
    } catch (error) {
      console.error('Error deleting FAQ:', error)
      toast.error('Failed to delete FAQ')
    } finally {
      setDeleting(false)
    }
  }

  const togglePublished = async (faq: TourFaq) => {
    try {
      const newValue = !faq.is_published
      const { error } = await supabase
        .from('tour_faqs')
        .update({ is_published: newValue })
        .eq('id', faq.id)

      if (error) throw error

      setFaqs(faqs.map(f =>
        f.id === faq.id ? { ...f, is_published: newValue } : f
      ))
      toast.success(newValue ? 'FAQ published' : 'FAQ unpublished')
    } catch (error) {
      console.error('Error toggling published:', error)
      toast.error('Failed to update FAQ')
    }
  }

  const faqToDelete = faqs.find(f => f.id === deleteId)
  const sortedFaqs = [...faqs].sort((a, b) => (a.display_order || 0) - (b.display_order || 0))

  return (
    <>
      <div className="space-y-6">
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add FAQ
        </Button>

        {faqs.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No FAQs yet. Add your first frequently asked question to get started.
          </p>
        ) : (
          <div className="space-y-2">
            {sortedFaqs.map((faq, index) => (
              <div
                key={faq.id}
                className={`flex items-start gap-4 p-4 border rounded-lg bg-white hover:bg-gray-50 ${
                  !faq.is_published ? 'opacity-60' : ''
                }`}
              >
                <div className="text-gray-400 mt-1">
                  <GripVertical className="h-5 w-5" />
                </div>

                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="h-5 w-5 text-amber-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">#{index + 1}</span>
                    <h3 className="font-medium text-gray-900">{faq.question}</h3>
                    {!faq.is_published && (
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {faq.answer}
                  </p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditDialog(faq)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => togglePublished(faq)}>
                      {faq.is_published ? (
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
                    <DropdownMenuItem onClick={() => setDeleteId(faq.id)} className="text-red-600">
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
            <DialogTitle>{editingFaq ? 'Edit FAQ' : 'Add FAQ'}</DialogTitle>
            <DialogDescription>
              {editingFaq
                ? 'Update this frequently asked question'
                : 'Add a new frequently asked question'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="question">Question *</Label>
                <Input
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g., How long did it take to build the fort?"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="answer">Answer *</Label>
                <Textarea
                  id="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Provide a clear, helpful answer..."
                  rows={4}
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
              <Button type="submit" disabled={saving || !question || !answer}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingFaq ? 'Save Changes' : 'Add FAQ'
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
            <DialogTitle>Delete FAQ</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this FAQ? This action cannot be undone.
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
