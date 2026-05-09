'use client'

import { useEffect, useRef, useState } from 'react'

interface RevealUpProps {
  children: React.ReactNode
  className?: string
  delay?: number // ms
}

export function RevealUp({ children, className = '', delay = 0 }: RevealUpProps) {
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

    // Fallback: Ensure visibility even if observer fails
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 800)

    return () => {
      if (currentRef) observer.unobserve(currentRef)
      clearTimeout(timer)
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`${isVisible ? 'reveal-up-active' : 'reveal-up-start'} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        visibility: isVisible ? 'visible' : 'hidden'
      }}
    >
      {children}
    </div>
  )
}
