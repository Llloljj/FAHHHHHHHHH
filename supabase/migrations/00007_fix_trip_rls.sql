-- supabase/migrations/00007_fix_trip_rls.sql

-- Allow creators to see their own trips even if they aren't members yet.
-- This fixes the catch-22 when using .insert().select().single() in server actions.
DROP POLICY IF EXISTS "Creators can view their own trips" ON trips;
CREATE POLICY "Creators can view their own trips" ON trips
  FOR SELECT
  USING (auth.uid() = creator_id);

-- Ensure anyone can create a trip (migration 00005 already does this, but being safe)
DROP POLICY IF EXISTS "Anyone can create trips" ON trips;
CREATE POLICY "Anyone can create trips" ON trips
  FOR INSERT
  WITH CHECK (true);
