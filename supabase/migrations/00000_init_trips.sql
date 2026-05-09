-- supabase/migrations/00000_init_trips.sql

CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget_per_person NUMERIC(10, 2) NOT NULL,
  total_budget NUMERIC(10, 2) NOT NULL,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE trip_member_role AS ENUM ('admin', 'member');

CREATE TABLE trip_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role trip_member_role DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(trip_id, user_id)
);

-- Enable RLS
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_members ENABLE ROW LEVEL SECURITY;

-- Trip Policies
CREATE POLICY "Users can view their trips" ON trips
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = trips.id
      AND trip_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create trips" ON trips
  FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Admins can update trips" ON trips
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM trip_members
      WHERE trip_members.trip_id = trips.id
      AND trip_members.user_id = auth.uid()
      AND trip_members.role = 'admin'
    )
  );

-- Trip Members Policies
CREATE POLICY "Users can view trip members" ON trip_members
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trip_members tm
      WHERE tm.trip_id = trip_members.trip_id
      AND tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join trips" ON trip_members
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage members" ON trip_members
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM trip_members tm
      WHERE tm.trip_id = trip_members.trip_id
      AND tm.user_id = auth.uid()
      AND tm.role = 'admin'
    )
  );
