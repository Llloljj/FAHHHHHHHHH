'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function joinTrip(tripId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/login?next=/trips/${tripId}/invite`)
  }

  // Check if already a member
  const { data: existingMember } = await supabase
    .from('trip_members')
    .select('id')
    .eq('trip_id', tripId)
    .eq('user_id', user.id)
    .single()

  if (!existingMember) {
    // Insert new member
    const { error } = await supabase
      .from('trip_members')
      .insert({
        trip_id: tripId,
        user_id: user.id,
        role: 'member'
      })

    if (error) {
      console.error('Error joining trip:', error)
      throw new Error('Failed to join trip. Please try again.')
    }
  }

  redirect(`/trips/${tripId}`)
}
