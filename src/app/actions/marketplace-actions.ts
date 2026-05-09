'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createListing(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const type = formData.get('type') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price_per_day = parseFloat(formData.get('price_per_day') as string)
  const location = formData.get('location') as string

  if (!type || !title || isNaN(price_per_day)) {
    throw new Error('Missing required fields')
  }

  const { data: listing, error } = await supabase
    .from('listings')
    .insert({
      host_id: user.id,
      type,
      title,
      description,
      price_per_day,
      location,
      is_verified: true, // Simulating auto-verify for MVP
      images: [
        `https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80` // Placeholder
      ]
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error creating listing:', error)
    throw new Error('Failed to create listing')
  }

  revalidatePath('/marketplace')
  redirect('/marketplace')
}

export async function submitKYC(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('host_profiles')
    .upsert({
      user_id: user.id,
      full_name: formData.get('full_name') as string,
      bio: formData.get('bio') as string,
      kyc_status: 'verified' // Simulating instant verification
    })

  if (error) throw new Error('Failed to update KYC profile')

  revalidatePath('/marketplace/become-host')
}
