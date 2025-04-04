import { renderHook } from '@testing-library/react'
import { useStories } from '../useStories'

// Mock the useFetcher hook
jest.mock('../useFetcher', () => ({
  useFetcher: jest.fn().mockReturnValue(jest.fn()),
}))

// Mock useSWR
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
}))

describe('useStories', () => {
  const useSWR = require('swr').default
  const mockTopStoryIds = [1, 2, 3, 4, 5]
  const mockStories = [
    {
      title: 'Test Story 1',
      url: 'https://example1.com',
      faviconUrl: 'https://www.google.com/s2/favicons?sz=64&domain_url=example1.com',
    },
    {
      title: 'Test Story 2',
      url: 'https://example2.com',
      faviconUrl: 'https://www.google.com/s2/favicons?sz=64&domain_url=example2.com',
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    // Reset useSWR mock before each test
    useSWR.mockReset()
  })

  it('returns loading state when data is not available', () => {
    // Mock useSWR to return loading state
    useSWR.mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
    })

    const { result } = renderHook(() => useStories(5))
    
    expect(result.current.isLoading).toBe(true)
    expect(result.current.stories).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('returns error state when there is an error', () => {
    const mockError = new Error('Failed to fetch')
    
    // Mock useSWR to return error state
    useSWR.mockReturnValue({
      data: null,
      error: mockError,
      isLoading: false,
    })

    const { result } = renderHook(() => useStories(5))
    
    expect(result.current.isLoading).toBe(false)
    expect(result.current.stories).toBeNull()
    expect(result.current.error).toBe(mockError)
  })

  it('returns stories when data is available', () => {
    // Mock useSWR to return data
    useSWR.mockReturnValue({
      data: mockStories,
      error: null,
      isLoading: false,
    })

    const { result } = renderHook(() => useStories(5))
    
    expect(result.current.isLoading).toBe(false)
    expect(result.current.stories).toEqual(mockStories)
    expect(result.current.error).toBeNull()
  })
}) 