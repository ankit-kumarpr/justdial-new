
'use client';

import { Suspense, useEffect, useState } from 'react';
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
    const [loading, setLoading] = useState(true);

    const currentBusiness = businesses.find(b => b._id === businessId);

    useEffect(() => {
        const fetchBusinesses = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) return;
            setLoading(true);
            try {
                const result = await apiFetch('/api/kyc/my-kyc', token);
                setBusinesses(result.data || []);
            } catch (error) {
                console.error("Failed to fetch businesses for header:", error);
            }
            setLoading(false);
        };
        fetchBusinesses();
    }, []);

    const handleBusinessSwitch = (newId: string) => {
        const currentPath = pathname;
        const newUrl = `${currentPath}?id=${newId}`;
        router.push(newUrl);
    };

    const backLink = '/my-business';

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
                        {businesses.length > 1 ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="flex items-center gap-2 cursor-pointer group">
                                        <h1 className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{currentBusiness?.businessName || title}</h1>
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
                           <h1 className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{currentBusiness?.businessName || title}</h1>
                        )}
                        <p className="text-sm text-gray-500">{currentBusiness?.city || 'Your Business'}</p>
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
