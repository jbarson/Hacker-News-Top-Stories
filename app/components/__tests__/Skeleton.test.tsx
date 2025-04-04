import React from 'react'
import { render } from '@testing-library/react'
import { Skeleton } from '../Skeleton'

describe('Skeleton', () => {
  it('renders with default classes', () => {
    const { container } = render(<Skeleton />)
    const skeleton = container.firstChild as HTMLElement
    
    expect(skeleton).toHaveClass('animate-pulse')
    expect(skeleton).toHaveClass('bg-gray-200')
    expect(skeleton).toHaveClass('dark:bg-gray-700')
    expect(skeleton).toHaveClass('rounded')
  })

  it('applies additional classes from className prop', () => {
    const { container } = render(<Skeleton className="w-4 h-4" />)
    const skeleton = container.firstChild as HTMLElement
    
    expect(skeleton).toHaveClass('w-4')
    expect(skeleton).toHaveClass('h-4')
  })
}) 