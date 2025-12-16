-- =====================================================
-- DISABLE DATABASE TRIGGER (RECOMMENDED)
-- =====================================================
-- Since you're using pure Supabase Auth with user_metadata,
-- you don't need the users table for authentication.
-- This will fix the "Database error saving new user" issue.
-- =====================================================

-- Drop the triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

-- Drop the functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_user_update();

-- OPTIONAL: If you don't need the users table at all, you can drop it
-- (Only do this if you're sure you don't need it for other features)
-- DROP TABLE IF EXISTS public.users CASCADE;

-- =====================================================
-- SUCCESS! Your signup should work now without triggers
-- =====================================================
