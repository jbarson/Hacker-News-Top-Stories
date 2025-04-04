"use client"

import { Story } from "./components/Story"
import { useStories } from "./hooks/useStories"

export default function Home() {
  const { stories, isLoading, error } = useStories(10, 60000)

  if (error) return <div>Failed to load stories.</div>
  if (isLoading || !stories) return <div>Loading stories...</div>

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
