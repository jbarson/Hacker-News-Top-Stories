import React from 'react'
import { render, screen } from '@testing-library/react'
import { StorySkeletonLoader } from '../StorySkeletonLoader'

// Mock the Skeleton component
jest.mock('../Skeleton', () => ({
  Skeleton: jest.fn(() => <div data-testid="skeleton" />),
}))

describe('StorySkeletonLoader', () => {
  it('renders with default count of 10 skeletons', () => {
    render(<StorySkeletonLoader />)
    
    const skeletons = screen.getAllByTestId('skeleton')
    expect(skeletons).toHaveLength(20) // 2 skeletons per story (favicon + title)
  })

  it('renders with custom count of skeletons', () => {
    render(<StorySkeletonLoader count={5} />)
    
    const skeletons = screen.getAllByTestId('skeleton')
    expect(skeletons).toHaveLength(10) // 2 skeletons per story (favicon + title)
  })

  it('renders with correct accessibility attributes', () => {
    render(<StorySkeletonLoader />)
    
    const loader = screen.getByRole('progressbar')
    expect(loader).toHaveAttribute('aria-label', 'Loading stories')
  })
}) 