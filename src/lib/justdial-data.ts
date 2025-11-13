


import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { JDCategory, JDTrendingSearch, JDMovie, JDTouristPlace, JDPopularSearch, JDRecentActivity, JDRelatedArticle, JDSunnyDayEssential, JDFooterLink, TrendsChartData, TrendsCategoryDataItem, CompetitorAdvertising, TrendSuccessStory, MostLikedFeature, BusinessProfileInsight } from '@/lib/types';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || null;

export const jdCarouselItems = [
  { title: 'Top Restaurants Near You', description: 'Discover amazing dining experiences', image: findImage('restaurant-1')! },
  { title: 'Luxury Hotels & Stays', description: 'Book your perfect getaway', image: findImage('hotel-2')! },
  { title: 'Premium Beauty Services', description: 'Pamper yourself with the best', image: findImage('jd-trending-3')! },
  { title: 'Home Makeover Experts', description: 'Transform your living space', image: findImage('jd-trending-1')! },
];


export const jdCategories: JDCategory[] = [
  { name: 'Restaurants', icon: findImage('jd-cat-restaurant-img')! },
  { name: 'Hotels', icon: findImage('jd-cat-hotel-img')! },
  { name: 'Beauty Spa', icon: findImage('jd-cat-spa-img')! },
  { name: 'Home Decor', icon: findImage('jd-cat-decor-img')! },
  { name: 'Wedding Planning', icon: findImage('jd-cat-wedding-img')!, tag: 'WEDDING' },
  { name: 'Education', icon: findImage('jd-cat-education-img')! },
  { name: 'Rent & Hire', icon: findImage('jd-cat-rent-img')! },
  { name: 'Hospitals', icon: findImage('jd-cat-hospital-img')! },
  { name: 'Contractors', icon: findImage('jd-cat-contractor-img')! },
  { name: 'Pet Shops', icon: findImage('jd-cat-pet-img')! },
  { name: 'PG/Hostels', icon: findImage('jd-cat-hostel-img')! },
  { name: 'Estate Agent', icon: findImage('jd-cat-estate-img')! },
  { name: 'Dentists', icon: findImage('jd-cat-dentist-img')! },
  { name: 'Gym', icon: findImage('jd-cat-gym-img')! },
  { name: 'Loans', icon: findImage('jd-cat-loan-img')! },
  { name: 'Event Organisers', icon: findImage('jd-cat-event-img')! },
  { name: 'Driving Schools', icon: findImage('jd-cat-driving-img')! },
  { name: 'Packers & Movers', icon: findImage('jd-cat-packers-img')! },
  { name: 'Courier Service', icon: findImage('jd-cat-courier-img')! },
  { name: 'Popular Categories', icon: findImage('jd-cat-popular-img')! }
];

export const jdServices = [
  { name: 'Mobile', icon: '📱' },
  { name: 'Electricity', icon: '💡' },
  { name: 'DTH', icon: '📡' },
  { name: 'Water', icon: '💧' },
  { name: 'Gas', icon: '🔥' },
  { name: 'Insurance', icon: '🛡️' },
];

export const jdTravelBookings = [
  { name: 'Flight\
Powered By Easemytrip.com', icon: '✈️' },
  { name: 'Bus\
Affordable Rides', icon: '🚌' },
  { name: 'Train', icon: '🚆' },
  { name: 'Hotel\
Budget-friendly Stay', icon: '🏨' },
  { name: 'Car Rentals\
Drive Easy Anywhere', icon: '🚗' },
];

export const jdTrendingSearches: JDTrendingSearch[] = [
  { name: 'Interior Designers For Office', options: 250, image: findImage('jd-trending-1')! },
  { name: 'Interior Designers For Showrooms', options: 180, image: findImage('jd-trending-2')! },
  { name: 'Bike On Rent', options: 95, image: findImage('jd-trending-3')! },
  { name: 'Croma', options: 45, image: findImage('jd-trending-4')! },
  { name: 'Residential Cleaning Services', options: 320, image: findImage('jd-trending-5')! },
  { name: 'Wall Paper Dealers', options: 150, image: findImage('jd-trending-6')! },
  { name: 'Fire Cracker Dealers', options: 85, image: findImage('jd-trending-7')! },
  { name: 'Fire Cracker Wholesalers', options: 65, image: findImage('jd-trending-8')! },
  { name: 'Eye Clinics', options: 275, image: findImage('jd-trending-9')! },
  { name: 'Tempos On Hire', options: 120, image: findImage('jd-trending-10')! },
];

export const jdLatestMovies: JDMovie[] = [
  { title: 'Kantara A Legend Chapter 1', language: 'Hindi', rating: 3.0, votes: 1500, image: findImage('jd-movie-1')! },
  { title: 'Sunny Sanskari Ki Tulsi Kumari', language: 'Hindi', rating: 2.0, votes: 980, image: findImage('jd-movie-2')! },
  { title: 'Jolly LLB 3', language: 'Hindi', rating: 4.2, votes: 2800, image: findImage('jd-movie-3')! },
  { title: 'Dashavatar (2025 Film)', language: 'Marathi', rating: 3.8, votes: 1200, image: findImage('jd-movie-4')! },
  { title: 'Shin chan The Spicy Kasukabe Dancers', language: 'Hindi', rating: 5.0, votes: 850, image: findImage('jd-movie-5')! },
  { title: 'Homebound', language: 'Hindi', rating: 1.0, votes: 650, image: findImage('jd-movie-6')! },
  { title: 'Idli Kadai', language: 'Tamil', rating: 4.0, votes: 1100, image: findImage('jd-movie-7')! },
  { title: 'Vada Paav', language: 'Marathi', rating: 0, votes: 0, image: findImage('jd-movie-8')! },
];

export const jdTopTouristPlaces: JDTouristPlace[] = [
  { name: 'Mumbai', options: 120, image: findImage('jd-tourist-1')! },
  { name: 'Pune', options: 95, image: findImage('jd-tourist-2')! },
  { name: 'Nashik', options: 75, image: findImage('jd-tourist-3')! },
  { name: 'Ahmedabad', options: 110, image: findImage('jd-tourist-4')! },
  { name: 'Goa', options: 200, image: findImage('jd-tourist-5')! },
  { name: 'Gokarna', options: 85, image: findImage('jd-tourist-6')! },
  { name: 'Ujjain', options: 90, image: findImage('jd-tourist-7')! },
  { name: 'Hampi', options: 145, image: findImage('jd-tourist-8')! },
];

export const jdPopularSearches: JDPopularSearch[] = [
    { name: 'Estate Agents For Residential Rental', image: findImage('jd-popular-1')!, buttonText: 'Enquire Now' },
    { name: 'Estate Agents For Residence', image: findImage('jd-popular-2')!, buttonText: 'Enquire Now' },
    { name: 'Interior Designers', image: findImage('jd-popular-3')!, buttonText: 'Enquire Now' },
    { name: 'Real Estate Agents', image: findImage('jd-popular-4')!, buttonText: 'Enquire Now' },
    { name: 'Banquet Halls', image: findImage('jd-popular-5')!, buttonText: 'Enquire Now' },
    { name: 'Caterers', image: findImage('jd-popular-6')!, buttonText: 'Enquire Now' },
    { name: 'Pathology Labs', image: findImage('jd-popular-7')!, buttonText: 'Explore' },
    { name: 'Dentists', image: findImage('jd-popular-8')!, buttonText: 'Explore' },
    { name: 'Gynaecologist & Obstetrician Doctors', image: findImage('jd-popular-9')!, buttonText: 'Explore' },
    { name: 'Physiotherapists', image: findImage('jd-popular-10')!, buttonText: 'Explore' },
];

export const jdRecentActivity: JDRecentActivity[] = [
    { title: 'Hotel Taj Mahal Palace', subtitle: '5 Star Hotels', rating: 4.8, review: 'Exceptional service and breathtaking views. A truly luxurious experience from start to finish. Highly recommended for a memorable stay in the city.', author: 'Rohan Sharma', image: findImage('jd-recent-1')!, logo: '🏨' },
    { title: 'Airtel Customer Care', subtitle: 'DTH', rating: 4.2, review: 'Quick resolution to my query. The customer service representative was patient and helpful, guiding me through the troubleshooting steps effectively.', author: 'Priya Patel', image: findImage('jd-recent-2')!, logo: '📡' },
    { title: 'HDFC Bank Home Loan', subtitle: 'Loans', rating: 4.5, review: 'The loan process was smooth and transparent. The bank staff were professional and kept me informed at every stage. Got approval faster than expected.', author: 'Amit Singh', image: findImage('jd-recent-3')!, logo: '💰' },
    { title: 'Lottery Ticket', subtitle: 'Online Lottery', rating: 4.0, review: 'Fun and easy to use platform. Won a small amount on my first try! The withdrawal process was straightforward. Will play again for sure.', author: 'Sneha Verma', image: findImage('jd-recent-4')!, logo: '🎟️' },
    { title: 'ICICI Credit Card', subtitle: 'Credit Card', rating: 4.6, review: 'Great rewards and benefits. The application was simple, and I received the card within a week. The online portal is very user-friendly.', author: 'Vikram Mehta', image: findImage('jd-recent-5')!, logo: '💳' },
    { title: 'Paytm Money Transfer', subtitle: 'Money Transfer', rating: 4.7, review: 'Instant and reliable transfers. I use it regularly to send money to my family. Never had an issue, and the transaction fees are reasonable.', author: 'Anita Desai', image: findImage('jd-recent-6')!, logo: '💸' },
];

export const jdRelatedArticles: JDRelatedArticle[] = [
  { title: 'Beautiful Photo Achievement: Take a Walk Through the Green Nature', link: '#', image: findImage('jd-article-1')! },
  { title: '7 Jewellery Items To Elevate Your Style For The Festive...', link: '#', image: findImage('jd-article-2')! },
  { title: 'Diwali Celebration At Ayodhya: Grand Celebrations To Make The Festive Story...', link: '#', image: findImage('jd-article-3')! },
];

export const jdSunnyDayEssentials: JDSunnyDayEssential[] = [
  { name: 'Dermatologists', image: findImage('sunny-dermatologists')!, icon: '👨‍⚕️' },
  { name: 'Water Suppliers', image: findImage('sunny-water-suppliers')!, icon: '💧' },
  { name: 'Doctors For Allergy', image: findImage('sunny-allergy-doctors')!, icon: '🤧' },
  { name: 'Fan Dealers', image: findImage('sunny-fan-dealers')!, icon: '🌀' },
  { name: 'Juice Centres', image: findImage('sunny-juice-centres')!, icon: '🧃' },
  { name: 'Mineral Water Suppliers', image: findImage('sunny-mineral-water')!, icon: '💦' },
  { name: 'Deep Freezer Dealers', image: findImage('sunny-deep-freezer')!, icon: '❄️' },
  { name: 'Gardening Services', image: findImage('sunny-gardening')!, icon: '🌱' },
  { name: 'Women Gastroenterologists', image: findImage('sunny-gastroenterologists')!, icon: '👩‍⚕️' },
  { name: 'Energy Drink Retailers', image: findImage('sunny-energy-drinks')!, icon: '⚡' },
  { name: 'Shorts Retailers', image: findImage('sunny-shorts')!, icon: '👕' },
];

export const jdFooterLinks: {
  popularCategories: string[];
  quickLinks: JDFooterLink[];
  topCities: string[];
} = {
  popularCategories: ['Body Massage Centres', 'Cinema Halls', 'Schools', 'Hospitals', 'Beauty Spas', 'Dermatologists'],
  quickLinks: [
    { name: 'Advertise', href: '/advertise' },
    { name: 'Register your Business', href: '#' },
    { name: 'Feedback', href: '#' }
  ],
  topCities: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune'],
};


// Trends Page Data
export const trendsChartData: { searches: TrendsChartData, calls: TrendsChartData } = {
  searches: {
    data: [
      { name: 'Jul 2025', value: 28, fill: '#FFC8A2' },
      { name: 'Aug 2025', value: 17, fill: '#A2E5D4' },
      { name: 'Sep 2025', value: 9, fill: '#D7BDE2' },
      { name: 'Oct 2025', value: 21, fill: '#F9E79F', projected: true },
    ]
  },
  calls: {
    data: [
      { name: 'Jul 2025', value: 7, fill: '' },
      { name: 'Aug 2025', value: 12, fill: '' },
      { name: 'Sep 2025', value: 5, fill: '' },
      { name: 'Oct 2025', value: 9, fill: '', projected: true },
    ]
  }
};

export const trendsCategoryData: { searches: TrendsCategoryDataItem, calls: TrendsCategoryDataItem } = {
  searches: {
    title: "Search - Category Wise",
    months: ['Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025'],
    values: [30, 17, 18, 23]
  },
  calls: {
    title: "Call - Category Wise",
    months: ['Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025'],
    values: [9, 12, 9, 11]
  }
};

export const competitorAdvertisingData: CompetitorAdvertising[] = [
    {
        logo: findImage('imboom-digital-logo')!,
        name: 'Imboom Digital',
        rating: 4.7,
        reviews: 24,
        address: 'Near Hanuman Mandir, Wock Nagpur',
        monthlyCharges: 12960,
        categories: 12,
        pincodes: 36
    },
    {
        logo: findImage('tolentribe-technologies-logo')!,
        name: 'Tolentribe Technolabs Pvt Ltd',
        rating: 4.7,
        reviews: 31,
        address: 'Chhatrapati Nagar, Nagpur',
        monthlyCharges: 4344,
        categories: 22,
        pincodes: 12
    }
]

export const trendsSuccessStories: TrendSuccessStory[] = [
    { image: findImage('success-1')!, name: 'Mr. Ashim Kumar Mondal', location: 'Benachity, Durgapur' },
    { image: findImage('success-2')!, name: 'Rajesh Chhabria', location: 'Commercial Street, Bangalore' },
    { image: findImage('success-3')!, name: 'Varshini', location: 'Bikashali, Bangalore' },
    { image: findImage('success-4')!, name: 'Gourab Neogi', location: 'Kasi Sarani Avenue, Kolkata' },
    { image: findImage('success-5')!, name: 'Dr. Sohini Sastri', location: 'Kalighat, Kolkata' },
]

export const mostLikedFeaturesData: MostLikedFeature[] = [
    {
        image: findImage('enquiry-homepage')!,
        title: 'Enquiry HomePage',
        description: 'What is Enquiries HomePage and what are its features?'
    },
    {
        image: findImage('enquiries-pages')!,
        title: 'Enquiries Pages',
        description: 'How will I get a enquiry, New Enquiries, Missed Enquiries and Relevant Enquiries?'
    },
    {
        image: findImage('enquiry-notification')!,
        title: 'Enquiry Notification & My Enquiry',
        description: 'How will I get a enquiry notification and if I miss my enquiry?'
    },
]

export const businessProfileInsightsData: BusinessProfileInsight[] = [
    {
        title: 'Rating',
        icon: findImage('rating-icon')!,
        you: { value: 0.0, label: 'You' },
        competition: { value: 4.9, label: 'Competition' }
    },
    {
        title: 'Reviews',
        icon: findImage('reviews-icon')!,
        you: { value: 0, label: 'You' },
        competition: { value: 15, label: 'Competition' }
    },
    {
        title: 'Photos',
        icon: findImage('photos-icon')!,
        you: { value: 1, label: 'You' },
        competition: { value: 17, label: 'Competition' }
    }
]
