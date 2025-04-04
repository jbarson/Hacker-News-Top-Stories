import { renderHook } from '@testing-library/react'
import { useFetcher } from '../useFetcher'

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('useFetcher', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns a function that fetches data', async () => {
    const mockData = { title: 'Test Data' }
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    })

    const { result } = renderHook(() => useFetcher())
    const fetcher = result.current

    const data = await fetcher('https://example.com/api')
    
    expect(mockFetch).toHaveBeenCalledWith('https://example.com/api')
    expect(data).toEqual(mockData)
  })

  it('throws an error when the response is not ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    })

    const { result } = renderHook(() => useFetcher())
    const fetcher = result.current

    await expect(fetcher('https://example.com/api')).rejects.toThrow('HTTP error! status: 404')
  })
}) 