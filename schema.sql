-- Create users table
CREATE TABLE if not exists users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'vendor', 'admin', 'superadmin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create vendors table
CREATE TABLE if not exists vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID REFERENCES users(id) ON DELETE CASCADE,
    "businessName" VARCHAR(255) NOT NULL,
    "contactPerson" VARCHAR(255) NOT NULL,
    "mobileNumber" VARCHAR(20) NOT NULL,
    "whatsappNumber" VARCHAR(20),
    email VARCHAR(255) NOT NULL,
    "plotNumber" TEXT,
    "buildingName" TEXT,
    "streetName" TEXT,
    landmark TEXT,
    area TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    address TEXT,
    title TEXT,
    "workingDays" TEXT[],
    "openTime" TEXT,
    "closingTime" TEXT,
    "yearOfEstablishment" VARCHAR(4),
    "yearlyTurnover" TEXT,
    "numberOfEmployees" TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create password_reset_tokens table
CREATE TABLE if not exists password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    token TEXT NOT NULL,
    "expiresAt" TIMESTAMPTZ NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX if not exists idx_users_email ON users(email);
CREATE INDEX if not exists idx_vendors_userId ON vendors("userId");
CREATE INDEX if not exists idx_password_reset_tokens_token ON password_reset_tokens(token);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'set_timestamp_users'
    ) THEN
        CREATE TRIGGER set_timestamp_users
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE PROCEDURE trigger_set_timestamp();
    END IF;
END
$$;

-- Trigger for vendors table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'set_timestamp_vendors'
    ) THEN
        CREATE TRIGGER set_timestamp_vendors
        BEFORE UPDATE ON vendors
        FOR EACH ROW
        EXECUTE PROCEDURE trigger_set_timestamp();
    END IF;
END
$$;

-- Seed Super Admin User (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'superadmin@gnetdial.com') THEN
    -- Generate a secure hash for the default password 'superadminpassword'
    -- Note: In a real environment, this should be handled securely, not hardcoded.
    -- The hash below is for bcrypt with cost 10 for 'superadminpassword'
    INSERT INTO users (id, name, email, phone, password, role)
    VALUES ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Super Admin', 'superadmin@gnetdial.com', '0000000000', '$2a$10$f9y/g.q1V.uT5.N3gG0B9u2B/jP0k.e2O.Yk/jPz.hX.yS/jPz.hW', 'superadmin');
  END IF;
END;
$$;
