import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import Home from '../page'

// Mock the useSWR hook
jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
}))

// Mock the Story component
jest.mock('../components/Story', () => ({
  Story: jest.fn(() => <div data-testid="mock-story">Mock Story</div>),
}))

describe('Home Page', () => {
  const mockTopStoryIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const useSWR = require('swr').default
  
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset useSWR mock before each test
    useSWR.mockReset()
  })

  it('renders loading state when data is not available', () => {
    // Mock useSWR to return loading state
    useSWR.mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
    })

    render(<Home />)
    
    expect(screen.getByText('Loading stories...')).toBeInTheDocument()
  })

  it('renders error state when there is an error', () => {
    // Mock useSWR to return error state
    useSWR.mockReturnValue({
      data: null,
      error: new Error('Failed to fetch'),
      isLoading: false,
    })

    render(<Home />)
    
    expect(screen.getByText('Failed to load stories.')).toBeInTheDocument()
  })

  it('renders stories when data is available', async () => {
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

    // Mock useSWR to return data based on the key
    useSWR.mockImplementation((key: string | [string, number[]]) => {
      if (key === 'https://hacker-news.firebaseio.com/v0/topstories.json') {
        return {
          data: mockTopStoryIds,
          error: null,
          isLoading: false,
        }
      }
      
      // For the stories fetch
      if (Array.isArray(key) && key[0] === 'stories') {
        return {
          data: mockStories,
          error: null,
          isLoading: false,
        }
      }
    })

    render(<Home />)
    
    await waitFor(() => {
      expect(screen.getByText('Hacker News Feed')).toBeInTheDocument()
    })
    
    // Check that the Story component was rendered for each story
    const storyElements = screen.getAllByTestId('mock-story')
    expect(storyElements).toHaveLength(2)
  })
}) 