'use client'

import { useEffect, useRef, useState } from 'react'

export function RevealUp({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold: 0.15,
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    // Clean up
    const currentRef = ref.current;
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-super ${isVisible ? 'reveal-up-active' : 'reveal-up-start'} ${className}`}
    >
      {children}
    </div>
  )
}
