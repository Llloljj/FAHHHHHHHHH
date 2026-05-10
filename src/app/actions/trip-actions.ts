'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { revalidatePath } from 'next/cache'

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
  
  const group_size = parseInt(formData.get('group_size') as string) || 1
  const spending_power = formData.get('spending_power') as string || 'standard'
  const vendor_requirements = formData.get('vendor_requirements') as string || ''

  if (!title || !destination || !start_date || !end_date || isNaN(budget_per_person)) {
    throw new Error('Missing required fields')
  }

  // Generate ID here to bypass the need for a .select() which triggers RLS SELECT policies
  const tripId = uuidv4()

  // CREATE ADMIN CLIENT TO BYPASS RLS AUTHORIZATION
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://unlhbwrudnossaksrqsd.supabase.co'
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseServiceKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY in .env.local")
  }

  const adminAuthClient = createSupabaseAdmin(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  const { error: tripError } = await adminAuthClient
    .from('trips')
    .insert({
      id: tripId,
      title,
      destination,
      start_date,
      end_date,
      budget_per_person,
      total_budget: budget_per_person * group_size,
      creator_id: creatorId,
      group_size,
      spending_power,
      vendor_requirements
    })

  if (tripError) {
    console.error('Error creating trip:', tripError)
    throw new Error(`Failed to create trip: ${tripError.message}`)
  }

  if (user) {
    const { error: memberError } = await adminAuthClient.from('trip_members').insert({
      trip_id: tripId,
      user_id: user.id,
      role: 'admin'
    })
    
    if (memberError) {
      console.error('Error adding user to trip_members:', memberError)
      throw new Error(`Failed to link user to trip: ${memberError.message}`)
    }
  }

  redirect(`/trips/${tripId}`)
}

export async function deleteTrip(tripId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Not authenticated')
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseServiceKey) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY in .env.local")
  }

  const adminAuthClient = createSupabaseAdmin(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  // Verify ownership or admin role in trip_members
  const { data: member } = await adminAuthClient
    .from('trip_members')
    .select('role')
    .eq('trip_id', tripId)
    .eq('user_id', user.id)
    .single()

  if (!member || member.role !== 'admin') {
    throw new Error('Not authorized to delete this trip')
  }

  const { error } = await adminAuthClient
    .from('trips')
    .delete()
    .eq('id', tripId)

  if (error) {
    throw new Error(`Failed to delete trip: ${error.message}`)
  }

  revalidatePath('/dashboard')
}
