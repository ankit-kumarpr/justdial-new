
import type { LucideIcon } from 'lucide-react';

export type Review = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin' | 'vendor' | 'superadmin';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  [key: string]: any; 
};

export type Business = {
  _id?: string; 
  id?: string; 
  name?: string; 
  businessName?: string; 
  category?: string;
  description?: string;
  address?: string; 
  businessAddress?: string; 
  phone?: string;
  website?: string;
  rating?: number;
  reviews?: Review[];
  image?: string;
  profileImage?: string;
  gallery?: string[];
  cuisines?: string[];
  city?: string;
  [key: string]: any; 
};

export type Category = {
  id?: string;
  name: string;
  slug: string;
  icon?: LucideIcon; 
  icon_name?: string;
  icon_url?: string; 
};

export type Hotel = {
    id: string;
    name: string;
    rating: number;
    reviews: number;
    trending: boolean;
    verified: boolean;
    location: string;
    tags: string[];
    image: string;
    price?: number;
    discount?: number;
    gallery?: string[];
    amenities?: string[];
}

export type Banner = {
  _id: string;
  title: string;
  link: string;
  image: string;
  startDate: string;
  endDate: string;
  place?: 'top' | 'middle' | 'bottom';
  vendor?: {
    businessName: string;
  }
};

export type OfferBannerPrice = {
  place: 'top' | 'middle' | 'bottom';
  price7Days: number;
  price14Days: number;
  price21Days: number;
  price30Days: number;
};


// Gnetdial specific types
export type JDCategory = {
  _id: string;
  categoryName: string;
  categoryImage: string;
  tag?: string;
};

export type PopularService = {
  _id: string;
  serviceName: string;
  serviceImage: string | null;
  priceType: 'fixed' | 'range' | 'on_request';
  actualPrice: number | null;
  discountPrice: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  unit: string | null;
  vendor: {
    name: string;
  };
  business: {
    city: string;
    state: string;
  };
};

export type TopVendor = {
  _id: string;
  name: string;
  distanceKm: string;
  totalServices: number;
  business?: {
    _id: string;
    businessName: string;
    city: string;
    state: string;
    photos?: string[];
  };
};


export type JDTrendingSearch = {
  name: string;
  options: number;
  image: string;
};

export type JDMovie = {
  title: string;
  language: string;
  rating: number;
  votes: number;
  image: string;
};

export type JDTouristPlace = {
  name: string;
  options: number;
  image: string;
};

export type JDPopularSearch = {
  name: string;
  image: string;
  buttonText: string;
};

export type JDRecentActivity = {
  title: string;
  subtitle: string;
  rating: number;
  review: string;
  author: string;
  image: string;
  logo: string;
};

export type JDRelatedArticle = {
  title: string;
  link: string;
  image: string;
};

export type JDSunnyDayEssential = {
  name: string;
  image: string;
  icon: string;
};

export type JDFooterLink = {
  name: string;
  href: string;
};

// Trends Page Types
export type TrendsChartDataItem = {
  name: string;
  value: number;
  fill: string;
  projected?: boolean;
};

export type TrendsChartData = {
  data: TrendsChartDataItem[];
};

export type TrendsCategoryDataItem = {
  title: string;
  months: string[];
  values: (string | number)[];
};

export type CompetitorAdvertising = {
    logo: string;
    name: string;
    rating: number;
    reviews: number;
    address: string;
    monthlyCharges: number;
    categories: number;
    pincodes: number;
}

export type TrendSuccessStory = {
    image: string;
    name: string;
    location: string;
}

export type MostLikedFeature = {
    image: string;
    title: string;
    description: string;
}

export type BusinessProfileInsight = {
    title: string;
    icon: string;
    you: {
        value: string | number;
        label: string;
    };
    competition: {
        value: string | number;
        label: string;
    }
}

export type Vendor = {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  businessName: string;
  gstNumber?: string;
  plotNo?: string;
  buildingName?: string;
  street?: string;
  landmark?: string;
  area?: string;
  pincode?: string;
  city?: string;
  state?: string;
  address?: string;
  contactPersonTitle?: string;
  contactPerson?: string;
  mobileNumber?: string;
  whatsappNumber?: string;
  workingDays?: string[];
  businessHoursOpen?: string;
  businessHoursClose?: string;
  [key: string]: any;
};

export type VendorAddress = {
  id?: string;
  vendorId: string;
  plotNumber?: string;
  buildingName?: string;
  streetName?: string;
  landmark?: string;
  area?: string;
  city?: string;
  state?: string;
  pincode?: string;
  address?: string;
  address_type?: string;
};

export type VendorContact = {
    id: string;
    vendor_id: string;
    contact_type: 'mobile' | 'whatsapp';
    contact_number: string;
};

export type HolidayTiming = {
  id: string;
  vendor_id: string;
  holiday_date: string;
  description?: string;
  is_closed: boolean;
  time_slots: { open: string; close: string }[];
};

export type KycStatus = "pending" | "approved" | "rejected" | "solved";

export type KycSubmission = {
    _id: string;
    businessName: string;
    contactPerson: string;
    mobileNumber: string;
    whatsappNumber: string;
    email: string;
    userId: string;
    gstNumber?: string;
    plotNo?: string;
    buildingName?: string;
    street?: string;
    landmark?: string;
    area?: string;
    pincode?: string;
    state?: string;
    city?: string;
    businessHoursOpen?: string;
    businessHoursClose?: string;
    workingDays?: string[];
    aadharNumber?: string;
    aadharImage?: string | null;
    videoKyc?: string | null;
    status: KycStatus;
    rejectionReason?: string | null;
    createdAt: string;
    updatedAt: string;
  };

export type GalleryItem = {
    id: string;
    vendor_id: string;
    media_url: string;
    media_type: 'image' | 'video';
    caption?: string;
    created_at: string;
}
