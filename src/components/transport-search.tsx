'use client'

import { useState } from 'react'
import { getRedirectUrl, TransportType } from '@/lib/travel-api'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plane, Train, Bus, MapPin, Calendar, Users, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function TransportSearch() {
  const [type, setType] = useState<TransportType>('flight')
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState('')
  const [passengers, setPassengers] = useState(1)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!origin || !destination || !date) return
    
    const url = getRedirectUrl({ type, origin, destination, date, passengers })
    window.open(url, '_blank')
  }

  const tabs = [
    { id: 'flight', icon: Plane, label: 'Flights' },
    { id: 'train', icon: Train, label: 'Trains' },
    { id: 'bus', icon: Bus, label: 'Buses' },
  ]

  return (
    <Card className="bg-white border-0 shadow-2xl shadow-black/50 rounded-[40px] overflow-hidden">
      <CardContent className="p-0">
        
        {/* Tabs */}
        <div className="flex bg-[#fdf8f3] p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setType(tab.id as TransportType)}
              className={cn(
                "flex-1 flex items-center justify-center gap-3 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-super rounded-[32px]",
                type === tab.id 
                  ? "bg-[#262626] text-white shadow-xl" 
                  : "text-[#262626]/40 hover:text-[#262626] hover:bg-white/50"
              )}
            >
              <tab.icon className={cn("w-4 h-4", type === tab.id ? "text-[#e4a4bd]" : "text-current")} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/40 flex items-center gap-2">
                <MapPin className="w-3 h-3" /> Origin
              </label>
              <Input 
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="From where?" 
                className="rounded-full px-6 py-8 border-[#262626]/5 bg-[#fdf8f3] text-[#262626] font-bold text-lg placeholder:text-[#262626]/20 focus:ring-2 focus:ring-[#e4a4bd]" 
                required
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/40 flex items-center gap-2">
                <MapPin className="w-3 h-3" /> Destination
              </label>
              <Input 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="To where?" 
                className="rounded-full px-6 py-8 border-[#262626]/5 bg-[#fdf8f3] text-[#262626] font-bold text-lg placeholder:text-[#262626]/20 focus:ring-2 focus:ring-[#e4a4bd]" 
                required
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/40 flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Date
              </label>
              <Input 
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-full px-6 py-8 border-[#262626]/5 bg-[#fdf8f3] text-[#262626] font-bold text-lg focus:ring-2 focus:ring-[#e4a4bd]" 
                required
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/40 flex items-center gap-2">
                <Users className="w-3 h-3" /> Travelers
              </label>
              <Input 
                type="number"
                min="1"
                value={passengers}
                onChange={(e) => setPassengers(parseInt(e.target.value))}
                className="rounded-full px-6 py-8 border-[#262626]/5 bg-[#fdf8f3] text-[#262626] font-bold text-lg focus:ring-2 focus:ring-[#e4a4bd]" 
                required
              />
            </div>

          </div>

          <div className="flex justify-end">
            <Button 
              type="submit"
              className="bg-[#e4a4bd] text-[#262626] rounded-full px-16 py-10 text-[12px] font-black uppercase tracking-[0.3em] hover:bg-[#262626] hover:text-[#e4a4bd] transition-super group"
            >
              Search {type}s
              <ArrowRight className="w-5 h-5 ml-4 group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>
        </form>

      </CardContent>
    </Card>
  )
}
