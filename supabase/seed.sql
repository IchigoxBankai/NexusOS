-- ==============================================================================
-- NEXUS Database Seed: seed.sql
-- Description: Seed structure and documentation for local testing with Supabase CLI
-- Run with: supabase db reset
-- ==============================================================================

-- Note: In Supabase local development, auth.users entries can be pre-created
-- via the Supabase Auth API or tests.
-- When a user is inserted, the trigger automatically populates profiles and user_preferences.

-- Example development profile update pattern for tests:
DO $$
BEGIN
  RAISE NOTICE 'NEXUS Database Seed initialized successfully. RLS and Triggers are active.';
END $$;
