import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'

export default async function DonorsPage() {
  const user = await getAuthUser()

  if (!user) {
    redirect('/login')
  }

  // Donors are managed per-tour by super admins via /tours/[id]/donors
  // Redirect everyone to dashboard
  redirect('/dashboard')
}
