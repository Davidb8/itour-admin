'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RichTextEditor } from '@/components/rich-text-editor'
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
import { Plus, MoreVertical, Edit, Trash2, Loader2, FileText, Eye, EyeOff, GripVertical } from 'lucide-react'
import { TourSection } from '@/lib/database.types'

interface SectionListProps {
  sections: TourSection[]
  tourId: string
}

export function SectionList({ sections: initialSections, tourId }: SectionListProps) {
  const [sections, setSections] = useState(initialSections)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<TourSection | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Form state
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isPublished, setIsPublished] = useState(true)

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const resetForm = () => {
    setTitle('')
    setContent('')
    setIsPublished(true)
    setEditingSection(null)
  }

  const openAddDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (section: TourSection) => {
    setEditingSection(section)
    setTitle(section.title)
    setContent(section.content)
    setIsPublished(section.is_published ?? true)
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const maxOrder = sections.length > 0
        ? Math.max(...sections.map(s => s.display_order || 0))
        : 0

      const sectionData = {
        tour_id: tourId,
        title,
        content,
        is_published: isPublished,
        display_order: editingSection?.display_order ?? maxOrder + 1,
      }

      if (editingSection) {
        const { error } = await supabase
          .from('tour_sections')
          .update(sectionData)
          .eq('id', editingSection.id)

        if (error) throw error

        setSections(sections.map(s =>
          s.id === editingSection.id ? { ...s, ...sectionData } : s
        ))
        toast.success('Section updated')
      } else {
        const { data, error } = await supabase
          .from('tour_sections')
          .insert(sectionData)
          .select()
          .single()

        if (error) throw error

        setSections([...sections, data])
        toast.success('Section created')
      }

      setIsDialogOpen(false)
      resetForm()
      router.refresh()
    } catch (error) {
      console.error('Error saving section:', error)
      toast.error('Failed to save section')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)
    try {
      const { error } = await supabase
        .from('tour_sections')
        .delete()
        .eq('id', deleteId)

      if (error) throw error

      setSections(sections.filter(s => s.id !== deleteId))
      setDeleteId(null)
      toast.success('Section deleted')
      router.refresh()
    } catch (error) {
      console.error('Error deleting section:', error)
      toast.error('Failed to delete section')
    } finally {
      setDeleting(false)
    }
  }

  const togglePublished = async (section: TourSection) => {
    try {
      const newValue = !section.is_published
      const { error } = await supabase
        .from('tour_sections')
        .update({ is_published: newValue })
        .eq('id', section.id)

      if (error) throw error

      setSections(sections.map(s =>
        s.id === section.id ? { ...s, is_published: newValue } : s
      ))
      toast.success(newValue ? 'Section published' : 'Section unpublished')
    } catch (error) {
      console.error('Error toggling published:', error)
      toast.error('Failed to update section')
    }
  }

  const sectionToDelete = sections.find(s => s.id === deleteId)
  const sortedSections = [...sections].sort((a, b) => (a.display_order || 0) - (b.display_order || 0))

  return (
    <>
      <div className="space-y-6">
        <Button onClick={openAddDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>

        {sections.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No sections yet. Add your first section to get started.
          </p>
        ) : (
          <div className="space-y-2">
            {sortedSections.map((section, index) => (
              <div
                key={section.id}
                className={`flex items-center gap-4 p-4 border rounded-lg bg-white hover:bg-gray-50 ${
                  !section.is_published ? 'opacity-60' : ''
                }`}
              >
                <div className="text-gray-400">
                  <GripVertical className="h-5 w-5" />
                </div>

                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">#{index + 1}</span>
                    <h3 className="font-medium text-gray-900">{section.title}</h3>
                    {!section.is_published && (
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {section.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                  </p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditDialog(section)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => togglePublished(section)}>
                      {section.is_published ? (
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
                    <DropdownMenuItem onClick={() => setDeleteId(section.id)} className="text-red-600">
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSection ? 'Edit Section' : 'Add Section'}</DialogTitle>
            <DialogDescription>
              {editingSection
                ? 'Update section content'
                : 'Add a new content section to your tour'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Fort Overview, History, About Us"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Content *</Label>
                <RichTextEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Write your section content here..."
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
              <Button type="submit" disabled={saving || !title || !content}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingSection ? 'Save Changes' : 'Add Section'
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
            <DialogTitle>Delete Section</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{sectionToDelete?.title}&quot;? This action cannot be undone.
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
