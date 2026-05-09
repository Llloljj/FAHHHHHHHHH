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
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Honor optional stagger delay
          if (delay > 0) {
            setTimeout(() => setIsVisible(true), delay)
          } else {
            setIsVisible(true)
          }
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.15 }
    )

    const el = ref.current
    if (el) observer.observe(el)

    return () => {
      if (el) observer.unobserve(el)
    }
  }, [delay])

  return (
    <div
      ref={ref}
      className={`${isVisible ? 'reveal-up-active' : 'reveal-up-start'} ${className}`}
      style={isVisible ? {} : { opacity: 0, transform: 'translateY(40px)' }}
    >
      {children}
    </div>
  )
}
