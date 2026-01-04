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
import {
  Plus, MoreVertical, Edit, Trash2, Loader2, Eye, EyeOff, GripVertical, Volume2,
  // Icons for section picker - verified to exist in lucide-react
  FileText, BookOpen, Shield, Info, Building, Map, Utensils, TreePine, Users, HelpCircle,
  Lightbulb, Image, Camera, Video, Music, Mic, Phone, Mail, Globe, Link, Star, Heart,
  Flag, Bookmark, Clock, Calendar, Sun, Moon, Cloud, Compass, Navigation, MapPin,
  Home, Castle, Church, Landmark, Mountain, Waves, Anchor, Ship, Plane, Car, Train,
  Bike, Footprints, Eye as EyeIcon, Glasses, Zap, Flame, Snowflake, Leaf, Flower2,
  Bird, Fish, Bug, Crown, Award, Trophy, Gift, Package, ShoppingBag, Coffee, Apple,
  Cake, Scissors, Brush, Palette, Pencil, Hammer, Wrench, Settings, Key, Lock, Unlock,
  Activity, AlertCircle, Atom, Banknote, Book, Clipboard, Construction, Contact, CreditCard,
  Diamond, Droplet, Fingerprint, Folder, Gamepad2, GraduationCap, Headphones, History,
  Hourglass, Library, Megaphone, MessageCircle, Microscope, Newspaper, Podcast, Quote,
  Radio, Receipt, Recycle, Rocket, Ruler, Scale, School, Send, Share, ShoppingCart,
  Speaker, Sparkles, Stethoscope, StickyNote, Store, Swords, Syringe, Target, Tent,
  Thermometer, ThumbsDown, ThumbsUp, Ticket, Truck, Umbrella, University, Wallet, Warehouse
} from 'lucide-react'

// Comprehensive icon options for section tabs
const SECTION_ICONS = [
  // Documents & Text
  { value: 'article', label: 'Article', icon: FileText },
  { value: 'book', label: 'Book', icon: Book },
  { value: 'book_open', label: 'Book Open', icon: BookOpen },
  { value: 'newspaper', label: 'Newspaper', icon: Newspaper },
  { value: 'clipboard', label: 'Clipboard', icon: Clipboard },
  { value: 'sticky_note', label: 'Sticky Note', icon: StickyNote },
  { value: 'quote', label: 'Quote', icon: Quote },
  { value: 'library', label: 'Library', icon: Library },
  { value: 'folder', label: 'Folder', icon: Folder },

  // History & Education
  { value: 'history', label: 'History', icon: History },
  { value: 'graduation', label: 'Graduation', icon: GraduationCap },
  { value: 'school', label: 'School', icon: School },
  { value: 'university', label: 'University', icon: University },
  { value: 'hourglass', label: 'Hourglass', icon: Hourglass },
  { value: 'clock', label: 'Clock', icon: Clock },
  { value: 'calendar', label: 'Calendar', icon: Calendar },

  // Military & Protection
  { value: 'shield', label: 'Shield', icon: Shield },
  { value: 'swords', label: 'Swords', icon: Swords },
  { value: 'crown', label: 'Crown', icon: Crown },
  { value: 'flag', label: 'Flag', icon: Flag },
  { value: 'award', label: 'Award', icon: Award },
  { value: 'trophy', label: 'Trophy', icon: Trophy },

  // Information & Help
  { value: 'info', label: 'Info', icon: Info },
  { value: 'help', label: 'Help', icon: HelpCircle },
  { value: 'lightbulb', label: 'Lightbulb', icon: Lightbulb },
  { value: 'alert', label: 'Alert', icon: AlertCircle },
  { value: 'message', label: 'Message', icon: MessageCircle },
  { value: 'megaphone', label: 'Megaphone', icon: Megaphone },

  // Buildings & Landmarks
  { value: 'building', label: 'Building', icon: Building },
  { value: 'castle', label: 'Castle', icon: Castle },
  { value: 'church', label: 'Church', icon: Church },
  { value: 'landmark', label: 'Landmark', icon: Landmark },
  { value: 'home', label: 'Home', icon: Home },
  { value: 'store', label: 'Store', icon: Store },
  { value: 'warehouse', label: 'Warehouse', icon: Warehouse },
  { value: 'tent', label: 'Tent', icon: Tent },

  // Navigation & Maps
  { value: 'map', label: 'Map', icon: Map },
  { value: 'map_pin', label: 'Map Pin', icon: MapPin },
  { value: 'compass', label: 'Compass', icon: Compass },
  { value: 'navigation', label: 'Navigation', icon: Navigation },
  { value: 'globe', label: 'Globe', icon: Globe },

  // Nature & Environment
  { value: 'tree', label: 'Tree', icon: TreePine },
  { value: 'leaf', label: 'Leaf', icon: Leaf },
  { value: 'flower', label: 'Flower', icon: Flower2 },
  { value: 'mountain', label: 'Mountain', icon: Mountain },
  { value: 'waves', label: 'Waves', icon: Waves },
  { value: 'sun', label: 'Sun', icon: Sun },
  { value: 'moon', label: 'Moon', icon: Moon },
  { value: 'cloud', label: 'Cloud', icon: Cloud },
  { value: 'snowflake', label: 'Snowflake', icon: Snowflake },
  { value: 'flame', label: 'Flame', icon: Flame },
  { value: 'droplet', label: 'Droplet', icon: Droplet },

  // Animals
  { value: 'bird', label: 'Bird', icon: Bird },
  { value: 'fish', label: 'Fish', icon: Fish },
  { value: 'bug', label: 'Bug', icon: Bug },

  // People & Community
  { value: 'users', label: 'Users', icon: Users },
  { value: 'contact', label: 'Contact', icon: Contact },

  // Food & Dining
  { value: 'utensils', label: 'Utensils', icon: Utensils },
  { value: 'coffee', label: 'Coffee', icon: Coffee },
  { value: 'cake', label: 'Cake', icon: Cake },
  { value: 'apple', label: 'Apple', icon: Apple },

  // Transportation
  { value: 'car', label: 'Car', icon: Car },
  { value: 'train', label: 'Train', icon: Train },
  { value: 'plane', label: 'Plane', icon: Plane },
  { value: 'ship', label: 'Ship', icon: Ship },
  { value: 'anchor', label: 'Anchor', icon: Anchor },
  { value: 'bike', label: 'Bike', icon: Bike },
  { value: 'truck', label: 'Truck', icon: Truck },
  { value: 'footprints', label: 'Walking', icon: Footprints },

  // Media & Entertainment
  { value: 'image', label: 'Image', icon: Image },
  { value: 'camera', label: 'Camera', icon: Camera },
  { value: 'video', label: 'Video', icon: Video },
  { value: 'music', label: 'Music', icon: Music },
  { value: 'mic', label: 'Microphone', icon: Mic },
  { value: 'headphones', label: 'Headphones', icon: Headphones },
  { value: 'speaker', label: 'Speaker', icon: Speaker },
  { value: 'radio', label: 'Radio', icon: Radio },
  { value: 'podcast', label: 'Podcast', icon: Podcast },
  { value: 'gamepad', label: 'Gamepad', icon: Gamepad2 },

  // Activities
  { value: 'activity', label: 'Activity', icon: Activity },
  { value: 'target', label: 'Target', icon: Target },
  { value: 'zap', label: 'Zap', icon: Zap },
  { value: 'rocket', label: 'Rocket', icon: Rocket },
  { value: 'sparkles', label: 'Sparkles', icon: Sparkles },

  // Tools & Work
  { value: 'hammer', label: 'Hammer', icon: Hammer },
  { value: 'wrench', label: 'Wrench', icon: Wrench },
  { value: 'construction', label: 'Construction', icon: Construction },
  { value: 'settings', label: 'Settings', icon: Settings },
  { value: 'scissors', label: 'Scissors', icon: Scissors },
  { value: 'brush', label: 'Brush', icon: Brush },
  { value: 'palette', label: 'Palette', icon: Palette },
  { value: 'pencil', label: 'Pencil', icon: Pencil },
  { value: 'ruler', label: 'Ruler', icon: Ruler },

  // Science & Medicine
  { value: 'microscope', label: 'Microscope', icon: Microscope },
  { value: 'atom', label: 'Atom', icon: Atom },
  { value: 'stethoscope', label: 'Stethoscope', icon: Stethoscope },
  { value: 'thermometer', label: 'Thermometer', icon: Thermometer },
  { value: 'syringe', label: 'Syringe', icon: Syringe },

  // Shopping & Commerce
  { value: 'shopping_bag', label: 'Shopping Bag', icon: ShoppingBag },
  { value: 'shopping_cart', label: 'Shopping Cart', icon: ShoppingCart },
  { value: 'gift', label: 'Gift', icon: Gift },
  { value: 'package', label: 'Package', icon: Package },
  { value: 'ticket', label: 'Ticket', icon: Ticket },
  { value: 'receipt', label: 'Receipt', icon: Receipt },
  { value: 'wallet', label: 'Wallet', icon: Wallet },
  { value: 'banknote', label: 'Banknote', icon: Banknote },
  { value: 'credit_card', label: 'Credit Card', icon: CreditCard },

  // Favorites & Ratings
  { value: 'star', label: 'Star', icon: Star },
  { value: 'heart', label: 'Heart', icon: Heart },
  { value: 'bookmark', label: 'Bookmark', icon: Bookmark },
  { value: 'thumbs_up', label: 'Thumbs Up', icon: ThumbsUp },
  { value: 'thumbs_down', label: 'Thumbs Down', icon: ThumbsDown },
  { value: 'diamond', label: 'Diamond', icon: Diamond },

  // Security & Access
  { value: 'key', label: 'Key', icon: Key },
  { value: 'lock', label: 'Lock', icon: Lock },
  { value: 'unlock', label: 'Unlock', icon: Unlock },
  { value: 'fingerprint', label: 'Fingerprint', icon: Fingerprint },
  { value: 'eye', label: 'Eye', icon: EyeIcon },
  { value: 'glasses', label: 'Glasses', icon: Glasses },

  // Communication
  { value: 'phone', label: 'Phone', icon: Phone },
  { value: 'mail', label: 'Mail', icon: Mail },
  { value: 'send', label: 'Send', icon: Send },
  { value: 'share', label: 'Share', icon: Share },
  { value: 'link', label: 'Link', icon: Link },

  // Miscellaneous
  { value: 'umbrella', label: 'Umbrella', icon: Umbrella },
  { value: 'recycle', label: 'Recycle', icon: Recycle },
  { value: 'scale', label: 'Scale', icon: Scale },
] as const

import { TourSection } from '@/lib/database.types'

function getIconComponent(iconValue: string | null) {
  const iconDef = SECTION_ICONS.find(i => i.value === iconValue)
  return iconDef?.icon ?? FileText
}

// Generate English TTS audio for a section
async function generateSectionTTS(sectionId: string, title: string, content: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-tts`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ section_id: sectionId, title, content }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error('TTS generation failed:', data)
      return { success: false, error: data.error || 'TTS generation failed' }
    }

    return { success: true }
  } catch (err) {
    console.error('TTS generation error:', err)
    return { success: false, error: 'Failed to connect to TTS service' }
  }
}

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
  const [icon, setIcon] = useState('article')
  const [isPublished, setIsPublished] = useState(true)

  const [saving, setSaving] = useState(false)
  const [generatingTTS, setGeneratingTTS] = useState(false)
  const [ttsStatus, setTtsStatus] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const resetForm = () => {
    setTitle('')
    setContent('')
    setIcon('article')
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
    setIcon(section.icon ?? 'article')
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
        icon,
        is_published: isPublished,
        display_order: editingSection?.display_order ?? maxOrder + 1,
      }

      let sectionId: string

      if (editingSection) {
        const { error } = await supabase
          .from('tour_sections')
          .update(sectionData)
          .eq('id', editingSection.id)

        if (error) throw error

        sectionId = editingSection.id
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

        sectionId = data.id
        setSections([...sections, data])
        toast.success('Section created')
      }

      // Generate English TTS audio
      setGeneratingTTS(true)
      setTtsStatus('Generating audio narration...')
      const ttsResult = await generateSectionTTS(sectionId, title, content)
      setGeneratingTTS(false)
      if (!ttsResult.success) {
        console.warn('TTS generation failed:', ttsResult.error)
        setTtsStatus('Audio generation failed (section saved)')
        // Clear status after 3 seconds
        setTimeout(() => setTtsStatus(null), 3000)
      } else {
        setTtsStatus(null)
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
                  {(() => {
                    const IconComponent = getIconComponent(section.icon)
                    return <IconComponent className="h-5 w-5 text-blue-600" />
                  })()}
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., History, Visitor Info"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tab Icon</Label>
                  <div className="h-48 overflow-y-auto overflow-x-hidden border rounded-md p-3 bg-gray-50">
                    <div className="flex flex-wrap gap-2">
                      {SECTION_ICONS.map(({ value, label, icon: IconComp }) => {
                        const Icon = IconComp
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setIcon(value)}
                            className={`w-10 h-10 shrink-0 rounded border transition-colors flex items-center justify-center ${
                              icon === value
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'bg-white hover:bg-gray-100 text-gray-600 border-gray-300'
                            }`}
                            title={label}
                          >
                            <Icon className="h-5 w-5" />
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
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
            {ttsStatus && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-md text-sm">
                <Volume2 className="h-4 w-4" />
                {ttsStatus}
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving || generatingTTS || !title || !content}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : generatingTTS ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Audio...
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
