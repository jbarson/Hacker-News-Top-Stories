import { Skeleton } from "./Skeleton"

interface StorySkeletonLoaderProps {
  count?: number
}

export function StorySkeletonLoader({ count = 10 }: StorySkeletonLoaderProps) {
  return (
    <div className="grid gap-4 w-full" role="progressbar" aria-label="Loading stories">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-2 p-2 rounded dark-mode-card"
        >
          <Skeleton className="w-4 h-4 dark-mode-skeleton" />
          <Skeleton className="h-6 flex-grow dark-mode-skeleton" />
        </div>
      ))}
    </div>
  )
} 