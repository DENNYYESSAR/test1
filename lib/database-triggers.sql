-- =====================================================
-- Supabase Auth to Users Table Sync Trigger (OPTIONAL)
-- =====================================================
-- This trigger automatically creates a user profile in the public.users table
-- whenever a new user signs up via Supabase Auth
-- 
-- Run this in your Supabase SQL Editor if you want to keep the users table in sync
-- =====================================================

-- Enable the pgcrypto extension if not already enabled (for gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create the users table if it doesn't exist (adjust columns as needed)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supabase_user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  date_of_birth DATE,
  gender TEXT,
  phone TEXT,
  blood_type TEXT,
  password_hash TEXT, -- Not needed if using only Supabase Auth
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own profile
CREATE POLICY "Users can view own profile" 
  ON public.users 
  FOR SELECT 
  USING (auth.uid() = supabase_user_id);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update own profile" 
  ON public.users 
  FOR UPDATE 
  USING (auth.uid() = supabase_user_id);

-- Create function to sync new users from auth.users to public.users
-- Only creates profile AFTER email is confirmed
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only insert if email is confirmed (NEW.email_confirmed_at is not null)
  -- OR if email confirmation is disabled (NEW.confirmation_sent_at is null)
  IF NEW.email_confirmed_at IS NOT NULL OR NEW.confirmation_sent_at IS NULL THEN
    INSERT INTO public.users (
      supabase_user_id,
      email,
      first_name,
      last_name,
      date_of_birth,
      gender,
      phone
    )
    VALUES (
      NEW.id,
      NEW.email,
      NEW.raw_user_meta_data->>'firstName',
      NEW.raw_user_meta_data->>'lastName',
      (NEW.raw_user_meta_data->>'dateOfBirth')::DATE,
      NEW.raw_user_meta_data->>'gender',
      NEW.raw_user_meta_data->>'phone'
    )
    ON CONFLICT (supabase_user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function after user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also trigger on UPDATE for when email gets confirmed
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to handle user profile updates
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET
    email = NEW.email,
    first_name = NEW.raw_user_meta_data->>'firstName',
    last_name = NEW.raw_user_meta_data->>'lastName',
    date_of_birth = (NEW.raw_user_meta_data->>'dateOfBirth')::DATE,
    gender = NEW.raw_user_meta_data->>'gender',
    phone = NEW.raw_user_meta_data->>'phone',
    updated_at = NOW()
  WHERE supabase_user_id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user updates
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW 
  WHEN (OLD.* IS DISTINCT FROM NEW.*)
  EXECUTE FUNCTION public.handle_user_update();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.users TO postgres, service_role;
GRANT SELECT, UPDATE ON public.users TO authenticated;
