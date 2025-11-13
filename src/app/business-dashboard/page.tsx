
'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronDown,
  HelpCircle,
  Edit,
  Megaphone,
  Rocket,
  Star,
  Image as ImageIcon,
  UserPlus,
  BadgePercent,
  Link as LinkIcon,
  Video,
  Share2,
  QrCode,
  MapPin,
  UploadCloud,
  LayoutGrid,
  Mail,
  Briefcase,
  Book,
  Wallet,
  Award,
  ChevronRight,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
  Loader2,
  Key,
  LifeBuoy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Autoplay from "embla-carousel-autoplay";
import { cn } from '@/lib/utils';
import { ProfileScoreSheet } from '@/components/justdial/ProfileScoreSheet';
import { BusinessProfileSheet } from '@/components/justdial/BusinessProfileSheet';
import { AdditionalInfoSheet } from '@/components/justdial/your-dashboard/AdditionalInfoSheet';
import { KycPaymentsSheet } from '@/components/justdial/your-dashboard/KycPaymentsSheet';
import { BusinessToolsSheet } from '@/components/justdial/your-dashboard/BusinessToolsSheet';
import { LeadsSheet } from '@/components/justdial/your-dashboard/LeadsSheet';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { useSearchParams, useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { KycResubmissionDialog } from '@/components/business-dashboard/KycResubmissionDialog';
import { getKycStatusForVendor } from './actions';
import { useToast } from '@/hooks/use-toast';
import { DashboardHeader } from '@/components/justdial/your-dashboard/DashboardHeader';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

const dashboardBanners = [
    {
        id: 'dashboard-carousel-1',
        alt: 'Get prime placement above competitors',
        title: 'Get Prime Placement',
        subtitle: 'Above Competitors',
        buttonText: 'Claim this Banner',
        href: '/advertise'
    },
    {
        id: 'dashboard-carousel-2',
        alt: 'Boost your business with special offers',
        title: 'Boost Your Business',
        subtitle: 'With Special Offers',
        buttonText: 'Create Offer',
        href: '/business-dashboard/offers'
    },
    {
        id: 'dashboard-carousel-3',
        alt: 'Advertise on Gnetdial and reach more customers',
        title: 'Advertise on Gnetdial',
        subtitle: 'Reach More Customers',
        buttonText: 'Advertise Now',
        href: '/advertise'
    }
]

const quickActions = [
  { icon: Edit, label: 'Edit Profile', action: 'editProfile' },
  { icon: Megaphone, label: 'Advertise', href: '/advertise', badge: '50% OFF', badgeColor: 'bg-destructive text-destructive-foreground' },
  { icon: Rocket, label: 'Biz Boosters', href: '/business-dashboard/biz-boosters' },
  { icon: Star, label: 'Reviews', href: '/reviews'},
  { icon: ImageIcon, label: 'Add Photos', href: '/business-dashboard/photos-videos' },
  { icon: UserPlus, label: 'Add Contact', href: '/business-dashboard/edit-contact-details', badge: '!', badgeColor: 'bg-destructive text-destructive-foreground' },
  { icon: 'whatsapp', label: 'Add WhatsApp', href: '/business-dashboard/edit-contact-details' },
  { icon: UploadCloud, label: 'Upload Catalogue', href: '/business-dashboard/catalogue', badge: 'FREE', badgeColor: 'bg-primary text-primary-foreground' },
  { icon: BadgePercent, label: 'Add Offer', href: '/business-dashboard/offers', badge: 'DIWALI', badgeColor: 'bg-yellow-400 text-black' },
  { icon: LinkIcon, label: 'Add Website', href: '/business-dashboard/update-business-website' },
  { icon: Video, label: 'Add Video', href: '/business-dashboard/photos-videos' },
  { icon: Share2, label: 'Add Social Links', href: '/business-dashboard/social-media' },
  { icon: QrCode, label: 'Ratings QR', href: '/business-dashboard/ratings-qr' },
  { icon: Key, label: 'Add Keywords', href: '/business-dashboard/keywords' },
];

const myBusinessLinks = [
    { icon: Megaphone, title: 'Advertise on Gnetdial', subtitle: 'Reach Out to 19.3 Crore New Customers', badge: 'Upto 50% OFF', badgeColor: 'bg-green-100 text-green-700', href: "/advertise" },
    { icon: Mail, title: 'Leads', subtitle: 'View Leads, Competitor Trends & Analytics', action: 'leads' },
    { icon: Briefcase, title: 'Business Profile', subtitle: 'Update Categories, WhatsApp / Mobile Numbers & Business Timings', badge: 'Info Missing', badgeColor: 'bg-orange-100 text-orange-700', action: 'editProfile' },
    { icon: Book, title: 'Catalogue', subtitle: 'Showcase Products & Services', badge: 'Missing', badgeColor: 'bg-orange-100 text-orange-700', href: '/business-dashboard/catalogue' },
    { icon: Briefcase, title: 'Business Tools', subtitle: 'Manage Offers, Reviews and more', badge: '20 Pending', badgeColor: 'bg-destructive text-destructive-foreground', action: 'businessTools' },
    { icon: Wallet, title: 'KYC, Payments & Invoices', subtitle: 'Update KYC Details', badge: 'Missing', badgeColor: 'bg-orange-100 text-orange-700', action: 'kycPayments' },
    { icon: Award, title: 'Additional Business Info', subtitle: 'Update Awards, Certificates and more', action: 'additionalInfo' },
    { icon: LifeBuoy, title: 'Support', subtitle: 'Connect with Us', href: '/customer-service' },
];

const successStories = [
    { name: 'Mr. Ashim Kumar Mondal', role: 'Astrologer Sri Ashimanandaji Jyotish Mahamahopadhay', image: findImage('success-1'), href:"#" },
    { name: 'Rajesh Chhabria', role: 'Chhabria and Sons', image: findImage('success-2'), href:"#" },
    { name: 'Varshini', role: 'V2 Makeover', image: findImage('success-3'), href:"#" },
    { name: 'Gourab Neogi', role: 'Tolly Academy (Corporate Centre - Gariahat)', image: findImage('success-4'), href:"#" },
    { name: 'Dr. Sohini Sastri', role: 'Dr. Sohini Sastri', image: findImage('success-5'), href:"#" },
];

function BusinessDashboardComponent() {
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [isProfileScoreSheetOpen, setIsProfileScoreSheetOpen] = useState(false);
    const [isEditProfileSheetOpen, setIsEditProfileSheetOpen] = useState(false);
    const [isAdditionalInfoSheetOpen, setIsAdditionalInfoSheetOpen] = useState(false);
    const [isKycPaymentsSheetOpen, setIsKycPaymentsSheetOpen] = useState(false);
    const [isBusinessToolsSheetOpen, setIsBusinessToolsSheetOpen] = useState(false);
    const [isLeadsSheetOpen, setIsLeadsSheetOpen] = useState(false);
    const searchParams = useSearchParams();
    const businessId = searchParams.get('id');
    const { toast } = useToast();
    const router = useRouter();

    const [kycStatus, setKycStatus] = useState<any>(null);
    const [isKycResubmitOpen, setIsKycResubmitOpen] = useState(false);
    
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
            return;
        }

        if (businessId) {
            const fetchKycStatus = async () => {
                const { data, error } = await getKycStatusForVendor(businessId, token);

                if (error) {
                    toast({ title: 'Error', description: `Failed to fetch KYC status: ${error}`, variant: 'destructive' });
                    console.error("Error fetching KYC status:", error);
                    if (error.includes("Invalid or expired token")) {
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        localStorage.removeItem('user');
                        window.dispatchEvent(new Event("storage"));
                        router.push('/login');
                    }
                } else if (data) {
                    setKycStatus(data);
                }
            };
            
            fetchKycStatus();
        }
    }, [businessId, toast, router]);


    const plugin = useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    );

    useEffect(() => {
        if (!api) {
            return
        }

        setCurrent(api.selectedScrollSnap())

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap())
        })
    }, [api])

    const handleQuickActionClick = (action?: string) => {
      if (action === 'editProfile') {
        setIsEditProfileSheetOpen(true);
      }
    };

    const handleBusinessLinkClick = (action: string | undefined) => {
        if (action === 'editProfile') {
            setIsEditProfileSheetOpen(true);
        } else if (action === 'additionalInfo') {
            setIsAdditionalInfoSheetOpen(true);
        } else if (action === 'kycPayments') {
            setIsKycPaymentsSheetOpen(true);
        } else if (action === 'businessTools') {
            setIsBusinessToolsSheetOpen(true);
        } else if (action === 'leads') {
            setIsLeadsSheetOpen(true);
        }
    };

  return (
    <>
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen relative overflow-hidden"
    >
      <DashboardHeader title="Business Dashboard" />

      <main className="container mx-auto px-[4%] py-6 space-y-8 relative z-10">

        {kycStatus?.status === 'pending' && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
                    <AlertTriangle className="h-4 w-4 !text-yellow-500" />
                    <AlertTitle>KYC Pending</AlertTitle>
                    <AlertDescription>
                        Your KYC verification is in progress. We will notify you once it's complete.
                    </AlertDescription>
                </Alert>
            </motion.div>
        )}

        {kycStatus?.status === 'rejected' && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>KYC Rejected</AlertTitle>
                    <AlertDescription>
                        Your KYC submission was rejected. Reason: <strong>{kycStatus.rejection_reason || "No reason provided."}</strong>
                        <div className="mt-2">
                           <Button variant="destructive" size="sm" onClick={() => setIsKycResubmitOpen(true)}>
                                 <RefreshCw className="mr-2 h-4 w-4" /> Resubmit KYC
                           </Button>
                        </div>
                    </AlertDescription>
                </Alert>
            </motion.div>
        )}

        {/* Banner Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
            <Carousel setApi={setApi} className="w-full" plugins={[plugin.current]} onMouseEnter={plugin.current.stop} onMouseLeave={plugin.current.reset} opts={{ loop: true }}>
                <CarouselContent>
                    {dashboardBanners.map((banner, index) => (
                        <CarouselItem key={index}>
                            <Link href={banner.href}>
                            <Card className="bg-gradient-to-r from-teal-50 via-cyan-50 to-teal-50 border-none overflow-hidden relative h-56 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl group">
                                <Image src={findImage(banner.id)} alt={banner.alt} fill className="object-cover object-right group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-r from-teal-50 via-teal-50/80 to-transparent p-6 flex flex-col justify-center">
                                    <motion.h2
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: 0.3 }}
                                      className="text-2xl font-bold text-gray-800"
                                    >
                                      {banner.title}
                                    </motion.h2>
                                    <motion.h3
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: 0.4 }}
                                      className="text-2xl font-bold text-gray-800 mb-4"
                                    >
                                      {banner.subtitle}
                                    </motion.h3>
                                    <motion.div
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: 0.5 }}
                                    >
                                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-fit shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                          {banner.buttonText} <ChevronRight className="h-4 w-4 ml-1" />
                                      </Button>
                                    </motion.div>
                                </div>
                            </Card>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 bg-white/90 hover:bg-white shadow-lg" />
                <CarouselNext className="right-2 bg-white/90 hover:bg-white shadow-lg" />
            </Carousel>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center gap-2">
                {dashboardBanners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => api?.scrollTo(index)}
                        className={cn(
                            "h-2 w-2 rounded-full transition-all duration-300",
                            current === index ? "bg-white w-8" : "bg-white/50"
                        )}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </motion.div>

        {/* Profile Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-none bg-white/80 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-6 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16">
                  <svg className="w-full h-full transform group-hover:scale-110 transition-transform duration-300" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="text-destructive"
                      strokeDasharray="16, 100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">16%</div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">Increase Business Profile Score</h3>
                  <p className="text-gray-600">Reach out to more customers</p>
                </div>
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" onClick={() => setIsProfileScoreSheetOpen(true)}>
                Increase Score
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-4 sm:grid-cols-7 gap-4 text-center"
        >
          {quickActions.map((action, idx) => {
              const ActionWrapper = action.href ? Link : 'div';
              const props = action.href ? { href: `${action.href}${businessId ? `?id=${businessId}` : ''}` } : { onClick: () => handleQuickActionClick(action.action) };
              
              return (
                <ActionWrapper key={action.label} {...props}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.7 + idx * 0.05 }}
                    className="flex flex-col items-center gap-2 relative"
                  >
                      {action.badge && (
                          <span className={`absolute -top-1 z-10 text-xs px-1.5 py-0.5 rounded-full font-semibold ${action.badgeColor} ${action.label === 'Advertise' ? 'left-1/2 -translate-x-1/2' : '-right-1'}`}>
                          {action.badge}
                          </span>
                      )}
                      <motion.div
                        whileHover={{ scale: 1.1, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-14 h-14 rounded-full bg-gradient-to-br from-white to-gray-50 flex items-center justify-center border-2 border-gray-100 hover:border-primary hover:shadow-xl cursor-pointer transition-all duration-300"
                      >
                          {typeof action.icon === 'string' ? 
                            <Image src={findImage('whatsapp-icon')} alt='whatsapp' width={28} height={28} /> : 
                            <action.icon className="h-7 w-7 text-chart-1" />}
                      </motion.div>
                      <p className="text-xs font-medium text-gray-700">{action.label}</p>
                  </motion.div>
                </ActionWrapper>
            );
          })}
        </motion.div>

        {/* Action Cards Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Carousel className="w-full" opts={{ loop: true }}>
            <CarouselContent className="-ml-4">
               <CarouselItem className="pl-4 md:basis-1/3">
                <Link href={`/advertise?id=${businessId}`}>
                <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-none bg-white/80 backdrop-blur-sm group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="p-6 flex flex-col justify-between h-48 relative z-10">
                      <div>
                        <h3 className="font-bold text-gray-800">Offer Banners</h3>
                        <p className="text-sm text-gray-600 mb-4">Get prime placement above competitors</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <Image src={findImage('biz-booster-mobile-banner')} alt="Offer Banner graphic" width={80} height={60} className="group-hover:scale-110 transition-transform duration-300" />
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                           Claim Banner <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                  </CardContent>
                </Card>
                </Link>
              </CarouselItem>
              <CarouselItem className="pl-4 md:basis-1/3">
                <Link href={`/business-dashboard/offers?id=${businessId}`}>
                <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-none bg-white/80 backdrop-blur-sm group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="p-6 flex flex-col justify-between h-48 relative z-10">
                      <div>
                        <h3 className="font-bold text-gray-800">Add Offers</h3>
                        <p className="text-sm text-gray-600 mb-4">Promote your <span className="font-bold">Diwali Special Offer</span></p>
                      </div>
                      <div className="flex justify-between items-end">
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                          ADD OFFER <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Image src={findImage('add-offer-graphic')} alt="Add offer graphic" width={80} height={60} className="group-hover:scale-110 transition-transform duration-300" />
                      </div>
                  </CardContent>
                </Card>
                </Link>
              </CarouselItem>
              <CarouselItem className="pl-4 md:basis-1/3">
                <Link href={`/business-dashboard/edit-business-address?id=${businessId}`}>
                <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-none bg-white/80 backdrop-blur-sm group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="p-6 flex flex-col justify-between h-48 relative z-10">
                      <div>
                        <h3 className="font-bold text-gray-800">Add Complete Address</h3>
                        <p className="text-sm text-gray-600 mb-4">Add business location to help customers find you</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <Image src={findImage('address-icon')} alt="Address icon" width={60} height={60} className="group-hover:scale-110 transition-transform duration-300" />
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">Add Address</Button>
                      </div>
                  </CardContent>
                </Card>
                </Link>
              </CarouselItem>
              <CarouselItem className="pl-4 md:basis-1/3">
                <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-none bg-white/80 backdrop-blur-sm group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="p-6 flex flex-col justify-between h-48 relative z-10">
                      <div>
                        <h3 className="font-bold text-gray-800">Upload Rate Card / Catalogue</h3>
                        <p className="text-sm text-gray-600 mb-4">Help customers make decisions by displaying options</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <Image src={findImage('catalogue-icon')} alt="Catalogue icon" width={60} height={60} className="group-hover:scale-110 transition-transform duration-300" />
                        <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                          <Link href={`/business-dashboard/catalogue?id=${businessId}`}>Upload</Link>
                        </Button>
                      </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            <CarouselItem className="pl-4 md:basis-1/3">
              <Link href={`/business-dashboard/update-business-categories?id=${businessId}`}>
              <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-none bg-white/80 backdrop-blur-sm group overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="p-6 flex flex-col justify-between h-48 relative z-10">
                    <div>
                      <h3 className="font-bold text-gray-800">Add Business Categories</h3>
                      <p className="text-sm text-gray-600 mb-4">Attract diverse customers &amp; increase visibility</p>
                    </div>
                    <div className="flex justify-between items-end">
                      <Image src={findImage('category-icon')} alt="Category icon" width={60} height={60} className="group-hover:scale-110 transition-transform duration-300" />
                      <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">Add Categories</Button>
                    </div>
                </CardContent>
              </Card>
              </Link>
            </CarouselItem>
             <CarouselItem className="pl-4 md:basis-1/3">
                <Link href={`/business-dashboard/ratings-qr?id=${businessId}`}>
                <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-none bg-white/80 backdrop-blur-sm group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="p-6 flex flex-col justify-between h-48 relative z-10">
                      <div>
                        <h3 className="font-bold text-gray-800">Share Rating QR Code</h3>
                        <p className="text-sm text-gray-600 mb-4">Let customers easily rate your business.</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <Image src={findImage('qr-code-icon')} alt="QR Code icon" width={60} height={60} className="group-hover:scale-110 transition-transform duration-300" />
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">Get QR Code</Button>
                      </div>
                  </CardContent>
                </Card>
                </Link>
             </CarouselItem>
             <CarouselItem className="pl-4 md:basis-1/3">
                <Link href={`/business-dashboard/biz-boosters?id=${businessId}`}>
                <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-none bg-white/80 backdrop-blur-sm group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="p-6 flex flex-col justify-between h-48 relative z-10">
                      <div>
                        <h3 className="font-bold text-gray-800">Increase Your Leads Instantly</h3>
                        <p className="text-sm text-gray-600 mb-4">Boost your visibility and get more customers.</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <Image src={findImage('leads-icon')} alt="Leads icon" width={60} height={60} className="group-hover:scale-110 transition-transform duration-300" />
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">Boost Now</Button>
                      </div>
                  </CardContent>
                </Card>
                </Link>
             </CarouselItem>
             <CarouselItem className="pl-4 md:basis-1/3">
                <Link href={`/business-dashboard/yearly-turnover?id=${businessId}`}>
                <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-none bg-white/80 backdrop-blur-sm group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="p-6 flex flex-col justify-between h-48 relative z-10">
                      <div>
                        <h3 className="font-bold text-gray-800">Add Yearly Turnover</h3>
                        <p className="text-sm text-gray-600 mb-4">Provide your business's financial information.</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <Image src={findImage('turnover-icon')} alt="Turnover icon" width={60} height={60} className="group-hover:scale-110 transition-transform duration-300" />
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">Add Turnover</Button>
                      </div>
                  </CardContent>
                </Card>
                </Link>
             </CarouselItem>
             <CarouselItem className="pl-4 md:basis-1/3">
                <Link href={`/admin/kyc?id=${businessId}`}>
                <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-none bg-white/80 backdrop-blur-sm group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="p-6 flex flex-col justify-between h-48 relative z-10">
                      <div>
                        <h3 className="font-bold text-gray-800">Complete KYC</h3>
                        <p className="text-sm text-gray-600 mb-4">Verify your business to build trust with customers.</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <Image src={findImage('kyc-icon')} alt="KYC icon" width={60} height={60} className="group-hover:scale-110 transition-transform duration-300" />
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">Complete KYC</Button>
                      </div>
                  </CardContent>
                </Card>
                </Link>
             </CarouselItem>
             <CarouselItem className="pl-4 md:basis-1/3">
                <Link href={`/business-dashboard/edit-contact-details?id=${businessId}`}>
                <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-none bg-white/80 backdrop-blur-sm group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="p-6 flex flex-col justify-between h-48 relative z-10">
                      <div>
                        <h3 className="font-bold text-gray-800">Add Contact Details</h3>
                        <p className="text-sm text-gray-600 mb-4">Help customers get in touch with you easily.</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <Image src={findImage('contact-icon')} alt="Contact icon" width={60} height={60} className="group-hover:scale-110 transition-transform duration-300" />
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">Add Details</Button>
                      </div>
                  </CardContent>
                </Card>
                </Link>
             </CarouselItem>
             <CarouselItem className="pl-4 md:basis-1/3">
                <Link href={`/business-dashboard/edit-contact-details?id=${businessId}`}>
                <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-none bg-white/80 backdrop-blur-sm group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="p-6 flex flex-col justify-between h-48 relative z-10">
                      <div>
                        <h3 className="font-bold text-gray-800">Add WhatsApp Number</h3>
                        <p className="text-sm text-gray-600 mb-4">Connect with customers on their favorite app.</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <Image src={findImage('whatsapp-large-icon')} alt="WhatsApp icon" width={60} height={60} className="group-hover:scale-110 transition-transform duration-300" />
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">Add Number</Button>
                      </div>
                  </CardContent>
                </Card>
                </Link>
             </CarouselItem>
             <CarouselItem className="pl-4 md:basis-1/3">
                <Link href={`/business-dashboard/catalogue?id=${businessId}`}>
                <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-none bg-white/80 backdrop-blur-sm group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="p-6 flex flex-col justify-between h-48 relative z-10">
                      <div>
                        <h3 className="font-bold text-gray-800">Add Digital Catalogue</h3>
                        <p className="text-sm text-gray-600 mb-4">Showcase your products and services online.</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <Image src={findImage('digital-catalogue-icon')} alt="Catalogue icon" width={60} height={60} className="group-hover:scale-110 transition-transform duration-300" />
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">Add Catalogue</Button>
                      </div>
                  </CardContent>
                </Card>
                </Link>
             </CarouselItem>
             <CarouselItem className="pl-4 md:basis-1/3">
                <Link href={`/business-dashboard/number-of-employees?id=${businessId}`}>
                <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-none bg-white/80 backdrop-blur-sm group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="p-6 flex flex-col justify-between h-48 relative z-10">
                      <div>
                        <h3 className="font-bold text-gray-800">Add Number of Employees</h3>
                        <p className="text-sm text-gray-600 mb-4">Provide more details about your business size.</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <Image src={findImage('employees-icon')} alt="Employees icon" width={60} height={60} className="group-hover:scale-110 transition-transform duration-300" />
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">Add Employees</Button>
                      </div>
                  </CardContent>
                </Card>
                </Link>
             </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="left-[-1rem] bg-white/90 hover:bg-white shadow-lg" />
          <CarouselNext className="right-[-1rem] bg-white/90 hover:bg-white shadow-lg" />
        </Carousel>
        </motion.div>

        {/* My Business */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <Card className="rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-none bg-white/80 backdrop-blur-sm overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent opacity-50" />
            <CardHeader className="p-6 relative z-10">
                <h3 className="font-bold text-xl text-gray-800">My Business</h3>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-2 relative z-10">
                {myBusinessLinks.map((link, idx) => {
                    const Wrapper = link.href ? Link : 'div';
                    const props = link.href ? { href: `${link.href}${businessId ? `?id=${businessId}` : ''}` } : { onClick: () => handleBusinessLinkClick(link.action) };

                    return (
                        <Wrapper key={link.title} {...props}>
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: 1.1 + idx * 0.05 }}
                              whileHover={{ x: 4, scale: 1.01 }}
                              className="flex items-center justify-between p-4 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent rounded-2xl cursor-pointer transition-all duration-300 group border border-transparent hover:border-primary/20"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                      <link.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800"> 
                                        {link.title}
                                        {link.badge && <span className={`ml-2 text-xs font-medium px-2 py-1 rounded-lg ${link.badgeColor}`}>{link.badge}</span>}
                                        </h4>
                                        <p className="text-sm text-gray-600">{link.subtitle}</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                            </motion.div>
                        </Wrapper>
                    )
                })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Success Stories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mb-8"
        >
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Success Stories</h2>
             <Carousel className="w-full">
                <CarouselContent className="-ml-4">
                    {successStories.map((story, index) => (
                    <CarouselItem key={index} className="pl-4 md:basis-1/3 lg:basis-1/5">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: 1.3 + index * 0.1 }}
                        >
                          <Card className="overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-none group">
                              <div className="relative overflow-hidden">
                                <Image src={story.image} alt={story.name} width={200} height={200} className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              </div>
                              <CardContent className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 group-hover:from-yellow-100 group-hover:to-amber-100 transition-all duration-300">
                                  <h4 className="font-bold text-gray-800">{story.name}</h4>
                                  <p className="text-sm text-gray-700">{story.role}</p>
                              </CardContent>
                          </Card>
                        </motion.div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-[-1rem] bg-white/90 hover:bg-white shadow-lg" />
                <CarouselNext className="right-[-1rem] bg-white/90 hover:bg-white shadow-lg" />
            </Carousel>
        </motion.div>
      </main>
    </motion.div>

      {/* Sheets and Dialogs */}
      <ProfileScoreSheet isOpen={isProfileScoreSheetOpen} onOpenChange={setIsProfileScoreSheetOpen} />
      <BusinessProfileSheet isOpen={isEditProfileSheetOpen} onOpenChange={setIsEditProfileSheetOpen} businessId={businessId} />
      <AdditionalInfoSheet isOpen={isAdditionalInfoSheetOpen} onOpenChange={setIsAdditionalInfoSheetOpen} />
      <KycPaymentsSheet isOpen={isKycPaymentsSheetOpen} onOpenChange={setIsKycPaymentsSheetOpen} />
      <BusinessToolsSheet isOpen={isBusinessToolsSheetOpen} onOpenChange={setIsBusinessToolsSheetOpen} />
      <LeadsSheet isOpen={isLeadsSheetOpen} onOpenChange={setIsLeadsSheetOpen} businessId={businessId} />
      {kycStatus?.status === 'rejected' && businessId && (
        <KycResubmissionDialog 
            isOpen={isKycResubmitOpen}
            onOpenChange={setIsKycResubmitOpen}
            kycId={kycStatus.id}
            vendorId={businessId}
        />
      )}
    </>
  );
}

function Page() {
    return (
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin" /></div>}>
            <BusinessDashboardComponent />
        </Suspense>
    )
}

export default Page;



