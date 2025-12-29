import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ImageUpload } from '@/components/image-upload'

// Mock Supabase client
const mockUpload = jest.fn()
const mockGetPublicUrl = jest.fn()

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    storage: {
      from: () => ({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
      }),
    },
  }),
}))

describe('ImageUpload', () => {
  const defaultProps = {
    tourId: 'test-tour',
    onUpload: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUpload.mockResolvedValue({ data: { path: 'test.jpg' }, error: null })
    mockGetPublicUrl.mockReturnValue({
      data: { publicUrl: 'https://example.com/test.jpg' },
    })
  })

  it('renders upload area with instructions', () => {
    render(<ImageUpload {...defaultProps} />)

    expect(screen.getByText('Click to upload')).toBeInTheDocument()
    expect(screen.getByText('or drag and drop')).toBeInTheDocument()
    expect(screen.getByText('PNG, JPG, GIF up to 10MB')).toBeInTheDocument()
  })

  it('has hidden file input', () => {
    render(<ImageUpload {...defaultProps} />)

    const fileInput = document.querySelector('input[type="file"]')
    expect(fileInput).toBeInTheDocument()
    expect(fileInput).toHaveClass('hidden')
  })

  it('accepts only image files', () => {
    render(<ImageUpload {...defaultProps} />)

    const fileInput = document.querySelector('input[type="file"]')
    expect(fileInput).toHaveAttribute('accept', 'image/*')
  })

  it('disables upload when disabled prop is true', () => {
    render(<ImageUpload {...defaultProps} disabled={true} />)

    const fileInput = document.querySelector('input[type="file"]')
    expect(fileInput).toBeDisabled()
  })

  it('shows error for non-image files', async () => {
    render(<ImageUpload {...defaultProps} />)

    const file = new File(['test'], 'test.txt', { type: 'text/plain' })
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(fileInput, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText('Please upload an image file')).toBeInTheDocument()
    })
    expect(mockUpload).not.toHaveBeenCalled()
  })

  it('shows error for files larger than 10MB', async () => {
    render(<ImageUpload {...defaultProps} />)

    // Create a mock file larger than 10MB
    const largeContent = new Array(11 * 1024 * 1024).fill('a').join('')
    const file = new File([largeContent], 'large.jpg', { type: 'image/jpeg' })

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    fireEvent.change(fileInput, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText('Image must be smaller than 10MB')).toBeInTheDocument()
    })
    expect(mockUpload).not.toHaveBeenCalled()
  })

  it('uploads valid image file', async () => {
    const onUpload = jest.fn()
    render(<ImageUpload {...defaultProps} onUpload={onUpload} />)

    const file = new File(['test image content'], 'test.jpg', { type: 'image/jpeg' })
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(fileInput, { target: { files: [file] } })

    await waitFor(() => {
      expect(mockUpload).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(onUpload).toHaveBeenCalledWith('https://example.com/test.jpg')
    })
  })

  it('shows loading state during upload', async () => {
    // Make upload take some time
    mockUpload.mockImplementation(() => new Promise(resolve =>
      setTimeout(() => resolve({ data: { path: 'test.jpg' }, error: null }), 100)
    ))

    render(<ImageUpload {...defaultProps} />)

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(fileInput, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText('Uploading...')).toBeInTheDocument()
    })
  })

  it('shows error on upload failure', async () => {
    mockUpload.mockResolvedValue({ data: null, error: new Error('Upload failed') })

    render(<ImageUpload {...defaultProps} />)

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement

    fireEvent.change(fileInput, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText('Failed to upload image. Please try again.')).toBeInTheDocument()
    })
  })

  it('renders drag and drop zone', () => {
    render(<ImageUpload {...defaultProps} />)

    // The drag/drop zone should be present with upload instructions
    expect(screen.getByText('Click to upload')).toBeInTheDocument()
    expect(screen.getByText('or drag and drop')).toBeInTheDocument()
  })
})
