'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import Razorpay from 'razorpay'

export async function createBookingOrder(listingId: string, amount: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
  })

  const amountInPaise = Math.round(amount * 100)

  try {
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${listingId}_${Date.now()}`
    })

    return {
      orderId: order.id,
      amount: order.amount,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID
    }
  } catch (error) {
    console.error("Razorpay order creation failed:", error)
    throw new Error('Failed to create payment order')
  }
}
export async function confirmBooking(data: {
  listingId: string,
  tripId?: string,
  startDate: string,
  endDate: string,
  totalPrice: number,
  razorpayOrderId: string,
  razorpayPaymentId: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('bookings')
    .insert({
      listing_id: data.listingId,
      guest_id: user.id,
      trip_id: data.tripId,
      start_date: data.startDate,
      end_date: data.endDate,
      total_price: data.totalPrice,
      razorpay_order_id: data.razorpayOrderId,
      razorpay_payment_id: data.razorpayPaymentId,
      status: 'confirmed'
    })

  if (error) {
    console.error('Booking Confirmation Error:', error)
    throw new Error('Failed to confirm booking')
  }

  revalidatePath('/marketplace')
  revalidatePath('/dashboard')
}

export async function updateBookingStatus(bookingId: string, status: string, tripId?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)

  if (error) {
    console.error('Update Booking Error:', error)
    throw new Error('Failed to update booking status')
  }

  revalidatePath('/dashboard/host')
  revalidatePath('/dashboard/bookings')
}
