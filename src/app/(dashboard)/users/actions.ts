'use server'

import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

// Create admin client with service role for user management
function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase admin credentials')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export async function deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify the caller is a super admin
    const currentUser = await getAuthUser()
    if (!currentUser?.isSuperAdmin) {
      return { success: false, error: 'Unauthorized: Super admin access required' }
    }

    // Prevent self-deletion
    if (userId === currentUser.id) {
      return { success: false, error: 'Cannot delete your own account' }
    }

    const adminClient = createAdminClient()
    const supabase = await createServerClient()

    // First, delete from our users table
    const { error: profileError } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)

    if (profileError) {
      console.error('Error deleting user profile:', profileError)
      return { success: false, error: 'Failed to delete user profile' }
    }

    // Then delete from Supabase Auth
    const { error: authError } = await adminClient.auth.admin.deleteUser(userId)

    if (authError) {
      console.error('Error deleting auth user:', authError)
      // Profile is already deleted, but auth deletion failed
      return { success: false, error: 'User profile deleted but auth cleanup failed' }
    }

    revalidatePath('/users')
    return { success: true }
  } catch (error) {
    console.error('Error in deleteUser:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function setUserPassword(userId: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify the caller is a super admin
    const currentUser = await getAuthUser()
    if (!currentUser?.isSuperAdmin) {
      return { success: false, error: 'Unauthorized: Super admin access required' }
    }

    if (newPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' }
    }

    const adminClient = createAdminClient()

    // Update the user's password directly
    const { error } = await adminClient.auth.admin.updateUserById(userId, {
      password: newPassword,
    })

    if (error) {
      console.error('Error setting password:', error)
      return { success: false, error: 'Failed to set password' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in setUserPassword:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function createUser(data: {
  email: string
  password: string
  name?: string
  role: 'admin' | 'super_admin'
  tourId?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify the caller is a super admin
    const currentUser = await getAuthUser()
    if (!currentUser?.isSuperAdmin) {
      return { success: false, error: 'Unauthorized: Super admin access required' }
    }

    if (data.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' }
    }

    const adminClient = createAdminClient()
    const supabase = await createServerClient()

    // Create auth user with admin API (no email verification)
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        name: data.name,
      },
    })

    if (authError) {
      console.error('Error creating auth user:', authError)
      if (authError.message.includes('already been registered')) {
        return { success: false, error: 'A user with this email already exists' }
      }
      return { success: false, error: 'Failed to create user' }
    }

    if (!authData.user) {
      return { success: false, error: 'Failed to create user' }
    }

    // Create user profile in our users table
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: data.email,
        name: data.name || null,
        tour_id: data.role === 'super_admin' ? null : data.tourId || null,
        role: data.role,
      })

    if (profileError) {
      console.error('Error creating user profile:', profileError)
      // Try to clean up the auth user
      await adminClient.auth.admin.deleteUser(authData.user.id)
      return { success: false, error: 'Failed to create user profile' }
    }

    revalidatePath('/users')
    return { success: true }
  } catch (error) {
    console.error('Error in createUser:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}
