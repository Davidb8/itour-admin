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
  Plus, MoreVertical, Edit, Trash2, Loader2, Eye, EyeOff, GripVertical, Volume2
} from 'lucide-react'

// Material Icon component - renders icons from Google Material Symbols font
// These match exactly with Flutter's Material Icons
function MaterialIcon({ name, className = '' }: { name: string; className?: string }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontSize: 'inherit' }}
    >
      {name}
    </span>
  )
}

// Section icons using Material Symbols - these match Flutter's Material Icons exactly
// The 'value' is stored in the database, 'materialIcon' is the Material Symbol name
const SECTION_ICONS = [
  // Documents & Text
  { value: 'article', label: 'Article', materialIcon: 'article' },
  { value: 'book', label: 'Book', materialIcon: 'menu_book' },
  { value: 'book_open', label: 'Book Open', materialIcon: 'auto_stories' },
  { value: 'newspaper', label: 'Newspaper', materialIcon: 'newspaper' },
  { value: 'clipboard', label: 'Clipboard', materialIcon: 'assignment' },
  { value: 'sticky_note', label: 'Sticky Note', materialIcon: 'sticky_note_2' },
  { value: 'quote', label: 'Quote', materialIcon: 'format_quote' },
  { value: 'library', label: 'Library', materialIcon: 'local_library' },
  { value: 'folder', label: 'Folder', materialIcon: 'folder' },

  // History & Education
  { value: 'history', label: 'History', materialIcon: 'history' },
  { value: 'history_edu', label: 'History Edu', materialIcon: 'history_edu' },
  { value: 'graduation', label: 'Graduation', materialIcon: 'school' },
  { value: 'school', label: 'School', materialIcon: 'school' },
  { value: 'university', label: 'University', materialIcon: 'account_balance' },
  { value: 'hourglass', label: 'Hourglass', materialIcon: 'hourglass_empty' },
  { value: 'clock', label: 'Clock', materialIcon: 'access_time' },
  { value: 'calendar', label: 'Calendar', materialIcon: 'calendar_today' },

  // Military & Protection
  { value: 'shield', label: 'Shield', materialIcon: 'shield' },
  { value: 'military_tech', label: 'Military', materialIcon: 'military_tech' },
  { value: 'swords', label: 'Combat', materialIcon: 'sports_kabaddi' },
  { value: 'crown', label: 'Crown', materialIcon: 'workspace_premium' },
  { value: 'flag', label: 'Flag', materialIcon: 'flag' },
  { value: 'award', label: 'Award', materialIcon: 'emoji_events' },
  { value: 'trophy', label: 'Trophy', materialIcon: 'emoji_events' },

  // Information & Help
  { value: 'info', label: 'Info', materialIcon: 'info' },
  { value: 'help', label: 'Help', materialIcon: 'help' },
  { value: 'lightbulb', label: 'Lightbulb', materialIcon: 'lightbulb' },
  { value: 'alert', label: 'Alert', materialIcon: 'warning_amber' },
  { value: 'message', label: 'Message', materialIcon: 'message' },
  { value: 'megaphone', label: 'Megaphone', materialIcon: 'campaign' },

  // Buildings & Landmarks
  { value: 'building', label: 'Building', materialIcon: 'business' },
  { value: 'museum', label: 'Museum', materialIcon: 'museum' },
  { value: 'castle', label: 'Castle', materialIcon: 'castle' },
  { value: 'church', label: 'Church', materialIcon: 'church' },
  { value: 'landmark', label: 'Landmark', materialIcon: 'location_city' },
  { value: 'home', label: 'Home', materialIcon: 'home' },
  { value: 'store', label: 'Store', materialIcon: 'store' },
  { value: 'warehouse', label: 'Warehouse', materialIcon: 'warehouse' },
  { value: 'tent', label: 'Tent', materialIcon: 'holiday_village' },

  // Navigation & Maps
  { value: 'map', label: 'Map', materialIcon: 'map' },
  { value: 'map_pin', label: 'Map Pin', materialIcon: 'place' },
  { value: 'compass', label: 'Compass', materialIcon: 'explore' },
  { value: 'navigation', label: 'Navigation', materialIcon: 'navigation' },
  { value: 'globe', label: 'Globe', materialIcon: 'public' },

  // Nature & Environment
  { value: 'tree', label: 'Tree', materialIcon: 'park' },
  { value: 'leaf', label: 'Leaf', materialIcon: 'eco' },
  { value: 'flower', label: 'Flower', materialIcon: 'local_florist' },
  { value: 'mountain', label: 'Mountain', materialIcon: 'terrain' },
  { value: 'waves', label: 'Waves', materialIcon: 'waves' },
  { value: 'sun', label: 'Sun', materialIcon: 'wb_sunny' },
  { value: 'moon', label: 'Moon', materialIcon: 'nightlight' },
  { value: 'cloud', label: 'Cloud', materialIcon: 'cloud' },
  { value: 'snowflake', label: 'Snowflake', materialIcon: 'ac_unit' },
  { value: 'flame', label: 'Flame', materialIcon: 'local_fire_department' },
  { value: 'droplet', label: 'Droplet', materialIcon: 'water_drop' },

  // Animals
  { value: 'bird', label: 'Bird', materialIcon: 'flutter_dash' },
  { value: 'fish', label: 'Fish', materialIcon: 'set_meal' },
  { value: 'bug', label: 'Bug', materialIcon: 'bug_report' },
  { value: 'pets', label: 'Pets', materialIcon: 'pets' },

  // People & Community
  { value: 'users', label: 'Users', materialIcon: 'groups' },
  { value: 'person', label: 'Person', materialIcon: 'person' },
  { value: 'contact', label: 'Contact', materialIcon: 'contacts' },
  { value: 'handshake', label: 'Handshake', materialIcon: 'handshake' },

  // Food & Dining
  { value: 'utensils', label: 'Utensils', materialIcon: 'restaurant' },
  { value: 'coffee', label: 'Coffee', materialIcon: 'coffee' },
  { value: 'cake', label: 'Cake', materialIcon: 'cake' },
  { value: 'apple', label: 'Apple', materialIcon: 'apple' },

  // Transportation
  { value: 'car', label: 'Car', materialIcon: 'directions_car' },
  { value: 'train', label: 'Train', materialIcon: 'train' },
  { value: 'plane', label: 'Plane', materialIcon: 'flight' },
  { value: 'ship', label: 'Ship', materialIcon: 'directions_boat' },
  { value: 'anchor', label: 'Anchor', materialIcon: 'anchor' },
  { value: 'bike', label: 'Bike', materialIcon: 'pedal_bike' },
  { value: 'truck', label: 'Truck', materialIcon: 'local_shipping' },
  { value: 'footprints', label: 'Walking', materialIcon: 'directions_walk' },

  // Media & Entertainment
  { value: 'image', label: 'Image', materialIcon: 'image' },
  { value: 'camera', label: 'Camera', materialIcon: 'camera_alt' },
  { value: 'video', label: 'Video', materialIcon: 'videocam' },
  { value: 'music', label: 'Music', materialIcon: 'music_note' },
  { value: 'mic', label: 'Microphone', materialIcon: 'mic' },
  { value: 'headphones', label: 'Headphones', materialIcon: 'headphones' },
  { value: 'speaker', label: 'Speaker', materialIcon: 'speaker' },
  { value: 'radio', label: 'Radio', materialIcon: 'radio' },
  { value: 'podcast', label: 'Podcast', materialIcon: 'podcasts' },
  { value: 'gamepad', label: 'Gamepad', materialIcon: 'sports_esports' },

  // Activities
  { value: 'activity', label: 'Activity', materialIcon: 'trending_up' },
  { value: 'target', label: 'Target', materialIcon: 'gps_fixed' },
  { value: 'zap', label: 'Zap', materialIcon: 'bolt' },
  { value: 'rocket', label: 'Rocket', materialIcon: 'rocket_launch' },
  { value: 'sparkles', label: 'Sparkles', materialIcon: 'auto_awesome' },

  // Tools & Work
  { value: 'hammer', label: 'Hammer', materialIcon: 'hardware' },
  { value: 'wrench', label: 'Wrench', materialIcon: 'build' },
  { value: 'construction', label: 'Construction', materialIcon: 'construction' },
  { value: 'settings', label: 'Settings', materialIcon: 'settings' },
  { value: 'scissors', label: 'Scissors', materialIcon: 'content_cut' },
  { value: 'brush', label: 'Brush', materialIcon: 'brush' },
  { value: 'palette', label: 'Palette', materialIcon: 'palette' },
  { value: 'pencil', label: 'Pencil', materialIcon: 'edit' },
  { value: 'ruler', label: 'Ruler', materialIcon: 'straighten' },

  // Science & Medicine
  { value: 'microscope', label: 'Microscope', materialIcon: 'biotech' },
  { value: 'atom', label: 'Atom', materialIcon: 'science' },
  { value: 'stethoscope', label: 'Stethoscope', materialIcon: 'medical_services' },
  { value: 'thermometer', label: 'Thermometer', materialIcon: 'thermostat' },
  { value: 'syringe', label: 'Syringe', materialIcon: 'vaccines' },

  // Shopping & Commerce
  { value: 'shopping_bag', label: 'Shopping Bag', materialIcon: 'shopping_bag' },
  { value: 'shopping_cart', label: 'Shopping Cart', materialIcon: 'shopping_cart' },
  { value: 'gift', label: 'Gift', materialIcon: 'card_giftcard' },
  { value: 'package', label: 'Package', materialIcon: 'inventory_2' },
  { value: 'ticket', label: 'Ticket', materialIcon: 'confirmation_number' },
  { value: 'receipt', label: 'Receipt', materialIcon: 'receipt' },
  { value: 'wallet', label: 'Wallet', materialIcon: 'account_balance_wallet' },
  { value: 'banknote', label: 'Banknote', materialIcon: 'payments' },
  { value: 'credit_card', label: 'Credit Card', materialIcon: 'credit_card' },

  // Favorites & Ratings
  { value: 'star', label: 'Star', materialIcon: 'star' },
  { value: 'heart', label: 'Heart', materialIcon: 'favorite' },
  { value: 'bookmark', label: 'Bookmark', materialIcon: 'bookmark' },
  { value: 'thumbs_up', label: 'Thumbs Up', materialIcon: 'thumb_up' },
  { value: 'thumbs_down', label: 'Thumbs Down', materialIcon: 'thumb_down' },
  { value: 'diamond', label: 'Diamond', materialIcon: 'diamond' },

  // Security & Access
  { value: 'key', label: 'Key', materialIcon: 'vpn_key' },
  { value: 'lock', label: 'Lock', materialIcon: 'lock' },
  { value: 'unlock', label: 'Unlock', materialIcon: 'lock_open' },
  { value: 'fingerprint', label: 'Fingerprint', materialIcon: 'fingerprint' },
  { value: 'eye', label: 'Eye', materialIcon: 'visibility' },
  { value: 'glasses', label: 'Glasses', materialIcon: 'visibility' },

  // Communication
  { value: 'phone', label: 'Phone', materialIcon: 'phone' },
  { value: 'mail', label: 'Mail', materialIcon: 'mail' },
  { value: 'send', label: 'Send', materialIcon: 'send' },
  { value: 'share', label: 'Share', materialIcon: 'share' },
  { value: 'link', label: 'Link', materialIcon: 'link' },

  // Miscellaneous
  { value: 'umbrella', label: 'Umbrella', materialIcon: 'umbrella' },
  { value: 'recycle', label: 'Recycle', materialIcon: 'recycling' },
  { value: 'scale', label: 'Scale', materialIcon: 'balance' },
] as const

import { TourSection } from '@/lib/database.types'

function getMaterialIconName(iconValue: string | null): string {
  const iconDef = SECTION_ICONS.find(i => i.value === iconValue)
  return iconDef?.materialIcon ?? 'article'
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
  const [showDonateButton, setShowDonateButton] = useState(false)

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
    setShowDonateButton(false)
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
    setShowDonateButton(section.show_donate_button ?? false)
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
        show_donate_button: showDonateButton,
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

                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl text-blue-600">
                  <MaterialIcon name={getMaterialIconName(section.icon)} />
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
                    maxLength={20}
                    required
                  />
                  <p className="text-xs text-gray-500">{title.length}/20 characters</p>
                </div>

                <div className="space-y-2">
                  <Label>Tab Icon</Label>
                  <div className="h-48 overflow-y-auto overflow-x-hidden border rounded-md p-3 bg-gray-50">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {SECTION_ICONS.map(({ value, label, materialIcon }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setIcon(value)}
                          className={`w-10 h-10 shrink-0 rounded border transition-colors flex items-center justify-center text-xl ${
                            icon === value
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'bg-white hover:bg-gray-100 text-gray-600 border-gray-300'
                          }`}
                          title={label}
                        >
                          <MaterialIcon name={materialIcon} />
                        </button>
                      ))}
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

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showDonateButton"
                  checked={showDonateButton}
                  onChange={(e) => setShowDonateButton(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="showDonateButton" className="cursor-pointer">
                  Show donate button at bottom of section
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
