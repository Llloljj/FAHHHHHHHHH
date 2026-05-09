'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { PlusCircle, Menu, X } from 'lucide-react'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const links = [
    { label: 'Destinations', href: '#' },
    { label: 'Services', href: '#' },
    { label: 'My Trips', href: '/dashboard' },
    { label: 'Plan a Trip', href: '/trips/new' },
    { label: 'About', href: '#' },
  ]

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 h-[80px] z-50 transition-colors duration-300 glass-nav ${scrolled ? 'shadow-sm shadow-[#262626]/5' : ''}`}
      >
        <div className="flex h-full items-center justify-between px-6 md:px-16 mx-auto">

          {/* Left: Brand */}
          <Link
            href="/"
            className="font-black text-3xl tracking-tighter uppercase text-[#262626] hover:accent-gradient-text transition-colors"
          >
            BANJARE
          </Link>

          {/* Center: Menu (desktop) */}
          <div className="hidden md:flex items-center space-x-10">
            {links.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm md:text-base font-black uppercase tracking-[0.2em] text-[#262626] hover:accent-gradient-text transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right: CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <Link
              href="/trips/new"
              className="hidden md:flex accent-gradient text-white rounded-full px-8 py-3 text-sm md:text-base font-black uppercase tracking-[0.15em] transition-colors items-center gap-2"
            >
              <PlusCircle className="h-3 w-3 shrink-0" />
              New Trip
            </Link>

            {/* Hamburger (mobile only) */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-[#262626] focus:outline-none"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 pt-[80px] bg-[#fdf8f3] flex flex-col px-6 py-10 gap-8 md:hidden">
          {links.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="text-2xl font-black uppercase tracking-[0.2em] text-[#262626] hover:accent-gradient-text transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/trips/new"
            onClick={() => setMenuOpen(false)}
            className="accent-gradient text-white rounded-full px-8 py-4 text-base font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 mt-4"
          >
            <PlusCircle className="h-4 w-4 shrink-0" />
            New Trip
          </Link>
        </div>
      )}
    </>
  )
}
