
'use client';

import { JustdialHeader } from "@/components/justdial/JustdialHeader";
import { JustdialFooter } from "@/components/justdial/JustdialFooter";
import { FloatingButtons } from "@/components/justdial/FloatingButtons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, BarChart, TrendingUp, Users, Star, Briefcase, Loader2, SearchX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, fadeInUp } from '@/lib/animations';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect, useCallback } from 'react';
import { Progress } from "@/components/ui/progress";
import { getVendorsForUser, getVendorStatus } from './actions';
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

type Vendor = {
  id: string;
  businessName: string;
  city: string;
  state: string;
  profileImage?: string; // Add this field
  [key: string]: any;
};

export default function MyBusinessPage() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    const fetchAndRoute = useCallback(async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
            return;
        }

        const { businessCount, singleBusinessId, error: statusError } = await getVendorStatus(token);

        if (statusError) {
             toast({ title: "Error", description: "Could not verify your business status.", variant: "destructive" });
             setError(statusError);
             setLoading(false);
             return;
        }

        if (businessCount === 1 && singleBusinessId) {
            router.replace(`/business-dashboard?id=${singleBusinessId}`);
            return; // Redirect and skip fetching the list
        }

        const { data, error: fetchError } = await getVendorsForUser(token);

        if (fetchError) {
            setError(fetchError);
            if (fetchError.toLowerCase().includes('token')) {
                toast({ title: "Session Expired", description: "Please log in again.", variant: "destructive" });
                router.push('/login');
            } else {
                toast({ title: "Error", description: "Could not load your businesses.", variant: "destructive" });
            }
        } else {
            setVendors(data || []);
        }
        setLoading(false);
    }, [router, toast]);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            fetchAndRoute();
        } else {
            router.push('/login');
        }
    }, [fetchAndRoute, router]);
    
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
            
            <section className="relative bg-gradient-to-br from-primary/5 via-accent/5 to-background pt-28 pb-16 overflow-hidden">
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

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                      initial={{ opacity: 0, y: -30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gradient-animated mb-2">
                                    My Businesses
                                </h1>
                                <p className="text-lg text-muted-foreground">
                                    Manage and grow your business presence
                                </p>
                            </div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg" data-testid="add-business-btn" asChild>
                                    <Link href="/free-listing">
                                        <Plus className="mr-2 h-5 w-5" />
                                        Add New Business
                                    </Link>
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
                    <svg className="relative block w-full h-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
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

            <main className="container mx-auto px-4 py-12">
                <div className="-mt-24">
                  {loading && <div className="flex justify-center items-center py-20"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}
                  {!loading && error && !error.toLowerCase().includes('token') && (
                     <div className="text-center py-20 bg-red-50 rounded-lg">
                        <SearchX className="h-16 w-16 text-red-400 mx-auto mb-4"/>
                        <h3 className="text-xl font-semibold text-red-700">Failed to load businesses</h3>
                        <p className="text-red-600">{error}</p>
                    </div>
                  )}
                  {!loading && !error && vendors.length > 0 && (
                      <motion.div 
                        className="space-y-6"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                      >
                          {vendors.map(vendor => {
                              const profileScore = 16; // Static score for now
                              return (
                                  <motion.div key={vendor.id} variants={fadeInUp}>
                                      <Card className="shadow-lg border-border/50 backdrop-blur-sm bg-white/80 p-6 flex flex-col md:flex-row items-center gap-6">
                                          <div className="flex items-center gap-6 flex-1">
                                              <div className="relative w-24 h-24 rounded-lg overflow-hidden shadow-md flex-shrink-0">
                                                  <Image 
                                                      src={vendor.profileImage || findImage('business-profile-image')} 
                                                      alt={`${vendor.businessName} profile`}
                                                      fill
                                                      className="object-cover"
                                                      data-ai-hint="office building"
                                                  />
                                              </div>
                                              <div>
                                                  <h2 className="text-xl font-bold">{vendor.businessName}</h2>
                                                  <p className="text-sm text-muted-foreground">{vendor.city}, {vendor.state}</p>
                                                  <div className="flex flex-wrap gap-2 mt-4">
                                                      <Button size="sm" className="bg-primary hover:bg-primary/90">Advertise Now</Button>
                                                      <Button size="sm" variant="outline" asChild>
                                                          <Link href={`/business-dashboard?id=${vendor.id}`}>Manage Business</Link>
                                                      </Button>
                                                      <Button size="sm" variant="outline">
                                                          Upload Catalogue <Badge className="ml-2 bg-green-100 text-green-700">FREE</Badge>
                                                      </Button>
                                                  </div>
                                              </div>
                                          </div>
                                          <div className="flex-shrink-0 w-full md:w-64">
                                              <Card className="bg-pink-50/50 border-pink-200">
                                                  <CardContent className="p-4 text-center">
                                                      <h3 className="font-semibold text-sm mb-2">Business Profile Score</h3>
                                                      <div className="relative w-24 h-24 mx-auto">
                                                          <svg viewBox="0 0 36 36" className="w-full h-full">
                                                              <path
                                                                  className="text-gray-200"
                                                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                                  fill="none"
                                                                  stroke="currentColor"
                                                                  strokeWidth="3"
                                                              />
                                                              <path
                                                                  className="text-red-500"
                                                                  strokeDasharray={`${profileScore}, 100`}
                                                                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                                  fill="none"
                                                                  stroke="currentColor"
                                                                  strokeWidth="3"
                                                                  strokeLinecap="round"
                                                              />
                                                          </svg>
                                                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                              <span className="text-2xl font-bold">{profileScore}%</span>
                                                              <span className="text-xs text-red-600 font-medium">Poor</span>
                                                          </div>
                                                      </div>
                                                      <Button variant="link" className="text-sm p-0 h-auto mt-2">Increase Score</Button>
                                                  </CardContent>
                                              </Card>
                                          </div>
                                      </Card>
                                  </motion.div>
                              )
                          })}
                      </motion.div>
                  )}
                   {!loading && !error && vendors.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center bg-white p-12 rounded-2xl shadow-xl"
                        >
                            <Briefcase className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <h2 className="text-2xl font-bold mb-2">No Businesses Found</h2>
                            <p className="text-muted-foreground mb-6">You haven't added any businesses yet. Get started now!</p>
                            <Button asChild size="lg">
                                <Link href="/free-listing">
                                    <Plus className="mr-2 h-5 w-5"/>
                                    Add Your First Business
                                </Link>
                            </Button>
                        </motion.div>
                   )}
                </div>
            </main>
            
            <JustdialFooter />
        </motion.div>
    );
}
