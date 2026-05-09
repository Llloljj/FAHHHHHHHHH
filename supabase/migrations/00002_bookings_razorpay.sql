-- supabase/migrations/00002_bookings_razorpay.sql

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'completed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE security_deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  razorpay_payment_id TEXT,
  status TEXT DEFAULT 'held', -- 'held', 'refunded', 'claimed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies

-- Bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own bookings" ON bookings
  FOR SELECT USING (auth.uid() = guest_id OR EXISTS (
    SELECT 1 FROM listings WHERE listings.id = bookings.listing_id AND listings.host_id = auth.uid()
  ));
CREATE POLICY "Users can create bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = guest_id);
CREATE POLICY "Hosts can update booking status" ON bookings
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM listings WHERE listings.id = bookings.listing_id AND listings.host_id = auth.uid()
  ));

-- Security Deposits
ALTER TABLE security_deposits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own deposits" ON security_deposits
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM bookings WHERE bookings.id = security_deposits.booking_id AND bookings.guest_id = auth.uid()
  ));
