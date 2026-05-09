'use client'

import { useState } from 'react'
import { useJsApiLoader } from '@react-google-maps/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Navigation, MapPin, Calculator } from 'lucide-react'
import { DestinationSearch } from './destination-search'

export function DistanceChecker() {
  const [origin, setOrigin] = useState('')
  const [dest, setDest] = useState('')
  const [result, setResult] = useState<{ distance: string; duration: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const calculateDistance = async () => {
    if (!origin || !dest) return
    setLoading(true)
    
    const service = new google.maps.DistanceMatrixService()
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [dest],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
      },
      (response, status) => {
        if (status === 'OK' && response) {
          const element = response.rows[0].elements[0]
          if (element.status === 'OK') {
            setResult({
              distance: element.distance.text,
              duration: element.duration.text
            })
          }
        }
        setLoading(false)
      }
    )
  }

  return (
    <Card className="border-[#262626]/10 shadow-xl shadow-[#262626]/5 rounded-[24px] overflow-hidden bg-white">
      <CardHeader className="p-8 border-b border-[#262626]/5 flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-black uppercase tracking-tighter flex items-center gap-3 text-[#262626]">
          <Navigation className="w-5 h-5 text-[#e4a4bd]" />
          Quick Distance Check
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/50">From (Origin)</label>
            <DestinationSearch onSelect={(addr) => setOrigin(addr)} placeholder="Current location or hotel..." />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]/50">To (Destination)</label>
            <DestinationSearch onSelect={(addr) => setDest(addr)} placeholder="Activity or destination..." />
          </div>
        </div>

        <Button 
          onClick={calculateDistance} 
          disabled={loading || !origin || !dest}
          className="w-full bg-[#262626] text-white rounded-full py-6 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#e4a4bd] hover:text-[#262626] transition-super"
        >
          {loading ? 'Calculating...' : 'Calculate Route'}
        </Button>

        {result && (
          <div className="pt-6 mt-6 border-t border-[#262626]/5 grid grid-cols-2 gap-4 reveal-up-start [animation:reveal-up-active_0.5s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            <div className="bg-[#f5f0eb] p-4 rounded-2xl">
              <div className="text-[9px] font-black uppercase tracking-widest text-[#262626]/40 mb-1">Distance</div>
              <div className="text-xl font-black text-[#262626]">{result.distance}</div>
            </div>
            <div className="bg-[#f5f0eb] p-4 rounded-2xl">
              <div className="text-[9px] font-black uppercase tracking-widest text-[#262626]/40 mb-1">Drive Time</div>
              <div className="text-xl font-black text-[#262626]">{result.duration}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
