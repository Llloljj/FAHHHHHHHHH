'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { PlusCircle } from 'lucide-react'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 h-[80px] z-50 transition-colors duration-300 glass-nav ${scrolled ? 'shadow-sm shadow-[#262626]/5' : ''
        }`}
    >
      <div className="flex h-full items-center justify-between px-8 md:px-16 mx-auto">

        {/* Left: Brand */}
        <Link
          href="/"
          className="font-black text-3xl tracking-tighter uppercase text-[#262626] hover:accent-gradient-text transition-colors"
        >
          BANJARE
        </Link>

        {/* Center: Menu */}
        <div className="hidden md:flex items-center space-x-10">
          {[
            { label: 'Destinations', href: '#' },
            { label: 'Services', href: '#' },
            { label: 'My Trips', href: '/dashboard' },
            { label: 'Plan a Trip', href: '/trips/new' },
            { label: 'About', href: '#' },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm md:text-base font-black uppercase tracking-[0.2em] text-[#262626] hover:accent-gradient-text transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right: CTA */}
        <div className="flex items-center space-x-4">
          <Link
            href="/trips/new"
            className="accent-gradient text-white rounded-full px-8 py-3 text-sm md:text-base font-black uppercase tracking-[0.15em] hover:bg-[#262626] hover:accent-gradient-text transition-colors flex items-center gap-2"
          >
            <PlusCircle className="h-3 w-3 shrink-0" />
            New Trip
          </Link>
        </div>
      </div>
    </nav>
  )
}
