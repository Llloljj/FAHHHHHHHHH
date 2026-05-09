-- supabase/migrations/00001_marketplace_ledger.sql

-- 1. Expense Ledger Tables
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  payer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE expense_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID REFERENCES expenses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  is_paid BOOLEAN DEFAULT FALSE,
  paid_at TIMESTAMP WITH TIME ZONE
);

-- 2. Marketplace Tables
CREATE TABLE host_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT,
  bio TEXT,
  kyc_status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'home', 'vehicle', 'guide'
  title TEXT NOT NULL,
  description TEXT,
  price_per_day NUMERIC(10, 2) NOT NULL,
  security_deposit_amount NUMERIC(10, 2) DEFAULT 0,
  location TEXT,
  images TEXT[] DEFAULT '{}',
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies

-- Expenses
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Trip members can view expenses" ON expenses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM trip_members 
      WHERE trip_members.trip_id = expenses.trip_id 
      AND trip_members.user_id = auth.uid()
    )
  );
CREATE POLICY "Trip members can insert expenses" ON expenses
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM trip_members 
      WHERE trip_members.trip_id = expenses.trip_id 
      AND trip_members.user_id = auth.uid()
    )
  );

-- Expense Splits
ALTER TABLE expense_splits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their splits" ON expense_splits
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM expenses
      JOIN trip_members ON trip_members.trip_id = expenses.trip_id
      WHERE expenses.id = expense_splits.expense_id
      AND trip_members.user_id = auth.uid()
    )
  );

-- Host Profiles
ALTER TABLE host_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all host profiles" ON host_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update their own profile" ON host_profiles FOR ALL USING (auth.uid() = user_id);

CREATE TABLE settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  from_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  to_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settlements
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Trip members can view settlements" ON settlements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM trip_members 
      WHERE trip_members.trip_id = settlements.trip_id 
      AND trip_members.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can manage their own settlements" ON settlements
  FOR ALL USING (auth.uid() = from_id OR auth.uid() = to_id);
