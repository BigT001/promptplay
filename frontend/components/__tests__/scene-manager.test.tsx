import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { SceneManager } from '../scene-manager'

const mockToast = vi.fn()

// Mock useToast hook
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: mockToast
  })
}))

describe('SceneManager', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    // Reset fetch mock
    global.fetch = vi.fn()
  })

  it('shows loading state and then displays scenes', async () => {
    // Mock successful API response
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ([{
        id: 1,
        project_id: 1,
        title: 'Opening Scene',
        sequence_number: 1,
        content: 'Scene content',
        notes: 'Scene notes'
      }])
    })

    render(<SceneManager projectId={1} />)

    // Check for loading state
    expect(screen.getByText('Loading scenes...')).toBeInTheDocument()

    // Wait for scenes to load and check content
    await waitFor(() => {
      expect(screen.getByText('Opening Scene')).toBeInTheDocument()
    })

    // Verify scene content is displayed
    expect(screen.getByDisplayValue('Scene content')).toBeInTheDocument()
  })

  it('handles scene creation', async () => {
    // Mock initial scenes fetch
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ([])
    })

    // Mock scene creation
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        project_id: 1,
        title: 'New Scene',
        sequence_number: 1
      })
    })

    render(<SceneManager projectId={1} />)

    // Wait for initial load
    await waitFor(() => {
      expect(screen.queryByText('Loading scenes...')).not.toBeInTheDocument()
    })

    // Click add scene button
    const addButton = screen.getByText('Add Scene')
    fireEvent.click(addButton)

    // Verify new scene appears
    await waitFor(() => {
      expect(screen.getByText('New Scene')).toBeInTheDocument()
    })
  })

  it('handles API errors gracefully', async () => {
    // Mock failed API call
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('API Error'))

    render(<SceneManager projectId={1} />)

    // Wait for error toast
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Failed to load scenes',
        variant: 'destructive'
      })
    })
  })
})