'use client'

import { useEffect, useRef, useState } from 'react'

interface RevealUpProps {
  children: React.ReactNode
  className?: string
  delay?: number // ms
  direction?: 'up' | 'left' | 'right'
}

export function RevealUp({ children, className = '', delay = 0, direction = 'up' }: RevealUpProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentRef = ref.current
    if (!currentRef) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.05, rootMargin: '50px' }
    )

    observer.observe(currentRef)

    return () => {
      if (currentRef) observer.unobserve(currentRef)
    }
  }, [])

  const getInitialTransform = () => {
    switch (direction) {
      case 'left':  return 'translateX(-80px)'
      case 'right': return 'translateX(80px)'
      default:      return 'translateY(40px)'
    }
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: '1800ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionProperty: 'opacity, transform',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0, 0)' : getInitialTransform(),
      }}
    >
      {children}
    </div>
  )
}
