'use client'

import { useState } from 'react'
import { submitKYC } from '@/app/actions/marketplace-actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  ShieldCheck,
  UploadCloud,
  User,
  FileText,
  CheckCircle2,
  ChevronRight,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { RevealUp } from '@/components/reveal-up'

export default function BecomeHostPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)

  const handleNext = () => setStep(step + 1)
  const handleBack = () => setStep(step - 1)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await submitKYC(formData)
      setCompleted(true)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (completed) {
    return (
      <div className="min-h-screen pt-[100px] px-8 flex items-center justify-center bg-[#fdf8f3]">
        <RevealUp className="max-w-md w-full text-center space-y-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-[#262626]">Application Submitted!</h1>
          <p className="text-[#262626]/60 font-medium">
            Your host profile is being verified. You can now start creating listings in the marketplace.
          </p>
          <Link href="/marketplace" className="inline-block bg-[#262626] text-white rounded-full px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#3B9ECC] hover:text-[#262626] transition-all">
            Go to Marketplace
          </Link>
        </RevealUp>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-[100px] px-8 md:px-16 bg-[#fdf8f3] pb-24">
      <div className="max-w-3xl mx-auto">
        <Link href="/marketplace" className="text-[10px] uppercase tracking-[0.2em] font-black text-[#3B9ECC] hover:text-[#262626] transition-colors mb-12 inline-block">
          ← Back to Marketplace
        </Link>

        <RevealUp className="mb-12">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-[#262626] leading-[0.85]">
            BECOME A <br /> <span className="text-[#3B9ECC]">BANJARE HOST</span>
          </h1>
          <p className="text-xl text-[#262626]/60 mt-6 font-medium max-w-xl">
            Join our exclusive community of local experts and property owners. Verify your identity to start hosting.
          </p>
        </RevealUp>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-12">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-[#3B9ECC]' : 'bg-[#262626]/5'}`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {step === 1 && (
            <RevealUp className="space-y-6">
              <div className="flex items-center gap-3 text-[#3B9ECC] mb-2">
                <User className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Step 1: Personal Details</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#262626]/40 ml-4">Full Name</label>
                  <Input name="full_name" placeholder="John Doe" required className="rounded-full bg-white border-0 py-6 px-6" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#262626]/40 ml-4">Contact Number</label>
                  <Input name="phone" placeholder="+91 98765 43210" required className="rounded-full bg-white border-0 py-6 px-6" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#262626]/40 ml-4">Bio / About You</label>
                <Textarea name="bio" placeholder="Tell us about your hosting experience..." className="rounded-[24px] bg-white border-0 p-6 min-h-[120px]" />
              </div>
              <Button type="button" onClick={handleNext} className="w-full md:w-auto bg-[#262626] text-white rounded-full px-12 py-6 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#3B9ECC] hover:text-[#262626] transition-all flex items-center gap-2">
                Continue <ChevronRight className="w-4 h-4" />
              </Button>
            </RevealUp>
          )}

          {step === 2 && (
            <RevealUp className="space-y-6">
              <div className="flex items-center gap-3 text-[#3B9ECC] mb-2">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Step 2: Identity Verification</span>
              </div>
              <Card className="border-dashed border-2 border-[#262626]/10 bg-white/50 rounded-[32px] p-12 text-center">
                <UploadCloud className="w-12 h-12 text-[#3B9ECC] mx-auto mb-4" />
                <h3 className="text-xl font-black uppercase tracking-tighter text-[#262626]">Upload Govt. ID</h3>
                <p className="text-sm text-[#262626]/40 font-medium mt-2 mb-8">
                  Aadhaar, PAN, or Passport (Max 5MB)
                </p>
                <div className="relative">
                  <input type="file" className="hidden" id="id-upload" />
                  <label htmlFor="id-upload" className="cursor-pointer bg-[#f5f0eb] text-[#262626] rounded-full px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#262626] hover:text-white transition-all inline-block">
                    Select File
                  </label>
                </div>
              </Card>
              <div className="flex gap-4">
                <Button type="button" onClick={handleBack} variant="outline" className="rounded-full px-8 py-6 border-[#262626]/10">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button type="button" onClick={handleNext} className="flex-1 bg-[#262626] text-white rounded-full px-12 py-6 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#3B9ECC] hover:text-[#262626] transition-all flex items-center justify-center gap-2">
                  Continue <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </RevealUp>
          )}

          {step === 3 && (
            <RevealUp className="space-y-6">
              <div className="flex items-center gap-3 text-[#3B9ECC] mb-2">
                <FileText className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Step 3: Host Agreement</span>
              </div>
              <div className="bg-white p-8 rounded-[32px] border border-[#262626]/5 space-y-4">
                <p className="text-sm text-[#262626]/70 leading-relaxed font-medium">
                  By joining BANJARE, you agree to provide high-quality services, maintain accurate calendars, and follow our safety guidelines.
                </p>
                <div className="flex items-start gap-3 pt-4">
                  <input type="checkbox" required className="mt-1 accent-[#3B9ECC]" id="agree" />
                  <label htmlFor="agree" className="text-xs text-[#262626]/60 font-bold uppercase tracking-tight leading-tight">
                    I agree to the BANJARE Host Terms of Service and Privacy Policy.
                  </label>
                </div>
              </div>
              <div className="flex gap-4">
                <Button type="button" onClick={handleBack} variant="outline" className="rounded-full px-8 py-6 border-[#262626]/10">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button type="submit" disabled={loading} className="flex-1 bg-[#262626] text-white rounded-full px-12 py-6 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#3B9ECC] hover:text-[#262626] transition-all flex items-center justify-center gap-2">
                  {loading ? 'Submitting...' : 'Complete Application'}
                </Button>
              </div>
            </RevealUp>
          )}
        </form>
      </div>
    </div>
  )
}
