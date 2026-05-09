'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addExpense(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const trip_id = formData.get('trip_id') as string
  const description = formData.get('description') as string
  const amount = parseFloat(formData.get('amount') as string)
  const category = formData.get('category') as string
  const date = formData.get('date') as string || new Date().toISOString().split('T')[0]

  if (!trip_id || !description || isNaN(amount)) {
    throw new Error('Missing required fields')
  }

  // 1. Insert the main expense
  const { data: expense, error: expenseError } = await supabase
    .from('expenses')
    .insert({
      trip_id,
      payer_id: user.id,
      amount,
      description,
      category,
      date
    })
    .select('id')
    .single()

  if (expenseError || !expense) {
    console.error('Error creating expense:', expenseError)
    throw new Error('Failed to create expense')
  }

  // 2. Fetch all members to split equally
  const { data: members } = await supabase
    .from('trip_members')
    .select('user_id')
    .eq('trip_id', trip_id)

  if (members && members.length > 0) {
    const splitAmount = amount / members.length
    const splits = members.map(m => ({
      expense_id: expense.id,
      user_id: m.user_id,
      amount: splitAmount
    }))

    const { error: splitError } = await supabase
      .from('expense_splits')
      .insert(splits)

    if (splitError) {
      console.error('Error creating splits:', splitError)
    }
  }

  revalidatePath(`/trips/${trip_id}`)
}

export async function deleteExpense(expenseId: string, tripId: string) {
  const supabase = await createClient()
  
  // Splits will be deleted by ON DELETE CASCADE if configured, 
  // otherwise we delete them manually first.
  await supabase.from('expense_splits').delete().eq('expense_id', expenseId)
  
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', expenseId)

  if (error) throw new Error('Failed to delete expense')

  revalidatePath(`/trips/${tripId}`)
}
