-- Create service_applications table
CREATE TABLE IF NOT EXISTS service_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  full_name TEXT NOT NULL,
  id_proof_type TEXT NOT NULL, -- 'aadhaar' or 'pan'
  id_proof_number TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  details JSONB DEFAULT '{}'::jsonb, -- Stores type-specific fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE service_applications ENABLE ROW LEVEL SECURITY;

-- Policies
-- Users can view their own applications
CREATE POLICY "Users can view their own applications" 
  ON service_applications 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can insert their own applications
CREATE POLICY "Users can insert their own applications" 
  ON service_applications 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
