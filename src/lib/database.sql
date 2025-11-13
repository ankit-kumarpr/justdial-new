-- =================================================================
-- SERVICE CATEGORIES TABLE
-- Stores categories for services offered by vendors.
-- =================================================================

-- 1. Create the table if it doesn't exist.
CREATE TABLE IF NOT EXISTS public.service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
-- This is a crucial security measure in Supabase.
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies to ensure the script can be re-run safely.
DROP POLICY IF EXISTS "Allow public read access on service_categories" ON public.service_categories;
DROP POLICY IF EXISTS "Allow super admins all access on service_categories" ON public.service_categories;

-- 4. Create Policies for service_categories
--    Policy 1: Allow all users (including anonymous) to read service categories.
CREATE POLICY "Allow public read access on service_categories"
ON public.service_categories FOR SELECT
USING (true);

--    Policy 2: Allow users with the 'superadmin' role to perform any action.
--    This policy checks the 'role' field in your custom 'users' table.
CREATE POLICY "Allow super admins all access on service_categories"
ON public.service_categories FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE public.users.id = auth.uid() AND public.users.role = 'superadmin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users
    WHERE public.users.id = auth.uid() AND public.users.role = 'superadmin'
  )
);
