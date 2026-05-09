'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createTrip(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const title = formData.get('title') as string
  const destination = formData.get('destination') as string
  const start_date = formData.get('start_date') as string
  const end_date = formData.get('end_date') as string
  const budget_per_person = parseFloat(formData.get('budget_per_person') as string)
  
  if (!title || !destination || !start_date || !end_date || isNaN(budget_per_person)) {
    throw new Error('Missing required fields')
  }

  const total_budget = budget_per_person;

  const { data: trip, error: tripError } = await supabase
    .from('trips')
    .insert({
      title,
      destination,
      start_date,
      end_date,
      budget_per_person,
      total_budget,
      creator_id: user.id
    })
    .select('id')
    .single()

  if (tripError || !trip) {
    console.error('Error creating trip:', tripError)
    throw new Error('Failed to create trip')
  }

  const { error: memberError } = await supabase
    .from('trip_members')
    .insert({
      trip_id: trip.id,
      user_id: user.id,
      role: 'admin'
    })

  if (memberError) {
    console.error('Error adding member:', memberError)
    throw new Error('Failed to add trip member')
  }

  redirect(`/trips/${trip.id}`)
}
