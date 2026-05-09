'use client'

import { useRef, useState } from 'react'
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api'
import { Input } from '@/components/ui/input'
import { MapPin, Navigation } from 'lucide-react'

const libraries: ("places")[] = ["places"]

interface DestinationSearchProps {
  onSelect: (address: string, lat?: number, lng?: number) => void
  placeholder?: string
  defaultValue?: string
  name?: string
}

export function DestinationSearch({ onSelect, placeholder, defaultValue, name }: DestinationSearchProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries
  })

  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null)
  const [address, setAddress] = useState(defaultValue || '')

  const onLoad = (auto: google.maps.places.Autocomplete) => {
    setAutocomplete(auto)
  }

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace()
      const formattedAddress = place.formatted_address || place.name || ''
      const lat = place.geometry?.location?.lat()
      const lng = place.geometry?.location?.lng()
      
      setAddress(formattedAddress)
      onSelect(formattedAddress, lat, lng)
    }
  }

  if (!isLoaded) return <Input placeholder="Loading maps..." disabled className="rounded-full px-6 py-6" />

  return (
    <div className="relative group">
      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#e4a4bd] group-focus-within:text-[#262626] transition-colors" />
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        options={{ types: ['(cities)'] }}
      >
        <Input
          id="destination"
          name={name || "destination"}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={placeholder || "Search for a city..."}
          required
          className="rounded-full pl-14 pr-6 py-6 border-[#262626]/20 focus-visible:ring-[#e4a4bd] bg-white transition-super"
        />
      </Autocomplete>
      <Navigation className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-[#262626]/20 cursor-pointer hover:text-[#e4a4bd] transition-colors" />
    </div>
  )
}
