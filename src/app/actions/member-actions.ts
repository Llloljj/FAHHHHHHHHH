'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function joinTrip(tripId: string) {
  const supabase = await createClient()

  let { data: { user } } = await supabase.auth.getUser()

  // Auto-create anonymous session if needed
  if (!user) {
    const { data } = await supabase.auth.signInAnonymously()
    user = data.user
  }

  if (!user) throw new Error('Could not establish session')

  // Check if already a member
  const { data: existingMember } = await supabase
    .from('trip_members')
    .select('id')
    .eq('trip_id', tripId)
    .eq('user_id', user.id)
    .single()

  if (!existingMember) {
    const { error } = await supabase
      .from('trip_members')
      .insert({ trip_id: tripId, user_id: user.id, role: 'member' })

    if (error) {
      console.error('Error joining trip:', error)
      throw new Error('Failed to join trip.')
    }
  }

  redirect(`/trips/${tripId}`)
}
