"use client"

import { useCallback } from "react"
import useSWR from "swr"
import { Story, type Story as StoryType } from "./components/Story"

export default function Home() {
  // Memoize the fetcher function
  const fetcher = useCallback(
    async (url: string) => {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      console.log('refresh')
      return response.json()
    },
    [] // Empty dependencies array since fetcher doesn't depend on any props or state
  )

  // Memoize the story detail URL creator function
  const getStoryDetailUrl = useCallback(
    (id: number) => `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
    []
  )

  const topStoriesUrl = "https://hacker-news.firebaseio.com/v0/topstories.json"

  // Fetch top story IDs with automatic revalidation every 60 seconds
  const { data: topStoryIds, error: idsError, isLoading } = useSWR(
    topStoriesUrl,
    fetcher,
    {
      refreshInterval: 60000, // 60 seconds
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
  const { data: stories, error: storiesError } = useSWR<StoryType[]>(
    topStoryIds ? ["stories", topStoryIds.slice(0, 10)] : null,
    fetchStoriesData,
    {
      refreshInterval: 60000, // 60 seconds
    }
  )

  if (idsError || storiesError) return <div>Failed to load stories.</div>
  if (!stories) return <div>Loading stories...</div>

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-5xl font-bold">Hacker News Feed</h1>

        <div className="grid gap-4">
          {stories.map((story, index) => (
            <Story story={story} index={index} key={index} />
          ))}
        </div>
      </main>
    </div>
  )
}
