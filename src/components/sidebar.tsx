'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  MapPin,
  Heart,
  Settings,
  Map,
  Users,
  LogOut,
  MapPinned,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface SidebarProps {
  isSuperAdmin: boolean
  tourName?: string
}

export function Sidebar({ isSuperAdmin, tourName }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const tenantLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/stops', label: 'Manage Stops', icon: MapPin },
    { href: '/sections', label: 'Content Sections', icon: FileText },
    { href: '/donors', label: 'Donors', icon: Heart },
    { href: '/settings', label: 'Tour Settings', icon: Settings },
  ]

  const superAdminLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/tours', label: 'All Tours', icon: Map },
    { href: '/users', label: 'Users', icon: Users },
  ]

  const links = isSuperAdmin ? superAdminLinks : tenantLinks

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white w-64">
      <div className="p-4 border-b border-gray-800">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <MapPinned className="w-4 h-4" />
          </div>
          <span className="font-semibold">iTour Admin</span>
        </Link>
        {tourName && (
          <p className="text-xs text-gray-400 mt-2 truncate">{tourName}</p>
        )}
        {isSuperAdmin && (
          <span className="inline-block mt-2 text-xs bg-purple-600 px-2 py-0.5 rounded">
            Super Admin
          </span>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href ||
            (link.href !== '/dashboard' && pathname.startsWith(link.href))

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              )}
            >
              <Icon className="w-4 h-4" />
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Sign out
        </Button>
      </div>
    </div>
  )
}
