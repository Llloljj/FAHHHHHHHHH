'use client'

import { useEffect, useState } from 'react'

export function ParallaxLayer({ 
  children, 
  direction = 'left', 
  speed = 0.5,
  className = ''
}: { 
  children: React.ReactNode, 
  direction?: 'left' | 'right',
  speed?: number,
  className?: string
}) {
  const initialOffset = 600; // Start off-screen
  const [offset, setOffset] = useState(initialOffset)

  useEffect(() => {
    let ticking = false
    
    // Initial calculate on mount in case user reloads halfway down the page
    setOffset(Math.max(0, initialOffset - window.scrollY * speed))

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const newOffset = Math.max(0, initialOffset - window.scrollY * speed)
          ticking = false
        })
        ticking = true
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  // If direction is left, starts at -initialOffset (off left) and moves to 0
  // If direction is right, starts at +initialOffset (off right) and moves to 0
  const transform = direction === 'left' 
    ? `translateX(-${offset}px)` 
    : `translateX(${offset}px)`

  return (
    <div className={className} style={{ transform, transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)' }}>
      <div style={{ opacity: offset === 0 ? 1 : Math.max(0.2, 1 - (offset / initialOffset)) }}>
        {children}
      </div>
    </div>
  )
}
