

'use client';
import { Button } from '@/components/ui/button';
import { Megaphone, TrendingUp, Bell, MapPin, Search, LogIn, LogOut, Briefcase } from 'lucide-react';
import Image from 'next/image';
import { Input } from '../ui/input';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfileSheet } from '../justdial/UserProfileSheet';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';


export function GnetdialHeader() {
  const [isProfileSheetOpen, setIsProfileSheetOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = Cookies.get('accessToken');
      setIsLoggedIn(!!token);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 150); 
    };

    const handleStorageChange = () => {
        const token = Cookies.get('accessToken');
        setIsLoggedIn(!!token);
    }
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('storage', handleStorageChange);

    return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      Cookies.remove('user');
      window.dispatchEvent(new Event("storage")); // Notify other tabs/windows
      router.push('/');
    }
  };
  
  const handleFreeListingClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      router.push('/register');
    }
  };

  return (
    <header className={`sticky top-0 z-50 w-full border-b bg-white shadow-sm transition-all duration-300 ${isScrolled ? 'h-16' : 'h-20'}`}>
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between gap-4 transition-all duration-300 ${isScrolled ? 'h-16' : 'h-20'}`}>
          <div className="flex items-center gap-4">
            {/* GnetDial Logo */}
            <div className="flex items-center">
               <Link href="/">
                <Image src="/logo.png" alt="Gnetdial Logo" width={120} height={28} />
               </Link>
            </div>
             {isScrolled && (
                 <div className="hidden md:flex items-center gap-2">
                    <div className="relative w-48">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            defaultValue="Mumbai"
                            className="pl-9 border-gray-300 focus:ring-primary focus:border-primary h-9"
                        />
                    </div>
                    <div className="relative w-96">
                        <Input
                            placeholder="Search for Restaurants, Hotels..."
                            className="border-gray-300 focus:ring-primary focus:border-primary h-9 pr-10"
                        />
                        <Button className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 bg-primary hover:bg-primary/90" size="icon">
                            <Search className="h-4 w-4 text-primary-foreground" />
                        </Button>
                    </div>
                </div>
            )}
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-700">
              <Link href="/advertise" className="flex items-center gap-1 hover:text-accent"><Megaphone className="h-4 w-4"/>Advertise</Link>
              <div className="relative">
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs bg-destructive text-destructive-foreground px-1 rounded-sm">BUSINESS</span>
                <Link href="/free-listing" onClick={handleFreeListingClick} className="flex items-center gap-1 hover:text-accent"><TrendingUp className="h-4 w-4"/>Free Listing</Link>
              </div>
              {isLoggedIn ? (
                <>
                  <Link href="/my-business" className="flex items-center gap-1 hover:text-accent"><Briefcase className="h-4 w-4"/>My Business</Link>
                  <Link href="/notifications"><Bell className="h-5 w-5"/></Link>
                  <Button onClick={handleLogout} variant="outline" size="sm" className="h-8">
                     <LogOut className="mr-2 h-4 w-4" />
                     Log Out
                  </Button>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full" onClick={() => setIsProfileSheetOpen(true)}>
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                        <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                  </Button>
                </>
              ) : (
                <Link href="/login">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md h-8 px-4">
                      <LogIn className="mr-2 h-4 w-4" />
                      Login / Sign Up
                    </Button>
                </Link>
              )}
          </div>
        </div>
      </div>
      {isLoggedIn && <UserProfileSheet isOpen={isProfileSheetOpen} onOpenChange={setIsProfileSheetOpen} />}
    </header>
  );
}
