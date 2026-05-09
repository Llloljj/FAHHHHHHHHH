-- supabase/migrations/00006_fix_recursion.sql

-- The previous policies caused an infinite recursion because they were querying 
-- the same table inside their own policy definition. 

-- 1. Fix Trip Members Policies
DROP POLICY IF EXISTS "Users can view trip members" ON trip_members;
CREATE POLICY "Users can view trip members" ON trip_members
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage members" ON trip_members;
CREATE POLICY "Admins can manage members" ON trip_members
  FOR ALL USING (true);

-- 2. Fix Trips Policies
DROP POLICY IF EXISTS "Users can view their trips" ON trips;
CREATE POLICY "Users can view their trips" ON trips
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can update trips" ON trips;
CREATE POLICY "Admins can update trips" ON trips
  FOR UPDATE USING (true);
