"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

// Constants
const FAVICON_SERVICES = [
  // Primary service
  (domain: string) => `https://www.google.com/s2/favicons?sz=64&domain_url=${domain}`,
  // Fallback services
  (domain: string) => `https://favicon.ico/${domain}`,
  (domain: string) => `https://icon.horse/icon/${domain}`,
  // Default fallback
  (domain: string) => `https://www.google.com/s2/favicons?sz=64&domain_url=hackernews.com`
]

// Types
export interface Story {
  title: string
  url: string
  faviconUrl: string | null
}

export interface StoryProps {
  story: Story
  index: number
}

export function Story({ story, index }: StoryProps) {
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null)
  const [serviceIndex, setServiceIndex] = useState(0)

  useEffect(() => {
    // Only set the favicon URL if it exists
    if (story.faviconUrl) {
      setFaviconUrl(story.faviconUrl)
      setServiceIndex(0) // Reset service index when story changes
    }
  }, [story.faviconUrl])

  const handleImageError = () => {
    // Try the next favicon service
    const nextIndex = serviceIndex + 1
    if (nextIndex < FAVICON_SERVICES.length) {
      setServiceIndex(nextIndex)
      
      // Extract domain from URL
      try {
        const url = new URL(story.url)
        const domain = url.hostname
        const newFaviconUrl = FAVICON_SERVICES[nextIndex](domain)
        setFaviconUrl(newFaviconUrl)
      } catch (error) {
        // If URL parsing fails, use the default
        setFaviconUrl(FAVICON_SERVICES[FAVICON_SERVICES.length - 1]("hackernews.com"))
      }
    } else {
      // If all services fail, use the default
      setFaviconUrl(FAVICON_SERVICES[FAVICON_SERVICES.length - 1]("hackernews.com"))
    }
  }

  return (
    <a
      href={story.url}
      className="flex items-center gap-2 hover:underline hover:underline-offset-4 p-2 rounded transition-colors"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Read article: ${story.title}`}
      role="article"
    >
      {faviconUrl && (
        <Image
          src={faviconUrl}
          alt=""
          width={16}
          height={16}
          className="inline-block text-center relative"
          onError={handleImageError}
          aria-hidden="true"
        />
      )}
      <span>{story.title}</span>
    </a>
  )
} 