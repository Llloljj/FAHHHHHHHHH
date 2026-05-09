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

    // Fallback: If it's already in viewport or doesn't trigger for some reason
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 2000)

    return () => {
      if (currentRef) observer.unobserve(currentRef)
      clearTimeout(timer)
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-super ${isVisible ? 'reveal-up-active' : 'reveal-up-start'} ${className}`}
      style={isVisible ? {} : { opacity: 0, transform: 'translateY(20px)' }}
    >
      {children}
    </div>
  )
}
