-- supabase/migrations/00005_make_creator_optional.sql

-- Make creator_id nullable so we can create trips without a session
ALTER TABLE trips ALTER COLUMN creator_id DROP NOT NULL;

-- Also update trip_members to allow null user_id if needed (for guests)
ALTER TABLE trip_members ALTER COLUMN user_id DROP NOT NULL;

-- Disable the create trip policy check temporarily or update it
DROP POLICY IF EXISTS "Users can create trips" ON trips;
CREATE POLICY "Anyone can create trips" ON trips
  FOR INSERT WITH CHECK (true);
