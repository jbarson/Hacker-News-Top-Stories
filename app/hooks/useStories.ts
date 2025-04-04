import { useCallback } from 'react'
import useSWR from 'swr'
import { Story } from '../components/Story'
import { useFetcher } from './useFetcher'

/**
 * Custom hook for fetching Hacker News stories
 * @param limit - Maximum number of stories to fetch (default: 10)
 * @param refreshInterval - Interval in milliseconds to refresh the data (default: 60000)
 * @returns Object containing stories data, loading state, and error state
 */
export function useStories(limit = 10, refreshInterval = 60000) {
  const fetcher = useFetcher()
  
  // Memoize the story detail URL creator function
  const getStoryDetailUrl = useCallback(
    (id: number) => `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
    []
  )

  const topStoriesUrl = "https://hacker-news.firebaseio.com/v0/topstories.json"

  // Fetch top story IDs with automatic revalidation
  const { data: topStoryIds, error: idsError, isLoading } = useSWR(
    topStoriesUrl,
    fetcher,
    {
      refreshInterval,
    }
  )

  // Memoize the story fetching function
  const fetchStoriesData = useCallback(
    async (key: [string, number[]]) => {
      const [_, ids] = key
      const storiesData = await Promise.all(
        ids.map(async (id: number) => {
          const story = await fetcher(getStoryDetailUrl(id))
          const url = story.url
          let faviconUrl = null
          if (url) {
            try {
              const parsedUrl = new URL(url)
              faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain_url=${parsedUrl.hostname}`
            } catch (error) {
              console.error('Invalid URL:', url)
            }
          }

          return {
            title: story.title,
            url: story.url,
            faviconUrl,
          }
        })
      )
      return storiesData
    },
    [fetcher, getStoryDetailUrl]
  )

  // Fetch story details when topStoryIds are available
  const { data: stories, error: storiesError } = useSWR<Story[]>(
    topStoryIds ? ["stories", topStoryIds.slice(0, limit)] : null,
    fetchStoriesData,
    {
      refreshInterval,
    }
  )

  return {
    stories,
    isLoading,
    error: idsError || storiesError,
  }
} 