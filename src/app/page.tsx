
'use client';
import { useState, useEffect, useRef } from 'react';
import { JustdialHeader } from '@/components/justdial/JustdialHeader';
import { HeroCarousel } from '@/components/justdial/HeroCarousel';
import { QuickAccessGrid } from '@/components/justdial/QuickAccessGrid';
import { JustdialFooter } from '@/components/justdial/JustdialFooter';
import { SearchSection } from '@/components/justdial/SearchSection';
import { FloatingButtons } from '@/components/justdial/FloatingButtons';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { TrendingSearches } from '@/components/justdial/TrendingSearches';
import { MostPopularServices } from '@/components/justdial/MostPopularServices';
import { TopVendors } from '@/components/justdial/TopVendors';
import { LatestMovies } from '@/components/justdial/LatestMovies';
import { LoginPopup } from '@/components/common/LoginPopup';
import { useLocation } from '@/contexts/LocationContext';
import { useToast } from '@/hooks/use-toast';
import { EnquiryDialog } from '@/components/common/EnquiryDialog';
import { useRouter } from 'next/navigation';
import { getHomePageData } from './actions';
import type { Banner, JDCategory } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { OfferBannerCarousel } from '@/components/justdial/OfferBannerCarousel';
import { apiFetch } from '@/lib/api-client';
import { calculateDistance } from '@/lib/utils';
import { LocationUpdateDialog } from '@/components/common/LocationUpdateDialog';

const LOCATION_UPDATE_THRESHOLD_KM = 20; // 20km

export default function JustdialHomePage() {
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isEnquiryDialogOpen, setIsEnquiryDialogOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const popupShownRef = useRef(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const { setCity, setIsLoading: setLocationLoading, setError: setLocationError, setLatitude, setLongitude, setAddress, setPincode, setState: setUserState } = useLocation();
  const { toast } = useToast();
  const locationFetchedRef = useRef(false);
  const router = useRouter();

  const [homePageData, setHomePageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [locationUpdateInfo, setLocationUpdateInfo] = useState<{ oldCity: string; newCity: string; lat: number; lon: number; } | null>(null);

  useEffect(() => {
    const loadHomePageData = async () => {
      setLoading(true);
      const { data, error } = await getHomePageData();
      if (error) {
        toast({ title: 'Error', description: `Could not load page content: ${error}`, variant: 'destructive' });
      } else {
        setHomePageData(data);
      }
      setLoading(false);
    };
    loadHomePageData();
  }, [toast]);

  useEffect(() => {
    const checkLoginStatus = () => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken');
            setIsLoggedIn(!!token);
        }
    };
    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []);

  useEffect(() => {
    if (!isLoggedIn && !popupShownRef.current) {
      const timer = setTimeout(() => {
        setIsLoginPopupOpen(true);
        popupShownRef.current = true;
      }, 10000); 

      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);
  
  useEffect(() => {
    if (locationFetchedRef.current) return;
    locationFetchedRef.current = true;

    const fetchAndCompareLocations = async () => {
      setLocationLoading(true);
      const token = localStorage.getItem('accessToken');
      let savedLocation: { latitude: number; longitude: number; city: string; address?: string; state?: string, pincode?: string } | null = null;

      if (token) {
        try {
          const result = await apiFetch('/api/auth/my-location', token);
          const loc = result.data.location;
          if (loc && loc.city && loc.latitude && loc.longitude) {
            savedLocation = { latitude: loc.latitude, longitude: loc.longitude, city: loc.city, address: loc.address, state: loc.state, pincode: loc.pincode };
            setCity(loc.city);
            setLatitude(loc.latitude);
            setLongitude(loc.longitude);
            setAddress(loc.address || '');
            setUserState(loc.state || '');
            setPincode(loc.pincode || '');
            setLocationError(null);
          }
        } catch (apiError) {
          console.error("API location fetch error:", apiError);
        }
      }

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude: newLat, longitude: newLon } = position.coords;
            
            try {
              const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${newLat}&longitude=${newLon}&localityLanguage=en`);
              const data = await response.json();
              const newCity = data.city;
              const newAddress = `${data.locality}, ${data.city}`;
              const newState = data.principalSubdivision;
              const newPincode = data.postcode;

              if (savedLocation && newCity && savedLocation.city !== newCity) {
                const distance = calculateDistance(savedLocation.latitude, savedLocation.longitude, newLat, newLon);
                if (distance > LOCATION_UPDATE_THRESHOLD_KM) {
                  setLocationUpdateInfo({ oldCity: savedLocation.city, newCity, lat: newLat, lon: newLon });
                } else {
                   setCity(savedLocation.city);
                   setLatitude(savedLocation.latitude);
                   setLongitude(savedLocation.longitude);
                   setAddress(savedLocation.address || '');
                   setUserState(savedLocation.state || '');
                   setPincode(savedLocation.pincode || '');
                }
              } else if (newCity) {
                  setCity(newCity);
                  setLatitude(newLat);
                  setLongitude(newLon);
                  setAddress(newAddress);
                  setUserState(newState);
                  setPincode(newPincode);
                  setLocationError(null);
              }
            } catch (apiError) {
              console.error("Reverse geocoding error:", apiError);
              if (!savedLocation) {
                setCity("Mumbai");
                setLocationError("Could not determine location.");
              }
            } finally {
              setLocationLoading(false);
            }
          },
          (error) => {
            console.error("Geolocation error:", error.message);
            if (!savedLocation) {
                setCity('Mumbai');
                setLocationError("Location access denied. Defaulting to Mumbai.");
            }
            setLocationLoading(false);
          }
        );
      } else {
        if (!savedLocation) {
            setCity('Mumbai');
            setLocationError("Geolocation is not supported. Defaulting to Mumbai.");
        }
        setLocationLoading(false);
      }
    };

    fetchAndCompareLocations();
  }, [setCity, setLocationLoading, setLocationError, toast, setLatitude, setLongitude, setAddress, setPincode, setUserState]);


  const handleSearchSubmit = (keyword: string) => {
    setSearchKeyword(keyword);
    if (isLoggedIn) {
      setIsEnquiryDialogOpen(true);
    } else {
      setIsLoginPopupOpen(true);
    }
  };

  const handleEnquirySubmitSuccess = () => {
    setIsEnquiryDialogOpen(false);
    router.push(`/search?q=${searchKeyword}`);
  };

  const handleLoginPopupClose = () => {
      if (!isLoggedIn && searchKeyword) {
          router.push(`/search?q=${searchKeyword}`);
      }
      setIsLoginPopupOpen(false);
  }

  const handleLocationUpdate = async (update: boolean) => {
    if (update && locationUpdateInfo) {
        const { newCity, lat, lon } = locationUpdateInfo;
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                await apiFetch('/api/auth/update-location', token, {
                    method: 'PUT',
                    body: JSON.stringify({ latitude: lat, longitude: lon, city: newCity }),
                });
                setCity(newCity);
                setLatitude(lat);
                setLongitude(lon);
                toast({ title: "Location Updated", description: `Your location is now set to ${newCity}.` });
            } catch (err) {
                toast({ title: "Error", description: "Failed to update your location.", variant: "destructive" });
            }
        }
    }
    setLocationUpdateInfo(null);
};


  const heroBanners = homePageData?.heroBanners?.banners || [];
  const categories = homePageData?.categories?.categories || [];
  const popularServices = homePageData?.mostPopularServices?.services || [];
  const topVendors = homePageData?.topVendorsNearUser?.vendors || [];
  const offerBannersTop = homePageData?.offerBanners?.top?.banners || [];
  const offerBannersMiddle = homePageData?.offerBanners?.middle?.banners || [];
  const offerBannersBottom = homePageData?.offerBanners?.bottom?.banners || [];
  const trendingServices = homePageData?.trendingServicesNearUser?.services || [];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen"
    >
      <JustdialHeader />
      <FloatingButtons />
      
      <div className="my-8 container mx-auto px-4">
          <OfferBannerCarousel banners={offerBannersTop} isLoading={loading} />
      </div>
      
      <section className="relative bg-gradient-to-br from-primary/5 via-accent/5 to-background pt-0 pb-16">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="container mx-auto px-4 relative z-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <SearchSection onSearch={handleSearchSubmit} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {loading ? <Skeleton className="h-80 w-full rounded-3xl" /> : <HeroCarousel banners={heroBanners} />}
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            className="relative block w-full h-12"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="#ffffff"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </svg>
        </div>
      </section>

      <main className="container mx-auto px-4 relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="my-8"
        >
          {loading ? (
             <div className="grid grid-cols-5 md:grid-cols-10 gap-6">
                {[...Array(10)].map((_, i) => <Skeleton key={i} className="h-24 w-20" />)}
             </div>
          ) : <QuickAccessGrid categories={categories} /> }
        </motion.div>

        <OfferBannerCarousel banners={offerBannersMiddle} isLoading={loading} />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
            <TrendingSearches services={trendingServices} />
            {loading ? <Skeleton className="h-96 w-full" /> : <MostPopularServices services={popularServices} />}
            {loading ? <Skeleton className="h-80 w-full mt-8" /> : <TopVendors vendors={topVendors} />}
            <LatestMovies />
        </motion.div>

        <OfferBannerCarousel banners={offerBannersBottom} isLoading={loading} />
      </main>
      
      <JustdialFooter />
      <LoginPopup isOpen={isLoginPopupOpen} onOpenChange={handleLoginPopupClose} />
      <EnquiryDialog 
        isOpen={isEnquiryDialogOpen}
        onOpenChange={setIsEnquiryDialogOpen}
        searchKeyword={searchKeyword}
        onSuccess={handleEnquirySubmitSuccess}
      />
       {locationUpdateInfo && (
        <LocationUpdateDialog
          isOpen={!!locationUpdateInfo}
          onOpenChange={(isOpen) => !isOpen && setLocationUpdateInfo(null)}
          oldCity={locationUpdateInfo.oldCity}
          newCity={locationUpdateInfo.newCity}
          onConfirm={() => handleLocationUpdate(true)}
          onDecline={() => handleLocationUpdate(false)}
        />
      )}
    </motion.div>
  );
}
