"use client"

import { Story } from "./components/Story"
import { StorySkeletonLoader } from "./components/StorySkeletonLoader"
import { useStories } from "./hooks/useStories"

export default function Home() {
  const { stories, isLoading, error } = useStories(10, 60000)

  if (error) return (
    <div className="flex items-center justify-center min-h-screen dark-mode-bg">
      <div className="text-red-500 dark-mode-text">Failed to load stories.</div>
    </div>
  )

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 dark-mode-bg">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-2xl">
        <h1 className="text-5xl font-bold dark-mode-text">Hacker News Feed</h1>

        {isLoading || !stories ? (
          <StorySkeletonLoader count={10} />
        ) : (
          <div className="grid gap-4 w-full">
            {stories.map((story, index) => (
              <Story story={story} index={index} key={index} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
