'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createTrip(formData: FormData) {
  const supabase = await createClient()

  // Get current session
  const { data: { user } } = await supabase.auth.getUser()
  
  // Proceed even without user (using null for creator_id)
  const creatorId = user?.id || null

  const title = formData.get('title') as string
  const destination = formData.get('destination') as string
  const start_date = formData.get('start_date') as string
  const end_date = formData.get('end_date') as string
  const budget_per_person = parseFloat(formData.get('budget_per_person') as string)

  if (!title || !destination || !start_date || !end_date || isNaN(budget_per_person)) {
    throw new Error('Missing required fields')
  }

  const { data: trip, error: tripError } = await supabase
    .from('trips')
    .insert({
      title,
      destination,
      start_date,
      end_date,
      budget_per_person,
      total_budget: budget_per_person,
      creator_id: creatorId
    })
    .select('id')
    .single()

  if (tripError || !trip) {
    console.error('Error creating trip:', tripError)
    throw new Error('Failed to create trip')
  }

  if (user) {
    await supabase.from('trip_members').insert({
      trip_id: trip.id,
      user_id: user.id,
      role: 'admin'
    })
  }

  redirect(`/trips/${trip.id}`)
}
