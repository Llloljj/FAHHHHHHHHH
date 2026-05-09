'use client'

import { useState } from 'react'
import { createBookingOrder, confirmBooking } from '@/app/actions/booking-actions'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card } from '@/components/ui/card'
import { CalendarIcon, CreditCard, ShieldCheck } from 'lucide-react'
import { format } from 'date-fns'
import { SuccessState } from '@/components/success-state'

interface BookingModalProps {
  listing: {
    id: string
    title: string
    price_per_day: number
    security_deposit_amount?: number
  }
  children: React.ReactNode
}

export function BookingModal({ listing, children }: BookingModalProps) {
  const [date, setDate] = useState<{ from: Date; to: Date } | undefined>()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const days = date?.from && date?.to
    ? Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 0
  const total = days * listing.price_per_day

  const handleBooking = async () => {
    if (!date?.from || !date?.to) return
    setLoading(true)

    try {
      // 1. Create Order via Server Action
      const order = await createBookingOrder(listing.id, total)

      // 2. Initialize Razorpay Checkout
      const options = {
        key: order.key,
        amount: order.amount,
        currency: "INR",
        name: "BANJARE",
        description: `Booking for ${listing.title}`,
        order_id: order.orderId,
        handler: async function (response: any) {
          try {
            // 3. Confirm Booking in Database
            await confirmBooking({
              listingId: listing.id,
              startDate: format(date!.from, 'yyyy-MM-dd'),
              endDate: format(date!.to, 'yyyy-MM-dd'),
              totalPrice: total,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id
            })
            setIsSuccess(true)
          } catch (err) {
            console.error("Booking confirmation failed:", err)
            alert("Payment successful but booking confirmation failed. Please contact support.")
          } finally {
            setLoading(false)
          }
        },
        prefill: {
          name: "Guest", // Could be dynamically loaded from user profile
          email: "guest@example.com",
        },
        theme: {
          color: "#3B9ECC"
        },
        modal: {
          ondismiss: function() {
            setLoading(false)
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert(`Payment failed: ${response.error.description}`);
        setLoading(false)
      });
      rzp.open();

    } catch (err) {
      console.error(err)
      alert("Failed to initialize payment. Please try again.")
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-0 overflow-hidden border-0 rounded-[32px] bg-[#fdf8f3]">
        {isSuccess ? (
          <div className="p-20 bg-white min-h-[500px] flex items-center justify-center">
            <SuccessState
              title="Booking Confirmed"
              message={`You're all set! Your stay at ${listing.title} has been booked. Check your dashboard for details.`}
              actionLabel="Go to Dashboard"
              actionHref="/dashboard/bookings"
            />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row h-full">
            {/* Left Side: Calendar */}
            <div className="flex-1 p-8 bg-white">
              <DialogHeader className="mb-8">
                <DialogTitle className="text-3xl font-black uppercase tracking-tighter text-[#262626]">
                  Select Dates
                </DialogTitle>
              </DialogHeader>
              <Calendar
                mode="range"
                selected={date as any}
                onSelect={setDate as any}
                className="rounded-md border-0"
                disabled={(d: Date) => d < new Date()}
              />
            </div>

            {/* Right Side: Summary & Payment */}
            <div className="w-full md:w-[350px] bg-[#262626] text-white p-8 flex flex-col justify-between">
              <div className="space-y-8">
                <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Listing</div>
                  <div className="text-xl font-black uppercase tracking-tight">{listing.title}</div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-white/60">Price per day</span>
                    <span>₹{listing.price_per_day}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-white/60">Total days</span>
                    <span>{days}</span>
                  </div>
                  {listing.security_deposit_amount && listing.security_deposit_amount > 0 && (
                    <div className="flex justify-between items-center text-sm font-medium text-[#3B9ECC]">
                      <span className="opacity-60">Security Deposit</span>
                      <span>₹{listing.security_deposit_amount}</span>
                    </div>
                  )}
                  <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                    <span className="text-lg font-black uppercase tracking-tighter">Total Amount</span>
                    <span className="text-2xl font-black text-[#3B9ECC]">₹{total + (listing.security_deposit_amount || 0)}</span>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#3B9ECC]">
                    <ShieldCheck className="w-4 h-4" />
                    Secure Booking
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed">
                    Your payment is protected by BANJARE Secure. Hosts receive payment only after check-in.
                  </p>
                </div>
              </div>

              <Button
                disabled={loading || !date?.from || !date?.to}
                onClick={handleBooking}
                className="w-full bg-[#3B9ECC] text-[#262626] rounded-full py-8 text-[12px] font-black uppercase tracking-[0.2em] hover:opacity-80 transition-super mt-8"
              >
                {loading ? 'Processing...' : (
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Pay & Book Now
                  </span>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
