-- ============================================
-- AfyaLynx Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. AI DIAGNOSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.ai_diagnoses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symptoms TEXT NOT NULL,
  age INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  diagnosis_result JSONB,
  condition_name TEXT,
  confidence_score DECIMAL(5,2),
  severity TEXT CHECK (severity IN ('Mild', 'Moderate', 'Severe', 'Critical')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_ai_diagnoses_user_id ON public.ai_diagnoses(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_diagnoses_created_at ON public.ai_diagnoses(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.ai_diagnoses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_diagnoses
DROP POLICY IF EXISTS "Users can view own diagnoses" ON public.ai_diagnoses;
CREATE POLICY "Users can view own diagnoses" 
  ON public.ai_diagnoses 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own diagnoses" ON public.ai_diagnoses;
CREATE POLICY "Users can create own diagnoses" 
  ON public.ai_diagnoses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own diagnoses" ON public.ai_diagnoses;
CREATE POLICY "Users can update own diagnoses" 
  ON public.ai_diagnoses 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- ============================================
-- 2. CLINICS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.clinics (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT,
  rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  address TEXT,
  phone TEXT,
  email TEXT,
  hours_of_operation TEXT,
  accepted_insurance TEXT[],
  services TEXT[],
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  website TEXT,
  image_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create spatial index for location-based queries
CREATE INDEX IF NOT EXISTS idx_clinics_location ON public.clinics(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_clinics_specialty ON public.clinics(specialty);

-- Enable Row Level Security for clinics
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for clinics
DROP POLICY IF EXISTS "Anyone can view clinics" ON public.clinics;
CREATE POLICY "Anyone can view clinics" 
  ON public.clinics 
  FOR SELECT 
  TO public 
  USING (true);

-- Only authenticated users can manage clinics (admin check can be added later)
DROP POLICY IF EXISTS "Authenticated users can manage clinics" ON public.clinics;
CREATE POLICY "Authenticated users can manage clinics" 
  ON public.clinics 
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 3. UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to ai_diagnoses
DROP TRIGGER IF EXISTS update_ai_diagnoses_updated_at ON public.ai_diagnoses;
CREATE TRIGGER update_ai_diagnoses_updated_at
  BEFORE UPDATE ON public.ai_diagnoses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Apply trigger to clinics
DROP TRIGGER IF EXISTS update_clinics_updated_at ON public.clinics;
CREATE TRIGGER update_clinics_updated_at
  BEFORE UPDATE ON public.clinics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 4. HELPER FUNCTION: Get nearby clinics
-- ============================================
CREATE OR REPLACE FUNCTION public.get_nearby_clinics(
  user_lat DECIMAL,
  user_lng DECIMAL,
  max_distance_km DECIMAL DEFAULT 10
)
RETURNS TABLE (
  id INTEGER,
  name TEXT,
  specialty TEXT,
  rating DECIMAL,
  address TEXT,
  phone TEXT,
  distance_km DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.specialty,
    c.rating,
    c.address,
    c.phone,
    ROUND(
      (6371 * acos(
        cos(radians(user_lat)) * 
        cos(radians(c.latitude)) * 
        cos(radians(c.longitude) - radians(user_lng)) + 
        sin(radians(user_lat)) * 
        sin(radians(c.latitude))
      ))::NUMERIC,
      2
    ) AS distance_km
  FROM public.clinics c
  WHERE c.latitude IS NOT NULL 
    AND c.longitude IS NOT NULL
  HAVING ROUND(
      (6371 * acos(
        cos(radians(user_lat)) * 
        cos(radians(c.latitude)) * 
        cos(radians(c.longitude) - radians(user_lng)) + 
        sin(radians(user_lat)) * 
        sin(radians(c.latitude))
      ))::NUMERIC,
      2
    ) <= max_distance_km
  ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify the schema was created correctly:

-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('ai_diagnoses', 'clinics', 'appointments', 'medications', 'health_records');

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('ai_diagnoses', 'clinics', 'appointments', 'medications', 'health_records');

-- Check policies exist
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('ai_diagnoses', 'clinics', 'appointments', 'medications', 'health_records');

-- ============================================
-- 5. APPOINTMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  clinic_id INTEGER REFERENCES public.clinics(id) ON DELETE SET NULL,
  doctor_name TEXT NOT NULL,
  clinic_name TEXT NOT NULL,
  specialty TEXT,
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  appointment_type TEXT DEFAULT 'Consultation',
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for appointments
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);

-- Enable Row Level Security
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for appointments
DROP POLICY IF EXISTS "Users can view own appointments" ON public.appointments;
CREATE POLICY "Users can view own appointments" 
  ON public.appointments 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own appointments" ON public.appointments;
CREATE POLICY "Users can create own appointments" 
  ON public.appointments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own appointments" ON public.appointments;
CREATE POLICY "Users can update own appointments" 
  ON public.appointments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own appointments" ON public.appointments;
CREATE POLICY "Users can delete own appointments" 
  ON public.appointments 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Apply trigger to appointments
DROP TRIGGER IF EXISTS update_appointments_updated_at ON public.appointments;
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 6. MEDICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  remaining INTEGER DEFAULT 0,
  next_refill DATE,
  notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for medications
CREATE INDEX IF NOT EXISTS idx_medications_user_id ON public.medications(user_id);
CREATE INDEX IF NOT EXISTS idx_medications_status ON public.medications(status);

-- Enable Row Level Security
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for medications
DROP POLICY IF EXISTS "Users can view own medications" ON public.medications;
CREATE POLICY "Users can view own medications" 
  ON public.medications 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own medications" ON public.medications;
CREATE POLICY "Users can create own medications" 
  ON public.medications 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own medications" ON public.medications;
CREATE POLICY "Users can update own medications" 
  ON public.medications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own medications" ON public.medications;
CREATE POLICY "Users can delete own medications" 
  ON public.medications 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Apply trigger to medications
DROP TRIGGER IF EXISTS update_medications_updated_at ON public.medications;
CREATE TRIGGER update_medications_updated_at
  BEFORE UPDATE ON public.medications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 7. HEALTH RECORDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  heart_rate INTEGER,
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  weight DECIMAL(5,2),
  temperature DECIMAL(4,2),
  blood_sugar DECIMAL(5,2),
  notes TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for health_records
CREATE INDEX IF NOT EXISTS idx_health_records_user_id ON public.health_records(user_id);
CREATE INDEX IF NOT EXISTS idx_health_records_recorded_at ON public.health_records(recorded_at DESC);

-- Enable Row Level Security
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for health_records
DROP POLICY IF EXISTS "Users can view own health records" ON public.health_records;
CREATE POLICY "Users can view own health records" 
  ON public.health_records 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own health records" ON public.health_records;
CREATE POLICY "Users can create own health records" 
  ON public.health_records 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own health records" ON public.health_records;
CREATE POLICY "Users can update own health records" 
  ON public.health_records 
  FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own health records" ON public.health_records;
CREATE POLICY "Users can delete own health records" 
  ON public.health_records 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert sample clinics
INSERT INTO public.clinics (name, specialty, rating, address, phone, latitude, longitude, services) VALUES
  ('City General Hospital', 'General Medicine', 4.5, '123 Main St, Nairobi', '+254-700-123456', -1.2921, 36.8219, ARRAY['Emergency', 'Outpatient', 'Laboratory']),
  ('Heart Care Clinic', 'Cardiology', 4.8, '456 Healthcare Ave, Nairobi', '+254-700-234567', -1.2864, 36.8172, ARRAY['Cardiology', 'ECG', 'Consultation']),
  ('MomCare Maternity', 'Obstetrics', 4.7, '789 Wellness Rd, Nairobi', '+254-700-345678', -1.3000, 36.8300, ARRAY['Maternity', 'Prenatal Care', 'Delivery'])
ON CONFLICT DO NOTHING;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
DO $$
BEGIN
  RAISE NOTICE 'AfyaLynx database schema created successfully!';
  RAISE NOTICE 'Tables: ai_diagnoses, clinics, appointments, medications, health_records';
  RAISE NOTICE 'RLS enabled with appropriate policies';
  RAISE NOTICE 'Sample data inserted (3 clinics)';
END $$;
