'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addItineraryActivity(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const trip_id = formData.get('trip_id') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const activity_date = formData.get('activity_date') as string
  const type = formData.get('type') as string || 'event'
  const location = formData.get('location') as string

  if (!trip_id || !title || !activity_date) {
    throw new Error('Missing required fields')
  }

  const { error } = await supabase
    .from('itinerary_activities')
    .insert({
      trip_id,
      user_id: user.id,
      title,
      description,
      activity_date,
      type,
      location
    })

  if (error) {
    console.error('Error adding activity:', error)
    throw new Error('Failed to add activity')
  }

  revalidatePath(`/trips/${trip_id}/itinerary`)
}

export async function deleteItineraryActivity(activityId: string, tripId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('itinerary_activities')
    .delete()
    .eq('id', activityId)

  if (error) throw new Error('Failed to delete activity')

  revalidatePath(`/trips/${tripId}/itinerary`)
}
