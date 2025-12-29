import { render, screen } from '@testing-library/react'
import { Sidebar } from '@/components/sidebar'

// Mock next/navigation
const mockPush = jest.fn()
const mockRefresh = jest.fn()

jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}))

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signOut: jest.fn().mockResolvedValue({}),
    },
  }),
}))

describe('Sidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders iTour Admin title', () => {
    render(<Sidebar isSuperAdmin={false} />)
    expect(screen.getByText('iTour Admin')).toBeInTheDocument()
  })

  it('renders tenant navigation links for non-super admin', () => {
    render(<Sidebar isSuperAdmin={false} />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Manage Stops')).toBeInTheDocument()
    expect(screen.getByText('Donors')).toBeInTheDocument()
    expect(screen.getByText('Tour Settings')).toBeInTheDocument()

    // Super admin links should not be present
    expect(screen.queryByText('All Tours')).not.toBeInTheDocument()
    expect(screen.queryByText('Users')).not.toBeInTheDocument()
  })

  it('renders super admin navigation links for super admin', () => {
    render(<Sidebar isSuperAdmin={true} />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('All Tours')).toBeInTheDocument()
    expect(screen.getByText('Users')).toBeInTheDocument()

    // Tenant links should not be present
    expect(screen.queryByText('Manage Stops')).not.toBeInTheDocument()
    expect(screen.queryByText('Donors')).not.toBeInTheDocument()
  })

  it('displays Super Admin badge when isSuperAdmin is true', () => {
    render(<Sidebar isSuperAdmin={true} />)
    expect(screen.getByText('Super Admin')).toBeInTheDocument()
  })

  it('does not display Super Admin badge when isSuperAdmin is false', () => {
    render(<Sidebar isSuperAdmin={false} />)
    expect(screen.queryByText('Super Admin')).not.toBeInTheDocument()
  })

  it('displays tour name when provided', () => {
    render(<Sidebar isSuperAdmin={false} tourName="Fort Gaines" />)
    expect(screen.getByText('Fort Gaines')).toBeInTheDocument()
  })

  it('does not display tour name when not provided', () => {
    render(<Sidebar isSuperAdmin={false} />)
    expect(screen.queryByText('Fort Gaines')).not.toBeInTheDocument()
  })

  it('renders sign out button', () => {
    render(<Sidebar isSuperAdmin={false} />)
    expect(screen.getByText('Sign out')).toBeInTheDocument()
  })

  it('has correct number of navigation links for tenant', () => {
    render(<Sidebar isSuperAdmin={false} />)
    const navLinks = screen.getAllByRole('link')
    // Logo link + 4 nav links = 5 total
    expect(navLinks).toHaveLength(5)
  })

  it('has correct number of navigation links for super admin', () => {
    render(<Sidebar isSuperAdmin={true} />)
    const navLinks = screen.getAllByRole('link')
    // Logo link + 3 nav links = 4 total
    expect(navLinks).toHaveLength(4)
  })
})
