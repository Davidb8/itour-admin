'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Image as ImageIcon, Edit, Trash2, Loader2 } from 'lucide-react'
import { Stop } from '@/lib/database.types'
import { SortableList } from '@/components/sortable-list'

type StopWithImages = Stop & {
  image_count: number
  first_image_url: string | null
}

interface TourStopListProps {
  stops: StopWithImages[]
  tourId: string
  basePath: string // e.g., "/tours/abc123/stops"
}

export function TourStopList({ stops: initialStops, tourId, basePath }: TourStopListProps) {
  const [stops, setStops] = useState(initialStops)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [reordering, setReordering] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)
    try {
      const { error } = await supabase
        .from('stops')
        .delete()
        .eq('id', deleteId)

      if (error) throw error

      setStops(stops.filter(s => s.id !== deleteId))
      setDeleteId(null)
      router.refresh()
    } catch (error) {
      console.error('Error deleting stop:', error)
      toast.error('Failed to delete stop')
    } finally {
      setDeleting(false)
    }
  }

  const handleReorder = async (newStops: StopWithImages[]) => {
    if (reordering) return

    setReordering(true)

    // Update local state immediately for responsive UI
    const reorderedStops = newStops.map((stop, i) => ({
      ...stop,
      display_order: i + 1,
    }))
    setStops(reorderedStops)

    try {
      // Update display_order for all stops
      for (const [index, stop] of newStops.entries()) {
        await supabase
          .from('stops')
          .update({ display_order: index + 1 })
          .eq('id', stop.id)
      }
      router.refresh()
    } catch (error) {
      console.error('Error reordering stops:', error)
      setStops(initialStops)
    } finally {
      setReordering(false)
    }
  }

  const stopToDelete = stops.find(s => s.id === deleteId)

  return (
    <>
      <SortableList
        items={stops}
        onReorder={handleReorder}
        disabled={reordering}
        className="space-y-2"
        renderItem={(stop) => (
          <div className="flex items-center gap-4 p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors flex-1">
            <div className="w-6 text-center text-sm font-medium text-gray-400">
              {stop.display_order}
            </div>

            {stop.first_image_url ? (
              <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                <img
                  src={stop.first_image_url}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <ImageIcon className="h-6 w-6 text-gray-300" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">{stop.title}</h3>
              <p className="text-sm text-gray-500">
                {stop.image_count} {stop.image_count === 1 ? 'photo' : 'photos'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href={`${basePath}/${stop.id}`}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setDeleteId(stop.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        renderOverlay={(stop) => (
          <div className="flex items-center gap-4 p-4 border rounded-lg bg-white shadow-lg">
            <div className="w-6 text-center text-sm font-medium text-gray-400">
              {stop.display_order}
            </div>
            {stop.first_image_url ? (
              <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                <img src={stop.first_image_url} alt="" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <ImageIcon className="h-6 w-6 text-gray-300" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">{stop.title}</h3>
              <p className="text-sm text-gray-500">
                {stop.image_count} {stop.image_count === 1 ? 'photo' : 'photos'}
              </p>
            </div>
          </div>
        )}
      />

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Stop</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{stopToDelete?.title}&quot;? This will also delete all photos associated with this stop. This action cannot be undone.
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
