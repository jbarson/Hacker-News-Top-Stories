import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import Home from '../page'

// Mock the useStories hook
jest.mock('../hooks/useStories', () => ({
  useStories: jest.fn(),
}))

// Mock the Story component
jest.mock('../components/Story', () => ({
  Story: jest.fn(() => <div data-testid="mock-story">Mock Story</div>),
}))

// Mock the StorySkeletonLoader component
jest.mock('../components/StorySkeletonLoader', () => ({
  StorySkeletonLoader: jest.fn(() => <div data-testid="skeleton-loader" role="progressbar">Loading Skeleton</div>),
}))

describe('Home Page', () => {
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
  
  const useStories = require('../hooks/useStories').useStories
  
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset useStories mock before each test
    useStories.mockReset()
  })

  it('renders loading skeleton when data is not available', () => {
    // Mock useStories to return loading state
    useStories.mockReturnValue({
      stories: null,
      error: null,
      isLoading: true,
    })

    render(<Home />)
    
    expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('renders error state when there is an error', () => {
    // Mock useStories to return error state
    useStories.mockReturnValue({
      stories: null,
      error: new Error('Failed to fetch'),
      isLoading: false,
    })

    render(<Home />)
    
    const errorMessage = screen.getByText('Failed to load stories.')
    expect(errorMessage).toBeInTheDocument()
    expect(errorMessage).toHaveClass('text-red-500')
  })

  it('renders stories when data is available', async () => {
    // Mock useStories to return stories data
    useStories.mockReturnValue({
      stories: mockStories,
      error: null,
      isLoading: false,
    })

    render(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText('Hacker News Feed')).toBeInTheDocument()
    })
    
    // Check that the Story component was rendered for each story
    const storyElements = screen.getAllByTestId('mock-story')
    expect(storyElements).toHaveLength(2)
    
    // Ensure skeleton loader is not present
    expect(screen.queryByTestId('skeleton-loader')).not.toBeInTheDocument()
  })
}) 