import { renderHook, waitFor } from '@testing-library/react'
import { useStories } from '../useStories'
import { SWRConfig } from 'swr'

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock console.error
const mockConsoleError = jest.fn()
global.console.error = mockConsoleError

describe('useStories', () => {
  const mockTopStoryIds = [1, 2, 3, 4, 5]
  const mockStory1 = { id: 1, title: 'Test Story 1', url: 'https://example1.com' }
  const mockStory2 = { id: 2, title: 'Test Story 2', url: 'https://example2.com' }
  const mockStory3 = { id: 3, title: 'Test Story 3', url: 'invalid-url' }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
  )

  it('fetches stories and returns them with favicon URLs', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTopStoryIds),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStory1),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStory2),
      })

    const { result } = renderHook(() => useStories(2), { wrapper })

    await waitFor(() => {
      expect(result.current.stories).toBeDefined()
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.stories).toHaveLength(2)
    expect(result.current.stories?.[0].title).toBe('Test Story 1')
    expect(result.current.stories?.[0].faviconUrl).toContain('example1.com')
    expect(result.current.stories?.[1].title).toBe('Test Story 2')
    expect(result.current.stories?.[1].faviconUrl).toContain('example2.com')
    expect(result.current.error).toBeUndefined()

    // check fetch calls
    expect(mockFetch).toHaveBeenCalledWith('https://hacker-news.firebaseio.com/v0/topstories.json')
    expect(mockFetch).toHaveBeenCalledWith('https://hacker-news.firebaseio.com/v0/item/1.json')
    expect(mockFetch).toHaveBeenCalledWith('https://hacker-news.firebaseio.com/v0/item/2.json')
    expect(mockFetch).not.toHaveBeenCalledWith('https://hacker-news.firebaseio.com/v0/item/3.json')
  })

  it('handles error when fetching top story IDs', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    })

    const { result } = renderHook(() => useStories(), { wrapper })

    await waitFor(() => {
      expect(result.current.error).toBeDefined()
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.stories).toBeUndefined()
    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error.message).toContain('HTTP error! status: 500')
  })

  it('handles error when fetching a story item', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTopStoryIds),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

    const { result } = renderHook(() => useStories(1), { wrapper })

    await waitFor(() => {
      expect(result.current.error).toBeDefined()
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.stories).toBeUndefined()
    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error.message).toContain('HTTP error! status: 500')
  })

  it('handles invalid URL for favicon generation', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([3]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStory3),
      })

    const { result } = renderHook(() => useStories(1), { wrapper })

    await waitFor(() => {
      expect(result.current.stories).toBeDefined()
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.stories).toHaveLength(1)
    expect(result.current.stories?.[0].title).toBe('Test Story 3')
    expect(result.current.stories?.[0].faviconUrl).toBeNull()
    expect(mockConsoleError).toHaveBeenCalledWith('Invalid URL:', 'invalid-url')
  })

  it('respects the limit parameter', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTopStoryIds),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStory1),
      })

    const { result } = renderHook(() => useStories(1), { wrapper })

    await waitFor(() => {
      expect(result.current.stories).toBeDefined()
    })

    expect(result.current.stories).toHaveLength(1)
    expect(mockFetch).toHaveBeenCalledTimes(2) // 1 for top stories, 1 for the single story
  })
})