'use client'

import { useState } from 'react'
import { createListing, submitKYC } from '@/app/actions/marketplace-actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ShieldCheck, Home, Car, UserCheck, ArrowRight, Camera } from 'lucide-react'
import Link from 'next/link'
import { RevealUp } from '@/components/reveal-up'

export default function NewListingPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState<'home' | 'vehicle' | 'guide' | null>(null)

  const handleKYC = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      await submitKYC(new FormData(e.currentTarget))
      setStep(2)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    if (type) formData.append('type', type)
    try {
      await createListing(formData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-32 px-8 bg-[#fdf8f3] pb-24">
      <div className="max-w-2xl mx-auto">
        <Link href="/marketplace" className="text-[10px] uppercase tracking-[0.2em] font-black text-[#3B9ECC] mb-8 inline-block">
          ← Back to Marketplace
        </Link>

        {step === 1 ? (
          <RevealUp>
            <h1 className="text-5xl font-black uppercase tracking-tighter text-[#262626] mb-4">Host Verification</h1>
            <p className="text-[#262626]/60 mb-12 font-medium">To maintain luxury standards, all hosts must verify their identity.</p>
            
            <Card className="rounded-[32px] border-0 shadow-xl shadow-[#262626]/5">
              <CardContent className="p-10">
                <form onSubmit={handleKYC} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em]">Full Legal Name</label>
                    <Input name="full_name" placeholder="As per Aadhaar / Passport" required className="rounded-full px-6 py-6" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em]">Host Bio</label>
                    <Input name="bio" placeholder="Tell us about yourself and your service..." className="rounded-[24px] p-6" />
                  </div>
                  <div className="p-8 bg-[#f5f0eb] rounded-[24px] border-2 border-dashed border-[#262626]/10 text-center">
                    <Camera className="w-8 h-8 text-[#262626]/20 mx-auto mb-4" />
                    <p className="text-xs font-bold text-[#262626]/40 uppercase tracking-widest">Upload Identity Document (Mock)</p>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full bg-[#262626] text-white rounded-full py-8 text-[12px] font-black uppercase tracking-[0.2em] hover:bg-[#3B9ECC] hover:text-[#262626] transition-all">
                    {loading ? 'Verifying...' : 'Verify & Continue'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </RevealUp>
        ) : (
          <RevealUp>
            <h1 className="text-5xl font-black uppercase tracking-tighter text-[#262626] mb-12">Listing Details</h1>
            
            <div className="grid grid-cols-3 gap-4 mb-12">
              {[
                { id: 'home', label: 'Home', icon: Home },
                { id: 'vehicle', label: 'Vehicle', icon: Car },
                { id: 'guide', label: 'Guide', icon: UserCheck }
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setType(item.id as any)}
                  className={`p-6 rounded-[24px] border-2 transition-all flex flex-col items-center gap-4 ${type === item.id ? 'border-[#3B9ECC] bg-[#3B9ECC]/10' : 'border-[#262626]/5 bg-white'}`}
                >
                  <item.icon className={`w-8 h-8 ${type === item.id ? 'text-[#3B9ECC]' : 'text-[#262626]/20'}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                </button>
              ))}
            </div>

            <Card className="rounded-[32px] border-0 shadow-xl shadow-[#262626]/5">
              <CardContent className="p-10">
                <form onSubmit={handleCreate} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em]">Listing Title</label>
                    <Input name="title" placeholder="E.g. Penthouse in Mumbai" required className="rounded-full px-6 py-6" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em]">Price Per Day (₹)</label>
                      <Input name="price_per_day" type="number" placeholder="5000" required className="rounded-full px-6 py-6" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em]">Location</label>
                      <Input name="location" placeholder="City, State" required className="rounded-full px-6 py-6" />
                    </div>
                  </div>
                  {type === 'vehicle' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3B9ECC]">Security Deposit (Refundable) (₹)</label>
                      <Input name="security_deposit_amount" type="number" placeholder="2000" className="rounded-full px-6 py-6 border-[#3B9ECC]/20" />
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em]">Description</label>
                    <Textarea name="description" placeholder="Detailed description of features, amenities, or services..." className="rounded-[24px] p-6" />
                  </div>
                  <Button type="submit" disabled={loading || !type} className="w-full bg-[#3B9ECC] text-[#262626] rounded-full py-8 text-[12px] font-black uppercase tracking-[0.2em] hover:opacity-80 transition-all flex items-center justify-center gap-3">
                    {loading ? 'Publishing...' : 'Publish Listing'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </RevealUp>
        )}
      </div>
    </div>
  )
}
