
'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronDown, HelpCircle, X, Loader2 } from "lucide-react";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { apiFetch } from '@/lib/api-client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Business = {
    _id: string;
    businessName: string;
    city: string;
}

type DashboardHeaderProps = {
    title: string;
    showClose?: boolean;
    rightContent?: React.ReactNode;
}

function DashboardHeaderContent({ title, showClose, rightContent }: DashboardHeaderProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const businessId = searchParams.get('id');

    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [currentBusinessName, setCurrentBusinessName] = useState(title);
    const [currentBusinessCity, setCurrentBusinessCity] = useState('Your Business');
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);

    const fetchCurrentBusinessDetails = useCallback(async (id: string, token: string) => {
        const { name, city, error } = await getBusinessHeaderInfo(id, token);
        if (!error && name) {
            setCurrentBusinessName(name);
            if (city) setCurrentBusinessCity(city);
        } else {
             // Fallback to title if specific fetch fails
            setCurrentBusinessName(title);
        }
    }, [title]);

    const fetchBusinesses = useCallback(async (token: string) => {
        setLoading(true);
        try {
            const result = await apiFetch('/api/kyc/my-kyc', token);
            const businessList: Business[] = result.data.map((v: any) => ({
                _id: v._id,
                businessName: v.businessName,
                city: v.city,
            }));
            setBusinesses(businessList);

            const current = businessList.find(b => b._id === businessId);
            if (current) {
                setCurrentBusinessName(current.businessName);
                setCurrentBusinessCity(current.city);
            } else if (businessId) {
                // If the current business isn't in the list, fetch it individually
                await fetchCurrentBusinessDetails(businessId, token);
            } else if (businessList.length > 0) {
                 setCurrentBusinessName(businessList[0].businessName);
                 setCurrentBusinessCity(businessList[0].city);
            }

        } catch (error) {
            console.error("Failed to fetch businesses for header:", error);
        } finally {
            setLoading(false);
        }
    }, [businessId, fetchCurrentBusinessDetails]);

    const handleStorageChange = useCallback(() => {
        const token = localStorage.getItem('accessToken');
        const userJson = localStorage.getItem('user');
        if (userJson) {
            try {
                setUserRole(JSON.parse(userJson).role);
            } catch (e) { console.error(e); }
        } else {
            setUserRole(null);
        }

        if (token) {
            fetchBusinesses(token);
        }
    }, [fetchBusinesses]);
    
    useEffect(() => {
        handleStorageChange(); // Initial fetch
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [handleStorageChange]);


    const handleBusinessSwitch = (newId: string) => {
        const currentPath = pathname;
        const newUrl = `${currentPath}?id=${newId}`;
        router.push(newUrl);
    };

    const isDashboardPage = pathname === '/business-dashboard';
    
    let backLink = `/business-dashboard?id=${businessId || ''}`;
    if (isDashboardPage) {
        if (userRole === 'user') {
            backLink = '/';
        } else {
            backLink = '/my-business';
        }
    }


    return (
        <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-20 border-b border-gray-100">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                     {!showClose && (
                        <Link href={backLink}>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="ghost" size="icon">
                                    <ChevronLeft className="h-6 w-6" />
                                </Button>
                            </motion.div>
                        </Link>
                    )}
                    <div>
                        {loading ? (
                            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                        ) : businesses.length > 1 ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="flex items-center gap-2 cursor-pointer group">
                                        <h1 className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{currentBusinessName}</h1>
                                        <ChevronDown className="h-4 w-4 text-gray-600 group-hover:text-primary transition-colors" />
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {businesses.map(business => (
                                        <DropdownMenuItem key={business._id} onSelect={() => handleBusinessSwitch(business._id)}>
                                            {business.businessName}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                           <h1 className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{currentBusinessName}</h1>
                        )}
                        <p className="text-sm text-gray-500">{currentBusinessCity}</p>
                    </div>
                </div>
                
                {rightContent ? rightContent : (
                     <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        {showClose ? (
                             <Link href={backLink}>
                                <Button variant="ghost" size="icon">
                                    <X className="h-6 w-6" />
                                </Button>
                            </Link>
                        ) : (
                             <Button variant="outline" size="sm" asChild>
                                <Link href="/customer-service">
                                    <HelpCircle className="h-4 w-4 mr-2" /> Help
                                </Link>
                            </Button>
                        )}
                    </motion.div>
                )}
            </div>
        </header>
    );
}

// Separate server action to fetch just the header info for a single business.
async function getBusinessHeaderInfo(businessId: string, token: string): Promise<{ name: string | null; city: string | null; error: string | null }> {
    if (!businessId || !token) {
        return { name: null, city: null, error: 'Business ID and token are required.' };
    }
    
    try {
        const result = await apiFetch(`/api/vendor/profile/business/${businessId}`, token, { cache: 'no-store' });
        const business = result.data?.business;
        if (!business) {
            return { name: null, city: null, error: 'Business not found.' };
        }
        return { name: business.businessName, city: business.address?.city, error: null };
    } catch (e: any) {
        return { name: null, city: null, error: e.message };
    }
}


export function DashboardHeader(props: DashboardHeaderProps) {
    return (
        <Suspense fallback={
            <div className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-20 border-b border-gray-100 p-4">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
                        <div>
                            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 w-20 bg-gray-200 rounded mt-1 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        }>
            <DashboardHeaderContent {...props} />
        </Suspense>
    )
}
