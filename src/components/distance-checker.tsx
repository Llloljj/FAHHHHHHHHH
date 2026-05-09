'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Navigation, MapPin, Calculator, Info } from 'lucide-react'
import { DestinationSearch } from './destination-search'

export function DistanceChecker() {
  const [origin, setOrigin] = useState<{name: string, lat: number, lon: number} | null>(null)
  const [dest, setDest] = useState<{name: string, lat: number, lon: number} | null>(null)
  const [result, setResult] = useState<{ distance: string; duration: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const calculateDistance = async () => {
    if (!origin || !dest) return
    setLoading(true)
    
    try {
      // Using OSRM (Open Source Routing Machine) Demo Server
      // Format: {service}/{version}/{profile}/{coordinates}
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${origin.lon},${origin.lat};${dest.lon},${dest.lat}?overview=false`
      )
      const data = await response.json()

      if (data.code === 'Ok' && data.routes.length > 0) {
        const route = data.routes[0]
        const distKm = (route.distance / 1000).toFixed(1)
        const durMin = Math.round(route.duration / 60)
        
        setResult({
          distance: `${distKm} km`,
          duration: durMin > 60 
            ? `${Math.floor(durMin/60)}h ${durMin%60}m` 
            : `${durMin} mins`
        })
      }
    } catch (error) {
      console.error('OSRM error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-[#262626]/10 shadow-xl shadow-[#262626]/5 rounded-[24px] overflow-hidden bg-white">
      <CardHeader className="p-8 border-b border-[#262626]/5 flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-black uppercase tracking-tighter flex items-center gap-3 text-[#262626]">
          <Navigation className="w-5 h-5 text-[#3B9ECC]" />
          Route Planner (Free)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/50">Start Point</label>
            <DestinationSearch 
              onSelect={(name, lat, lon) => setOrigin({name, lat: lat!, lon: lon!})} 
              placeholder="Search origin..." 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/50">End Point</label>
            <DestinationSearch 
              onSelect={(name, lat, lon) => setDest({name, lat: lat!, lon: lon!})} 
              placeholder="Search destination..." 
            />
          </div>
        </div>

        <Button 
          onClick={calculateDistance} 
          disabled={loading || !origin || !dest}
          className="w-full bg-[#262626] text-white rounded-full py-6 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#3B9ECC] hover:text-[#262626] transition-super"
        >
          {loading ? 'Calculating Route...' : 'Get Distance & Time'}
        </Button>

        {result ? (
          <div className="pt-6 mt-6 border-t border-[#262626]/5 grid grid-cols-2 gap-4 reveal-up-active">
            <div className="bg-[#f5f0eb] p-6 rounded-3xl text-center">
              <div className="text-[9px] font-black uppercase tracking-widest text-[#262626]/40 mb-2">Total Distance</div>
              <div className="text-3xl font-black text-[#262626]">{result.distance}</div>
            </div>
            <div className="bg-[#f5f0eb] p-6 rounded-3xl text-center">
              <div className="text-[9px] font-black uppercase tracking-widest text-[#262626]/40 mb-2">Estimated Drive</div>
              <div className="text-3xl font-black text-[#262626]">{result.duration}</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-2xl text-[10px] text-blue-600 font-bold uppercase tracking-widest">
            <Info className="w-4 h-4" />
            Powered by OpenStreetMap & OSRM
          </div>
        )}
      </CardContent>
    </Card>
  )
}
