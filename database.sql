-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the service_categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.service_categories (
    id uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    icon_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to ensure idempotency
DROP POLICY IF EXISTS "Allow superadmin full access to service categories" ON public.service_categories;
DROP POLICY IF EXISTS "Allow public read access to service categories" ON public.service_categories;

-- Create policies for service_categories
CREATE POLICY "Allow superadmin full access to service categories"
ON public.service_categories
FOR ALL
TO authenticated
USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'superadmin'
)
WITH CHECK (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'superadmin'
);

CREATE POLICY "Allow public read access to service categories"
ON public.service_categories
FOR SELECT
TO anon, authenticated
USING (true);
