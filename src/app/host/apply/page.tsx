'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { RevealUp } from '@/components/reveal-up'
import { createClient } from '@/lib/supabase/client'

export default function HostApplyPage() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [serviceType, setServiceType] = useState('home')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const formValues = Object.fromEntries(formData.entries())
    
    const supabase = createClient()
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('You must be logged in to apply.')
      setLoading(false)
      return
    }

    let imageUrl = ''
    const fileInput = e.currentTarget.querySelector('#listing_image') as HTMLInputElement
    const file = fileInput?.files?.[0]

    if (file) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('image')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        setError('Failed to upload image.')
        setLoading(false)
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from('image')
        .getPublicUrl(filePath)
        
      imageUrl = publicUrl
    }

    // Prepare details based on service type
    const details: any = {
      image_url: imageUrl,
      city: formValues.city,
      address: formValues.address
    }

    if (serviceType === 'home') {
      details.size = formValues.home_size
      details.washrooms = formValues.washrooms
      details.facilities = formData.getAll('facilities')
    } else if (serviceType === 'vehicle') {
      details.vehicle_type = formValues.vehicle_type
      details.charges_per_hour = formValues.charges_per_hour
      details.vehicle_model = formValues.vehicle_model
    } else if (serviceType === 'food') {
      details.spice_level = formValues.spice_level
      details.price = formValues.food_price
      details.menu_details = formValues.menu_details
    } else if (serviceType === 'guide') {
      details.area_description = formValues.area_description
      details.can_make_plan = formValues.can_make_plan
      details.guide_rate = formValues.guide_rate
    }

    // Insert into database
    const { error: insertError } = await supabase
      .from('service_applications')
      .insert({
        user_id: user.id,
        service_type: serviceType,
        full_name: formValues.full_name,
        id_proof_type: formValues.id_proof_type,
        id_proof_number: formValues.id_proof_number,
        details: details
      })

    if (insertError) {
      console.error('Insert error:', insertError)
      setError(`Failed to save application: ${insertError.message}`)
      setLoading(false)
      return
    }

    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen pt-24 px-4 bg-background pb-24 items-center justify-center">
        <RevealUp className="w-full max-w-2xl text-center">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#262626] mb-4">
            Application <span className="text-[#3B9ECC]">Received</span>
          </h1>
          <p className="text-[#262626]/70 font-medium text-lg mb-8">
            Thank you for applying to offer your services on BANJARE. Our team will review your application and valid ID proof to verify your account.
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
              Fill out the details to apply as a service provider.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="full_name" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]">Full Name</label>
                  <Input id="full_name" name="full_name" placeholder="As per ID proof" required className="rounded-full px-6 py-6 border-[#262626]/20 focus-visible:ring-[#3B9ECC]" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="id_proof_type" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]">ID Proof Type</label>
                  <select id="id_proof_type" name="id_proof_type" required className="flex h-10 w-full rounded-full border border-[#262626]/20 bg-background px-6 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B9ECC]" style={{ height: '50px' }}>
                    <option value="aadhaar">Aadhaar Card</option>
                    <option value="pan">PAN Card</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="id_proof_number" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]">ID Proof Number</label>
                <Input id="id_proof_number" name="id_proof_number" placeholder="Enter card number" required className="rounded-full px-6 py-6 border-[#262626]/20 focus-visible:ring-[#3B9ECC]" />
              </div>

              {/* Location Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#262626]/5 pt-6">
                <div className="space-y-2">
                  <label htmlFor="city" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]">City</label>
                  <Input id="city" name="city" placeholder="E.g., Nagpur, Mumbai" required className="rounded-full px-6 py-6 border-[#262626]/20 focus-visible:ring-[#3B9ECC]" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="address" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]">Full Address</label>
                  <Input id="address" name="address" placeholder="Enter full address" required className="rounded-full px-6 py-6 border-[#262626]/20 focus-visible:ring-[#3B9ECC]" />
                </div>
              </div>

              {/* Service Type */}
              <div className="space-y-2 border-t border-[#262626]/5 pt-6">
                <label htmlFor="service_type" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]">Service Type</label>
                <select
                  id="service_type"
                  name="service_type"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  required
                  className="flex h-10 w-full rounded-full border border-[#262626]/20 bg-background px-6 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B9ECC]"
                  style={{ height: '50px' }}
                >
                  <option value="home">Home / Accommodation</option>
                  <option value="vehicle">Vehicle Rental</option>
                  <option value="food">Local Food / Meals</option>
                  <option value="guide">Local Guide</option>
                </select>
              </div>

              {/* Dynamic Fields */}
              
              {/* 1. HOME */}
              {serviceType === 'home' && (
                <div className="space-y-6 border-t border-[#262626]/5 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="home_size" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]">Size / Type</label>
                      <Input id="home_size" name="home_size" placeholder="E.g., 2BHK, Villa" required className="rounded-full px-6 py-6 border-[#262626]/20 focus-visible:ring-[#3B9ECC]" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="washrooms" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]">Washrooms</label>
                      <Input id="washrooms" name="washrooms" type="number" min="1" placeholder="E.g., 2" required className="rounded-full px-6 py-6 border-[#262626]/20 focus-visible:ring-[#3B9ECC]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]">Facilities</label>
                    <div className="flex flex-wrap gap-4">
                      {['AC', 'Cooler', 'Fan', 'Wi-Fi', 'Parking'].map((facility) => (
                        <label key={facility} className="flex items-center gap-2 text-sm font-medium text-[#262626]/70">
                          <input type="checkbox" name="facilities" value={facility.toLowerCase()} className="rounded border-[#262626]/20 text-[#3B9ECC] focus:ring-[#3B9ECC]" />
                          {facility}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. VEHICLE */}
              {serviceType === 'vehicle' && (
                <div className="space-y-6 border-t border-[#262626]/5 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="vehicle_type" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]">Vehicle Type</label>
                      <select id="vehicle_type" name="vehicle_type" required className="flex h-10 w-full rounded-full border border-[#262626]/20 bg-background px-6 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B9ECC]" style={{ height: '50px' }}>
                        <option value="2_wheeler">2 Wheeler</option>
                        <option value="3_wheeler">3 Wheeler</option>
                        <option value="4_wheeler">4 Wheeler</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="charges_per_hour" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]">Charges Per Hour (₹)</label>
                      <Input id="charges_per_hour" name="charges_per_hour" type="number" min="0" placeholder="E.g., 100" required className="rounded-full px-6 py-6 border-[#262626]/20 focus-visible:ring-[#3B9ECC]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="vehicle_model" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]">Vehicle Model</label>
                    <Input id="vehicle_model" name="vehicle_model" placeholder="E.g., Activa 6G, Swift" required className="rounded-full px-6 py-6 border-[#262626]/20 focus-visible:ring-[#3B9ECC]" />
                  </div>
                </div>
              )}

              {/* 3. FOOD */}
              {serviceType === 'food' && (
                <div className="space-y-6 border-t border-[#262626]/5 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="spice_level" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]">Spice Level</label>
                      <select id="spice_level" name="spice_level" required className="flex h-10 w-full rounded-full border border-[#262626]/20 bg-background px-6 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B9ECC]" style={{ height: '50px' }}>
                        <option value="low">Low / Non-Spicy</option>
                        <option value="medium">Medium</option>
                        <option value="high">High / Spicy</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="food_price" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]">Price Per Meal (₹)</label>
                      <Input id="food_price" name="food_price" type="number" min="0" placeholder="E.g., 150" required className="rounded-full px-6 py-6 border-[#262626]/20 focus-visible:ring-[#3B9ECC]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="menu_details" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]">Menu Details</label>
                    <textarea id="menu_details" name="menu_details" placeholder="E.g., Thali, Local specialty, Veg/Non-Veg..." className="flex min-h-[80px] w-full rounded-2xl border border-[#262626]/20 bg-background px-6 py-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B9ECC]" required />
                  </div>
                </div>
              )}

              {/* 4. GUIDE */}
              {serviceType === 'guide' && (
                <div className="space-y-6 border-t border-[#262626]/5 pt-6">
                  <div className="space-y-2">
                    <label htmlFor="area_description" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]">About Your Area</label>
                    <textarea id="area_description" name="area_description" placeholder="Tell tourists about your area, hidden gems, etc..." className="flex min-h-[100px] w-full rounded-2xl border border-[#262626]/20 bg-background px-6 py-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B9ECC]" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="can_make_plan" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]">Can you make a customized plan for tourists?</label>
                    <select id="can_make_plan" name="can_make_plan" required className="flex h-10 w-full rounded-full border border-[#262626]/20 bg-background px-6 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B9ECC]" style={{ height: '50px' }}>
                      <option value="yes">Yes, I can plan full itineraries</option>
                      <option value="no">No, only guiding at spots</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="guide_rate" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]">Expected Charges Per Day (₹)</label>
                    <Input id="guide_rate" name="guide_rate" type="number" min="0" placeholder="E.g., 1000" required className="rounded-full px-6 py-6 border-[#262626]/20 focus-visible:ring-[#3B9ECC]" />
                  </div>
                </div>
              )}

              {/* Image Upload */}
              <div className="space-y-2 border-t border-[#262626]/5 pt-6">
                <label htmlFor="listing_image" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#262626]">Upload Service Image (Home, Vehicle, Food, or Building)</label>
                <Input id="listing_image" name="listing_image" type="file" accept="image/*" className="rounded-full px-6 py-2 border-[#262626]/20 focus-visible:ring-[#3B9ECC]" />
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
