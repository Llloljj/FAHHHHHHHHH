'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { MapPin, Loader2, Search } from 'lucide-react'

interface Suggestion {
  display_name: string
  lat: string
  lon: string
}

interface DestinationSearchProps {
  onSelect: (address: string, lat?: number, lng?: number) => void
  placeholder?: string
  defaultValue?: string
  name?: string
}

export function DestinationSearch({ onSelect, placeholder, defaultValue, name }: DestinationSearchProps) {
  const [query, setQuery] = useState(defaultValue || '')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Handle clicks outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Debounced search
  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([])
      return
    }

    const handler = setTimeout(async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
        )
        const data = await response.json()
        setSuggestions(data)
        setIsOpen(true)
      } catch (error) {
        console.error('Nominatim error:', error)
      } finally {
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(handler)
  }, [query])

  const handleSelect = (s: Suggestion) => {
    setQuery(s.display_name)
    setSuggestions([])
    setIsOpen(false)
    onSelect(s.display_name, parseFloat(s.lat), parseFloat(s.lon))
  }

  return (
    <div ref={wrapperRef} className="relative group w-full">
      <div className="relative">
        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 accent-gradient-text z-10" />
        <Input
          name={name}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || "Search for a city (OSM)..."}
          autoComplete="off"
          className="rounded-full pl-14 pr-12 py-6 border-[#262626]/20 focus-visible:ring-[#3B9ECC] bg-white transition-super"
        />
        <div className="absolute right-6 top-1/2 -translate-y-1/2">
          {loading ? (
            <Loader2 className="w-4 h-4 accent-gradient-text animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-[#262626]/20" />
          )}
        </div>
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[24px] border border-[#262626]/10 shadow-2xl z-[100] overflow-hidden reveal-up-active">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(s)}
              className="w-full text-left px-8 py-4 text-sm font-medium text-[#262626] hover:bg-[#f5f0eb] border-b border-[#262626]/5 last:border-0 flex items-start gap-3 transition-colors"
            >
              <MapPin className="w-4 h-4 accent-gradient-text mt-1 shrink-0" />
              <span className="truncate">{s.display_name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
