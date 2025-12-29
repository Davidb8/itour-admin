import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { TourSettingsForm } from './tour-settings-form'

export default async function SettingsPage() {
  const user = await getAuthUser()

  if (!user) {
    redirect('/login')
  }

  if (user.isSuperAdmin) {
    redirect('/dashboard')
  }

  if (!user.tourId) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">No Tour Assigned</h1>
        <p className="text-gray-600 mt-2">
          Contact your administrator to be assigned to a tour.
        </p>
      </div>
    )
  }

  const supabase = await createClient()

  const { data: tour } = await supabase
    .from('tours')
    .select('*')
    .eq('id', user.tourId)
    .single()

  if (!tour) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900">Tour Not Found</h1>
        <p className="text-gray-600 mt-2">
          The tour assigned to your account could not be found.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tour Settings</h1>
        <p className="text-gray-600 mt-1">
          Configure your tour information and donation settings
        </p>
      </div>

      <TourSettingsForm tour={tour} />
    </div>
  )
}
