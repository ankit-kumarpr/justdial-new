-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Vendors Table
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "businessName" TEXT NOT NULL,
    pincode TEXT NOT NULL,
    "plotNumber" TEXT,
    "buildingName" TEXT,
    "streetName" TEXT,
    landmark TEXT,
    area TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    title TEXT,
    "contactPerson" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "whatsappNumber" TEXT,
    email TEXT NOT NULL,
    "workingDays" TEXT[],
    "businessOpenHours" TEXT,
    "userId" TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RLS Policies for Users Table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow public access to read users table
CREATE POLICY "Allow public read access to users" ON users
FOR SELECT USING (true);

-- Allow users to insert their own profile
CREATE POLICY "Allow authenticated user to insert their own profile" ON users
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update their own profile
CREATE POLICY "Allow authenticated user to update their own profile" ON users
FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- RLS Policies for Vendors Table
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Allow public access to read vendors table
CREATE POLICY "Allow public read access to vendors" ON vendors
FOR SELECT USING (true);

-- Allow authenticated users to insert vendors
CREATE POLICY "Allow authenticated users to insert vendors" ON vendors
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update their own vendor listings
CREATE POLICY "Allow user to update their own vendor listing" ON vendors
FOR UPDATE USING (auth.uid() = "userId"::uuid);

-- Function to handle new user registration and create a public user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, password)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name', new.role, new.encrypted_password);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user on new auth.users signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Grant usage on schema public to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant select on users table to anon and authenticated roles
GRANT SELECT ON TABLE users TO anon, authenticated;

-- Grant insert, update, delete on users table to authenticated role
GRANT INSERT, UPDATE, DELETE ON TABLE users TO authenticated;

-- Grant select on vendors table to anon and authenticated roles
GRANT SELECT ON TABLE vendors TO anon, authenticated;

-- Grant insert, update, delete on vendors table to authenticated role
GRANT INSERT, UPDATE, DELETE ON TABLE vendors TO authenticated;

-- Grant all privileges on all tables in schema public to the postgres role
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO postgres;
