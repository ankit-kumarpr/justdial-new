-- Categories table to store business categories.
CREATE TABLE
  categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    icon_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone ('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone ('utc'::text, NOW()) NOT NULL
  );

-- Seed initial categories
INSERT INTO
  categories (name, slug, icon_name)
VALUES
  ('Restaurants', 'restaurants', 'Utensils'),
  ('Auto Repair', 'auto-repair', 'Wrench'),
  ('Retail', 'retail', 'Store'),
  ('Health', 'health', 'HeartPulse'),
  ('Bookstores', 'bookstores', 'BookOpen'),
  ('Art & Culture', 'art-culture', 'Brush');