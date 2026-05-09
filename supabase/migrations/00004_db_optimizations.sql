-- supabase/migrations/00004_db_optimizations.sql

-- 1. Performance: Add Indexes for frequently queried foreign keys
CREATE INDEX IF NOT EXISTS idx_trip_members_user_id ON trip_members(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_members_trip_id ON trip_members(trip_id);
CREATE INDEX IF NOT EXISTS idx_expenses_trip_id ON expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_expense_splits_expense_id ON expense_splits(expense_id);
CREATE INDEX IF NOT EXISTS idx_listings_host_id ON listings(host_id);
CREATE INDEX IF NOT EXISTS idx_bookings_trip_id ON bookings(trip_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_activities_trip_id ON itinerary_activities(trip_id);

-- 2. Data Integrity: Add Constraints
-- Ensure end_date is after start_date
ALTER TABLE trips ADD CONSTRAINT check_trip_dates CHECK (end_date >= start_date);

-- Ensure amounts are always positive
ALTER TABLE expenses ADD CONSTRAINT check_expense_amount CHECK (amount > 0);
ALTER TABLE listings ADD CONSTRAINT check_listing_price CHECK (price_per_day >= 0);
ALTER TABLE settlements ADD CONSTRAINT check_settlement_amount CHECK (amount > 0);

-- 3. Automation: Auto-calculate Trip Total Budget
-- This function sums up all expenses for a trip and updates the trips table.
CREATE OR REPLACE FUNCTION update_trip_total_budget()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    UPDATE trips 
    SET total_budget = (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE trip_id = OLD.trip_id)
    WHERE id = OLD.trip_id;
  ELSE
    UPDATE trips 
    SET total_budget = (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE trip_id = NEW.trip_id)
    WHERE id = NEW.trip_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to run the function after any expense change
DROP TRIGGER IF EXISTS trg_update_trip_total ON expenses;
CREATE TRIGGER trg_update_trip_total
AFTER INSERT OR UPDATE OR DELETE ON expenses
FOR EACH ROW EXECUTE FUNCTION update_trip_total_budget();

-- 4. Utility: Last Updated Timestamps
-- Add a function to auto-update the 'updated_at' column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add 'updated_at' to trips and setup trigger
ALTER TABLE trips ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
DROP TRIGGER IF EXISTS trg_update_trips_updated_at ON trips;
CREATE TRIGGER trg_update_trips_updated_at
BEFORE UPDATE ON trips
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
