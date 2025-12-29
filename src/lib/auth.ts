import { createClient } from './supabase/server'
import { User } from './database.types'

export type AuthUser = {
  id: string
  email: string
  profile: User | null
  isSuperAdmin: boolean
  tourId: string | null
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Fetch user profile from our users table
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return {
    id: user.id,
    email: user.email || '',
    profile,
    isSuperAdmin: profile?.role === 'super_admin',
    tourId: profile?.tour_id || null,
  }
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getAuthUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  return user
}

export async function requireSuperAdmin(): Promise<AuthUser> {
  const user = await requireAuth()

  if (!user.isSuperAdmin) {
    throw new Error('Forbidden: Super admin access required')
  }

  return user
}
