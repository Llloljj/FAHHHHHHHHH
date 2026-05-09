-- supabase/migrations/00003_itinerary.sql

CREATE TABLE itinerary_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  activity_date TIMESTAMP WITH TIME ZONE NOT NULL,
  type TEXT DEFAULT 'event', -- 'event', 'meal', 'transport', 'other'
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE itinerary_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Trip members can view activities" ON itinerary_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM trip_members 
      WHERE trip_members.trip_id = itinerary_activities.trip_id 
      AND trip_members.user_id = auth.uid()
    )
  );
CREATE POLICY "Trip members can manage activities" ON itinerary_activities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM trip_members 
      WHERE trip_members.trip_id = itinerary_activities.trip_id 
      AND trip_members.user_id = auth.uid()
    )
  );
