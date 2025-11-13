
'use client';

import { useState, Suspense, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Loader2, ImageIcon, IndianRupee, Edit, Trash2, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { Card, CardContent } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { getMyOfferBanners, deleteOfferBanner } from './actions';
import Image from 'next/image';
import type { Banner } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { UploadBannerDialog } from '@/components/business-dashboard/offers/UploadBannerDialog';
import { verifyOfferBannerPayment } from '@/app/advertise/actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const getStatusInfo = (banner: Banner) => {
    if (!banner.isPaid) return { text: 'Pending Payment', color: 'bg-yellow-100 text-yellow-800' };
    if (!banner.isBannerUploaded) return { text: 'Awaiting Banner', color: 'bg-blue-100 text-blue-800' };
    
    const now = new Date();
    const start = new Date(banner.startDate);
    const end = new Date(banner.endDate);

    if (now < start) return { text: 'Scheduled', color: 'bg-purple-100 text-purple-800' };
    if (now > end) return { text: 'Expired', color: 'bg-gray-100 text-gray-800' };
    return { text: 'Active', color: 'bg-green-100 text-green-800' };
};


function OffersPageComponent() {
    const searchParams = useSearchParams();
    const businessId = searchParams.get('id') || '';
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const { toast } = useToast();

    const fetchBanners = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast({ title: 'Error', description: 'Authentication is required.', variant: 'destructive'});
            setLoading(false);
            return;
        }
        const { data, error } = await getMyOfferBanners(token);
        if (error) {
            toast({ title: 'Error', description: `Failed to load banners: ${error}`, variant: 'destructive' });
        } else {
            setBanners(data || []);
        }
        setLoading(false);
    }, [toast]);
    
    useEffect(() => {
        fetchBanners();
    }, [fetchBanners]);

    const handleOpenDialog = (banner: Banner) => {
        setSelectedBanner(banner);
        setIsUploadDialogOpen(true);
    };

    const handleDeleteBanner = async (bannerId: string) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast({ title: 'Error', description: 'Authentication required.', variant: 'destructive' });
            return;
        }
        const result = await deleteOfferBanner(bannerId, token);
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            fetchBanners();
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    };

    const handlePayNow = (banner: Banner) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast({ title: 'Error', description: 'Authentication is required to make a payment.', variant: 'destructive'});
            return;
        }

        const userString = localStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : {};

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
            amount: banner.price,
            currency: "INR",
            name: "Gnetdial Ad Placement",
            description: `Payment for ${banner.duration}-day ${banner.place} banner`,
            order_id: banner.paymentOrderId,
            handler: async function (response: any) {
                const verificationResult = await verifyOfferBannerPayment(
                    banner._id,
                    response.razorpay_order_id,
                    response.razorpay_payment_id,
                    response.razorpay_signature,
                    token
                );
                
                if (verificationResult.success) {
                    toast({
                        title: "Payment Verified!",
                        description: verificationResult.message,
                    });
                    fetchBanners(); // Refresh the banner list
                } else {
                    toast({
                        title: "Payment Verification Failed",
                        description: verificationResult.message,
                        variant: "destructive",
                    });
                }
            },
            prefill: {
                name: user.name || "Gnetdial User",
                email: user.email || "",
                contact: user.phone || ""
            },
            theme: { color: "#10b981" }
        };
        
        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response: any){
            toast({
                title: "Payment Failed",
                description: response.error.description,
                variant: "destructive",
            });
        });
        
        rzp1.open();
    };

    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
            className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden"
        >
            <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-20 border-b border-gray-100">
                <div className="container mx-auto px-4 py-4 flex items-center gap-4">
                    <Link href={`/business-dashboard?id=${businessId}`}>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="ghost" size="icon">
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                        </motion.div>
                    </Link>
                    <h1 className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Manage Offer Banners</h1>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 py-6 relative z-10 space-y-12">
                <section>
                    <h2 className="text-2xl font-bold mb-4">My Offer Banners</h2>
                    {loading ? (
                        <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>
                    ) : banners.length === 0 ? (
                        <Card className="text-center p-8 bg-gray-50">
                            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="font-semibold">No purchased banners found.</h3>
                            <p className="text-sm text-gray-500">Purchase a banner placement from the <Link href="/advertise" className="text-primary hover:underline">Advertise</Link> page.</p>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {banners.map(banner => {
                                const status = getStatusInfo(banner);
                                return (
                                <Card key={banner._id} className="p-4 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                                            {banner.image ? 
                                              <Image src={banner.image} alt={banner.title || 'Banner'} width={80} height={48} className="object-cover rounded-md" /> :
                                              <ImageIcon className="w-6 h-6 text-gray-400" />
                                            }
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-semibold">{banner.title || 'Untitled Banner'}</p>
                                                <Badge variant="outline" className="capitalize">{banner.place}</Badge>
                                            </div>
                                             {banner.link && <Link href={banner.link} target="_blank" className="text-xs text-blue-600 hover:underline truncate block max-w-xs">{banner.link}</Link>}
                                            <p className="text-xs text-gray-500 mt-1">{banner.duration} days | Expires: {new Date(banner.endDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className={status.color}>{status.text}</Badge>
                                        {!banner.isPaid ? (
                                            <Button size="sm" onClick={() => handlePayNow(banner)}>
                                                <IndianRupee className="mr-2 h-4 w-4"/> Pay Now
                                            </Button>
                                        ) : !banner.isBannerUploaded ? (
                                            <Button size="sm" onClick={() => handleOpenDialog(banner)}>
                                                <UploadCloud className="mr-2 h-4 w-4"/> Upload Banner
                                            </Button>
                                        ) : (
                                            <>
                                                <Button size="sm" variant="outline" onClick={() => handleOpenDialog(banner)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button size="icon" variant="ghost" className="text-destructive">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete your banner and remove its data from our servers.
                                                        </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDeleteBanner(banner._id)}>
                                                            Delete
                                                        </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </>
                                        )}
                                    </div>
                                </Card>
                            )})}
                        </div>
                    )}
                </section>
            </main>
            
            <UploadBannerDialog
                isOpen={isUploadDialogOpen}
                onOpenChange={setIsUploadDialogOpen}
                banner={selectedBanner}
                onSuccess={fetchBanners}
            />
        </motion.div>
    );
}

export default function OffersPage() {
    return (
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin" /></div>}>
            <OffersPageComponent />
        </Suspense>
    );
}
