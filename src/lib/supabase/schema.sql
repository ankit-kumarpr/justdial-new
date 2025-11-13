-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password TEXT NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vendors table
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID REFERENCES users(id) ON DELETE CASCADE,
    "businessName" TEXT NOT NULL,
    "workingDays" TEXT[],
    "openTime" TIME,
    "closingTime" TIME,
    "yearOfEstablishment" VARCHAR(4),
    "yearlyTurnover" TEXT,
    "numberOfEmployees" TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vendor_addresses table
CREATE TABLE vendor_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "vendorId" UUID REFERENCES vendors(id) ON DELETE CASCADE,
    "plotNumber" TEXT,
    "buildingName" TEXT,
    "streetName" TEXT,
    landmark TEXT,
    area TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    address TEXT, -- To store the full concatenated address
    address_type TEXT DEFAULT 'primary', -- e.g., 'primary', 'branch'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vendor_contacts table
CREATE TABLE vendor_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "vendorId" UUID REFERENCES vendors(id) ON DELETE CASCADE,
    "contactPerson" TEXT,
    "title" TEXT,
    "mobileNumber" TEXT,
    "isPrimaryMobile" BOOLEAN DEFAULT false,
    "whatsappNumber" TEXT,
    "isPrimaryWhatsapp" BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create password_reset_tokens table
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    token TEXT NOT NULL,
    "expiresAt" TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
