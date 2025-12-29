import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getAuthUser()

  if (!user) {
    redirect('/login')
  }

  // Get tour name if user has a tour assigned
  let tourName: string | undefined
  if (user.tourId) {
    const supabase = await createClient()
    const { data: tour } = await supabase
      .from('tours')
      .select('name')
      .eq('id', user.tourId)
      .single()
    tourName = tour?.name
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isSuperAdmin={user.isSuperAdmin} tourName={tourName} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
