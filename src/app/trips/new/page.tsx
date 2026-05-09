'use client'

import { useState } from 'react'
import { createTrip } from '@/app/actions/trip-actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { DestinationSearch } from '@/components/destination-search'
import { RevealUp } from '@/components/reveal-up'


export default function NewTripPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      await createTrip(formData)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen pt-24 px-4 bg-background pb-24">
      <RevealUp className="w-full max-w-2xl mx-auto">
        <Link href="/dashboard" className="text-[10px] uppercase tracking-[0.2em] font-black text-[#3B9ECC] hover:text-[#262626] transition-colors mb-8 inline-block">
          ← Back to Dashboard
        </Link>

        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#262626] mb-8">
          Craft Your <span className="text-[#3B9ECC]">Journey</span>
        </h1>

        <Card className="border-[#262626]/10 shadow-xl shadow-[#262626]/5 rounded-[24px]">
          <CardHeader className="p-8 border-b border-[#262626]/10">
            <CardTitle className="text-2xl font-black uppercase tracking-tighter">Trip Details</CardTitle>
            <CardDescription className="text-base text-[#262626]/70 font-medium">
              Define the foundation of your group experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]">Trip Title</label>
                <Input
                  id="title"
                  name="title"
                  placeholder="E.g., Summer in Kyoto"
                  required
                  className="rounded-full px-6 py-6 border-[#262626]/20 focus-visible:ring-[#3B9ECC]"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="destination" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]">Destination</label>
                <DestinationSearch
                  onSelect={(addr) => console.log('Selected:', addr)}
                  placeholder="City, Country"
                  name="destination"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="start_date" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]">Start Date</label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    required
                    className="rounded-full px-6 py-6 border-[#262626]/20 focus-visible:ring-[#3B9ECC]"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="end_date" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]">End Date</label>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="date"
                    required
                    className="rounded-full px-6 py-6 border-[#262626]/20 focus-visible:ring-[#3B9ECC]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="budget_per_person" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]">Budget Per Person (Activity/Local Only)</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#262626]/50 font-bold">₹</span>
                  <Input
                    id="budget_per_person"
                    name="budget_per_person"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="50000"
                    required
                    className="rounded-full pl-12 pr-6 py-6 border-[#262626]/20 focus-visible:ring-[#3B9ECC]"
                  />
                </div>
              </div>

              {error && <div className="text-sm text-destructive font-medium p-4 bg-destructive/10 rounded-[12px]">{error}</div>}

              <div className="pt-4">
                <Button type="submit" disabled={loading} className="w-full bg-[#262626] text-white hover:bg-[#3B9ECC] hover:text-[#262626] transition-super rounded-full py-8 text-[12px] font-black uppercase tracking-[0.2em]">
                  {loading ? 'Initializing BANJARE...' : 'Create Trip'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </RevealUp>
    </div>
  )
}
