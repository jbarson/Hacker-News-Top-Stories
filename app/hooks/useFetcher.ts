import { useCallback } from 'react'

/**
 * Custom hook for fetching data from an API
 * @returns A memoized fetcher function that can be used with SWR
 */
export function useFetcher() {
  return useCallback(
    async (url: string) => {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json()
    },
    [] // Empty dependencies array since fetcher doesn't depend on any props or state
  )
} 