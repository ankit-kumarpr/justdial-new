

'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Megaphone, TrendingUp, Bell, MapPin, Search, LogIn, LogOut, Briefcase, Menu, X, LayoutDashboard } from 'lucide-react';
import Image from 'next/image';
import { Input } from '../ui/input';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfileSheet } from './UserProfileSheet';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useRouter } from 'next/navigation';
import { getVendorStatus } from '@/app/my-business/actions';
import { useLocation } from '@/contexts/LocationContext';

export function JustdialHeader() {
  const [isProfileSheetOpen, setIsProfileSheetOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVendorState, setIsVendorState] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [singleBusinessId, setSingleBusinessId] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const router = useRouter();
  const { city, setCity: setGlobalCity } = useLocation();
  const [localCity, setLocalCity] = useState(city);

  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [headerSuggestions, setHeaderSuggestions] = useState<string[]>([]);
  const [isHeaderSuggestionsOpen, setIsHeaderSuggestionsOpen] = useState(false);
  const headerSearchContainerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    setLocalCity(city);
  }, [city]);
  
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);

  const checkAuthStatus = async () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        const userJson = localStorage.getItem('user');
        setIsLoggedIn(!!token);
        
        if (token && userJson) {
            try {
                const user = JSON.parse(userJson);
                setUserRole(user.role || null);
                if(user && user.id) {
                  const { isVendor, singleBusinessId } = await getVendorStatus(token);
                  setIsVendorState(isVendor);
                  setSingleBusinessId(singleBusinessId);
                } else {
                  setIsVendorState(false);
                  setSingleBusinessId(null);
                }
            } catch (e) {
                console.error("Failed to parse user data or check vendor status", e);
                setIsVendorState(false);
                setSingleBusinessId(null);
                setUserRole(null);
            }
        } else {
            setIsLoggedIn(false);
            setIsVendorState(false);
            setSingleBusinessId(null);
            setUserRole(null);
        }
      }
    };
    
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 150); 
    };

    checkAuthStatus();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('storage', checkAuthStatus);
    }
  }, []);

  useEffect(() => {
    if (headerSearchQuery.length < 2) {
        setHeaderSuggestions([]);
        setIsHeaderSuggestionsOpen(false);
        return;
    }

    const debounceTimer = setTimeout(() => {
        fetch(`/api/search-suggestions?q=${headerSearchQuery}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.data && Array.isArray(data.data.suggestions)) {
                    setHeaderSuggestions(data.data.suggestions);
                    setIsHeaderSuggestionsOpen(true);
                } else {
                    setHeaderSuggestions([]);
                    setIsHeaderSuggestionsOpen(false);
                }
            })
            .catch(err => {
                console.error("Failed to fetch suggestions:", err);
                setHeaderSuggestions([]);
                setIsHeaderSuggestionsOpen(false);
            });
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimer);
  }, [headerSearchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (headerSearchContainerRef.current && !headerSearchContainerRef.current.contains(event.target as Node)) {
            setIsHeaderSuggestionsOpen(false);
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (term: string) => {
    if (!term.trim()) return;
    setIsHeaderSuggestionsOpen(false);
    setHeaderSearchQuery(term);
    router.push(`/search?q=${term}`);
  };


  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event("storage"));
      router.push('/');
    }
  };

  const handleFreeListingClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      router.push('/register');
    } else {
      setIsMobileMenuOpen(false);
    }
  };

  const myBusinessHref = isVendorState ? (singleBusinessId ? `/business-dashboard?id=${singleBusinessId}` : '/my-business') : '#';

  return (
    <motion.header
      style={{ opacity: headerOpacity }}
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        isScrolled 
          ? 'h-16 shadow-lg glass-strong backdrop-blur-xl border-b border-white/20' 
          : 'h-20 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between gap-4 transition-all duration-500 ${
          isScrolled ? 'h-16' : 'h-20'
        }`}>
          {/* Logo Section */}
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="relative group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Image 
                  src="/logo.png" 
                  alt="Gnetdial Logo" 
                  width={120} 
                  height={28} 
                  className="transition-all duration-300"
                />
              </motion.div>
            </Link>
            
            {/* Search bar appears when scrolled */}
            <AnimatePresence>
              {isScrolled && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.4 }}
                  className="hidden lg:flex items-center gap-2"
                  ref={headerSearchContainerRef}
                >
                  <div className="relative w-48">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 transition-colors" />
                    <Input
                      value={localCity}
                      onChange={(e) => setLocalCity(e.target.value)}
                      onBlur={() => setGlobalCity(localCity)}
                      className="pl-9 border-gray-300 focus:ring-primary focus:border-primary h-9 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:bg-white focus:bg-white"
                    />
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); handleSearch(headerSearchQuery); }} className="relative w-96">
                    <Input
                      placeholder="Search for Restaurants, Hotels..."
                      className="border-gray-300 focus:ring-primary focus:border-primary h-9 pr-10 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:bg-white focus:bg-white"
                      value={headerSearchQuery}
                      onChange={(e) => setHeaderSearchQuery(e.target.value)}
                    />
                    <Button 
                      type="submit"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300 hover:scale-110" 
                      size="icon"
                    >
                      <Search className="h-4 w-4 text-white" />
                    </Button>
                    {isHeaderSuggestionsOpen && headerSuggestions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-20"
                        >
                            <ul className="py-1">
                                {headerSuggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        className="px-4 py-2 cursor-pointer hover:bg-primary/10 text-gray-700 transition-colors"
                                        onMouseDown={() => handleSearch(suggestion)}
                                    >
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    )}
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Mobile Menu Button & User Avatar */}
          <div className="flex md:hidden items-center gap-3">
            {isLoggedIn && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button 
                  variant="ghost" 
                  className="relative h-9 w-9 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-primary transition-all duration-300 p-0" 
                  onClick={() => setIsProfileSheetOpen(true)}
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </motion.div>
            )}
            
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-10 w-10 hover:bg-primary/10 transition-all duration-300"
                  >
                    <Menu className="h-6 w-6" />
                  </Button>
                </motion.div>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-gradient-to-br from-white via-gray-50 to-white">
                <SheetHeader>
                  <SheetTitle className="text-left bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-xl font-bold">
                    Menu
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-8 space-y-6">
                  {/* Mobile Navigation Links */}
                  <nav className="space-y-3">
                    {isVendorState && (
                      <Link 
                        href="/advertise" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 rounded-xl transition-all duration-300 group"
                      >
                        <div className="p-2 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                          <Megaphone className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">Advertise</span>
                      </Link>
                    )}
                    
                    {!isVendorState ? (
                      <div className="relative">
                        <span className="absolute top-0 left-12 text-xs bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full shadow-lg z-10">
                          BUSINESS
                        </span>
                        <Link 
                          href="/free-listing" 
                          onClick={handleFreeListingClick}
                          className="flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 rounded-xl transition-all duration-300 group"
                        >
                          <div className="p-2 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                            <TrendingUp className="h-5 w-5 text-primary" />
                          </div>
                          <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">Free Listing</span>
                        </Link>
                      </div>
                    ) : (
                      <Link 
                        href={myBusinessHref} 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 rounded-xl transition-all duration-300 group"
                      >
                        <div className="p-2 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                          <Briefcase className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">My Business</span>
                      </Link>
                    )}
                    
                    {isLoggedIn && (
                      <>
                        <button 
                          onClick={() => { router.push('/notifications'); setIsMobileMenuOpen(false); }}
                          className="flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 rounded-xl transition-all duration-300 group w-full"
                        >
                          <div className="p-2 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg group-hover:scale-110 transition-transform duration-300 relative">
                            <Bell className="h-5 w-5 text-primary" />
                            <span className="absolute -top-1 -right-1 h-2 w-2 bg-destructive rounded-full animate-pulse" />
                          </div>
                          <span className="font-medium text-gray-700 group-hover:text-primary transition-colors">Notifications</span>
                        </button>
                      </>
                    )}
                  </nav>
                  
                  {/* Divider */}
                  <div className="border-t border-gray-200"></div>
                  
                  {/* Auth Buttons */}
                  <div className="space-y-3">
                    {!isLoggedIn ? (
                      <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block">
                        <Button className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-xl text-white rounded-xl h-12 transition-all duration-300 hover:scale-105">
                          <LogIn className="mr-2 h-5 w-5" />
                          Login / Sign Up
                        </Button>
                      </Link>
                    ) : (
                      <Button 
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        variant="outline"
                        className="w-full h-12 rounded-xl hover:bg-destructive/10 hover:border-destructive hover:text-destructive transition-all duration-300"
                      >
                        <LogOut className="mr-2 h-5 w-5" />
                        Log Out
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Navigation Links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-700"
          >
            {(userRole === 'admin' || userRole === 'superadmin') && (
                 <Link 
                    href={userRole === 'superadmin' ? '/super-admin' : '/admin'}
                    className="flex items-center gap-1 hover:text-accent transition-all duration-300 hover:scale-105 group"
                 >
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="relative">Dashboard
                         <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                    </span>
                 </Link>
            )}
            {isVendorState && (
                <Link 
                href="/advertise" 
                className="flex items-center gap-1 hover:text-accent transition-all duration-300 hover:scale-105 group"
                >
                <motion.div
                    whileHover={{ rotate: 15 }}
                    transition={{ duration: 0.3 }}
                >
                    <Megaphone className="h-4 w-4" />
                </motion.div>
                <span className="relative">
                    Advertise
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                </span>
                </Link>
            )}
            
            {isLoggedIn ? (
              isVendorState ? (
                <Link 
                  href={myBusinessHref} 
                  className="flex items-center gap-1 hover:text-accent transition-all duration-300 hover:scale-105 group"
                >
                  <Briefcase className="h-4 w-4" />
                  <span className="relative">
                    My Business
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </Link>
              ) : (
                <div className="relative group">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full shadow-lg z-10"
                  >
                    BUSINESS
                  </motion.span>
                  <Link 
                    href="/free-listing" 
                    onClick={handleFreeListingClick}
                    className="flex items-center gap-1 hover:text-accent transition-all duration-300 hover:scale-105"
                  >
                    <motion.div
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TrendingUp className="h-4 w-4" />
                    </motion.div>
                    <span className="relative">
                      Free Listing
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </Link>
                </div>
              )
            ) : (
                 <div className="relative group">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full shadow-lg z-10"
                  >
                    BUSINESS
                  </motion.span>
                  <Link 
                    href="/free-listing" 
                    onClick={handleFreeListingClick}
                    className="flex items-center gap-1 hover:text-accent transition-all duration-300 hover:scale-105"
                  >
                    <motion.div
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TrendingUp className="h-4 w-4" />
                    </motion.div>
                    <span className="relative">
                      Free Listing
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </Link>
                </div>
            )}
            
            {isLoggedIn && (
              <>
                <motion.a 
                  href="/notifications" 
                  className="relative hover:text-accent transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Bell className="h-5 w-5" />
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 h-2 w-2 bg-destructive rounded-full animate-pulse"
                  />
                </motion.a>
              </>
            )}
            
            {isLoggedIn ? (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button 
                  variant="ghost" 
                  className="relative h-8 w-8 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-primary transition-all duration-300" 
                  onClick={() => setIsProfileSheetOpen(true)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </motion.div>
            ) : (
              <Link href="/login">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-gradient-to-r from-primary to-accent hover:shadow-xl text-white rounded-md h-8 px-4 transition-all duration-300 ripple">
                    Login / Sign Up
                  </Button>
                </motion.div>
              </Link>
            )}
          </motion.div>
        </div>
      </div>
      {isLoggedIn && <UserProfileSheet isOpen={isProfileSheetOpen} onOpenChange={setIsProfileSheetOpen} />}
    </motion.header>
  );
}
