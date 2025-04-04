import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Story, type Story as StoryType } from '../Story'

// Mock useState
const mockSetState = jest.fn()
const useStateMock = jest.fn().mockImplementation((init: any) => [init, mockSetState])

describe('Story Component', () => {
  const mockStory: StoryType = {
    title: 'Test Story',
    url: 'https://example.com',
    faviconUrl: 'https://www.google.com/s2/favicons?sz=64&domain_url=example.com',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Reset useState mock before each test
    jest.spyOn(React, 'useState').mockImplementation(useStateMock)
  })

  it('renders the story title and link', () => {
    render(<Story story={mockStory} index={0} />)
    
    const link = screen.getByRole('article')
    expect(link).toHaveAttribute('href', mockStory.url)
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    
    const title = screen.getByText(mockStory.title)
    expect(title).toBeInTheDocument()
  })

  it('renders the favicon when available', () => {
    // Mock useState to return the favicon URL
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [mockStory.faviconUrl, mockSetState])
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [0, jest.fn()])

    render(<Story story={mockStory} index={0} />)
    
    const favicon = screen.getByTestId('story-favicon')
    expect(favicon).toHaveAttribute('src', mockStory.faviconUrl || '')
    expect(favicon).toHaveAttribute('width', '16')
    expect(favicon).toHaveAttribute('height', '16')
  })

  it('does not render the favicon when not available', () => {
    const storyWithoutFavicon: StoryType = {
      ...mockStory,
      faviconUrl: null,
    }
    
    render(<Story story={storyWithoutFavicon} index={0} />)
    
    const favicon = screen.queryByTestId('story-favicon')
    expect(favicon).not.toBeInTheDocument()
  })

  it('handles favicon loading error', () => {
    // Mock useState to return the favicon URL
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [mockStory.faviconUrl, mockSetState])
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [0, jest.fn()])

    render(<Story story={mockStory} index={0} />)
    
    const favicon = screen.getByTestId('story-favicon')
    fireEvent.error(favicon)
    
    expect(mockSetState).toHaveBeenCalled()
  })
}) 