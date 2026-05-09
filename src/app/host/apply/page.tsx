'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { RevealUp } from '@/components/reveal-up'

export default function HostApplyPage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    // Simulate submission
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1500)
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen pt-24 px-4 bg-background pb-24 items-center justify-center">
        <RevealUp className="w-full max-w-2xl text-center">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#262626] mb-4">
            Application <span className="text-[#3B9ECC]">Received</span>
          </h1>
          <p className="text-[#262626]/70 font-medium text-lg mb-8">
            Thank you for applying to offer your services on BANJARE. Our team will review your application and get back to you soon.
          </p>
          <Link href="/dashboard" className="bg-[#262626] text-white rounded-full px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#3B9ECC] hover:text-[#262626] transition-super">
            Back to Dashboard
          </Link>
        </RevealUp>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen pt-24 px-4 bg-background pb-24">
      <RevealUp className="w-full max-w-2xl mx-auto">
        <Link href="/dashboard" className="text-[10px] uppercase tracking-[0.2em] font-black text-[#3B9ECC] hover:text-[#262626] transition-colors mb-8 inline-block">
          ← Back to Dashboard
        </Link>

        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#262626] mb-8">
          Offer Your <span className="text-[#3B9ECC]">Services</span>
        </h1>

        <Card className="border-[#262626]/10 shadow-xl shadow-[#262626]/5 rounded-[24px]">
          <CardHeader className="p-8 border-b border-[#262626]/10">
            <CardTitle className="text-2xl font-black uppercase tracking-tighter">Service Application</CardTitle>
            <CardDescription className="text-base text-[#262626]/70 font-medium">
              Share your resources (homes, vehicles, or food) with the community.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="service_type" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]">Service Type</label>
                <select
                  id="service_type"
                  name="service_type"
                  required
                  className="flex h-10 w-full rounded-full border border-[#262626]/20 bg-background px-6 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B9ECC] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ height: '50px' }}
                >
                  <option value="home">Home / Accommodation</option>
                  <option value="vehicle">Vehicle Rental</option>
                  <option value="food">Local Food / Meals</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="title" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]">Listing Title</label>
                <Input
                  id="title"
                  name="title"
                  placeholder="E.g., Cozy 2BHK or Vintage SUV"
                  required
                  className="rounded-full px-6 py-6 border-[#262626]/20 focus-visible:ring-[#3B9ECC]"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]">Description</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe what you are offering (e.g., details about the home, vehicle, or the type of food)..."
                  className="flex min-h-[100px] w-full rounded-2xl border border-[#262626]/20 bg-background px-6 py-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B9ECC] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="price" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]">Price Per Day / Per Meal (₹)</label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  placeholder="E.g., 2000"
                  required
                  className="rounded-full px-6 py-6 border-[#262626]/20 focus-visible:ring-[#3B9ECC]"
                />
              </div>

              <div className="pt-4">
                <Button type="submit" disabled={loading} className="w-full bg-[#262626] text-white hover:bg-[#3B9ECC] hover:text-[#262626] transition-super rounded-full py-8 text-[12px] font-black uppercase tracking-[0.2em]">
                  {loading ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </RevealUp>
    </div>
  )
}
