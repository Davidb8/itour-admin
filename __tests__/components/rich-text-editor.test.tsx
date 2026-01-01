import { render, screen, waitFor } from '@testing-library/react'
import { RichTextEditor } from '@/components/rich-text-editor'

describe('RichTextEditor', () => {
  const defaultProps = {
    content: '',
    onChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders toolbar buttons after mount', async () => {
    render(<RichTextEditor {...defaultProps} />)

    // Wait for editor to initialize
    await waitFor(() => {
      // Check for toolbar buttons by title
      expect(screen.getByTitle('Bold')).toBeInTheDocument()
    })

    expect(screen.getByTitle('Italic')).toBeInTheDocument()
    expect(screen.getByTitle('Heading')).toBeInTheDocument()
    expect(screen.getByTitle('Bullet List')).toBeInTheDocument()
    expect(screen.getByTitle('Numbered List')).toBeInTheDocument()
    // Note: Link button was removed
    expect(screen.getByTitle('Undo')).toBeInTheDocument()
    expect(screen.getByTitle('Redo')).toBeInTheDocument()
  })

  it('disables buttons when disabled prop is true', async () => {
    render(<RichTextEditor {...defaultProps} disabled={true} />)

    await waitFor(() => {
      const boldButton = screen.getByTitle('Bold')
      expect(boldButton).toBeDisabled()
    })
  })

  it('renders with initial content', async () => {
    render(<RichTextEditor {...defaultProps} content="<p>Hello World</p>" />)

    await waitFor(() => {
      expect(screen.getByText('Hello World')).toBeInTheDocument()
    })
  })

  it('applies reduced opacity when disabled', async () => {
    render(<RichTextEditor {...defaultProps} disabled={true} />)

    await waitFor(() => {
      const boldButton = screen.getByTitle('Bold')
      // Find the main container
      const container = boldButton.closest('.border.rounded-md')
      expect(container).toHaveClass('opacity-50')
    })
  })

  it('renders all formatting buttons', async () => {
    render(<RichTextEditor {...defaultProps} />)

    await waitFor(() => {
      // Count total buttons
      const buttons = screen.getAllByRole('button')
      // Bold, Italic, Heading, Bullet List, Numbered List, Undo, Redo = 7
      expect(buttons.length).toBeGreaterThanOrEqual(7)
    })
  })
})
