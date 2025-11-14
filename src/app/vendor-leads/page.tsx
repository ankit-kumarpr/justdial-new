
'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext, PaginationEllipsis } from '@/components/ui/pagination';
import Image from 'next/image';
import { getVendorLeads, createLeadPaymentOrder, verifyLeadPayment } from './actions';
import type { Lead } from '@/lib/types';
import { Phone, MessageSquare, Filter, BarChart, TrendingUp, User, Briefcase, BookOpen, Star, Camera, FileText, ChevronUp, ChevronDown, Loader2, SearchX, Check, X as XIcon, Calendar, MapPin, Search, Lock, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageTransition, staggerContainer, fadeInUp } from '@/lib/animations';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { DashboardHeader } from '@/components/justdial/your-dashboard/DashboardHeader';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { io, Socket } from "socket.io-client";
import Script from 'next/script';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

const ITEMS_PER_PAGE = 5;

function VendorLeadsPageComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const businessId = searchParams.get('id');

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentMessageIndex(prevIndex => (prevIndex + 1) % dynamicMessages.length);
    }, 3000); // Change message every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    if (!token) {
        router.push('/login');
        return;
    }

    try {
        const { data, error } = await getVendorLeads(token);
        if (error) {
            throw new Error(error);
        }
        setLeads(data?.leads || []);
        setPagination(data?.pagination || { total: 0, page: 1, pages: 0 });
    } catch (e) {
        setError((e as Error).message);
        if ((e as Error).message.includes('token')) {
            toast({ title: "Session Expired", description: "Please log in again.", variant: "destructive" });
            router.push('/login');
        }
    } finally {
        setLoading(false);
    }
  }, [router, toast]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleAcceptLead = async (lead: Lead) => {
    const leadResponseId = lead.leadResponseId;
    if (!leadResponseId) {
        toast({ title: 'Error', description: 'Cannot accept lead, ID is missing.', variant: 'destructive' });
        return;
    }
    const token = localStorage.getItem('accessToken');
    const userJson = localStorage.getItem('user');

    if (!token || !userJson) {
      toast({ title: 'Authentication Error', description: 'Please log in to accept leads.', variant: 'destructive' });
      router.push('/login');
      return;
    }
    
    const user = JSON.parse(userJson);

    try {
        const { order, error } = await createLeadPaymentOrder(leadResponseId, token);
        if (error || !order) {
            throw new Error(error || "Failed to create payment order.");
        }

        const options = {
            key: order.razorpayKeyId,
            amount: order.amount,
            currency: order.currency,
            name: "Gnetdial Lead Acceptance",
            description: `Payment for lead: ${order.leadDetails.keyword}`,
            order_id: order.orderId,
            handler: async function (response: any) {
                const verificationResult = await verifyLeadPayment(
                    leadResponseId,
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
                     const socket = io("https://mytestbackend-wq48.onrender.com", {
                        auth: { token },
                        transports: ["websocket"],
                    });
                    socket.emit("lead_accepted", { leadResponseId });
                    socket.disconnect();
                    
                    setLeads(prevLeads =>
                        prevLeads.map(l =>
                            l.leadResponseId === leadResponseId ? { ...l, status: 'accepted', user: order.leadDetails.user } : l
                        )
                    );
                } else {
                     toast({
                        title: "Payment Verification Failed",
                        description: verificationResult.message,
                        variant: "destructive",
                    });
                }
            },
            prefill: { name: user.name, email: user.email, contact: user.phone },
            theme: { color: "#3399cc" }
        };
        
        const rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', (response: any) => toast({ title: "Payment Failed", description: response.error.description, variant: "destructive" }));
        rzp1.open();

    } catch (e) {
        toast({
            title: "Error",
            description: (e as Error).message,
            variant: "destructive",
        });
    }
  };

  const totalPages = pagination.pages > 0 ? pagination.pages : Math.ceil(leads.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const paginatedLeads = leads.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const renderPaginationItems = () => {
    const pageNumbers = [];
    const maxPagesToShow = 3;

    if (totalPages <= maxPagesToShow + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= maxPagesToShow) {
        for (let i = 1; i <= maxPagesToShow + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(-1);
        pageNumbers.push(totalPages);
      } else if (currentPage > totalPages - maxPagesToShow) {
        pageNumbers.push(1);
        pageNumbers.push(-1);
        for (let i = totalPages - maxPagesToShow; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push(-1);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(-1);
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers.map((page, index) =>
      page === -1 ? (
        <PaginationItem key={`ellipsis-${index}`}>
          <PaginationEllipsis />
        </PaginationItem>
      ) : (
        <PaginationItem key={page}>
          <PaginationLink
            href="#"
            isActive={currentPage === page}
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(page);
            }}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      )
    );
  };
  
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const dynamicMessages = [
    { text: "Vendors Await", color: "text-primary" },
    { text: "Quick Responses", color: "text-green-600" },
    { text: "Best Prices", color: "text-accent" },
    { text: "Trusted Pros", color: "text-blue-600" }
  ];


  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
        className="bg-gray-100 min-h-screen"
      >
        <DashboardHeader title="My Leads" />

        <main className="container mx-auto px-4 py-6">
          <motion.div
            className="space-y-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeInUp}>
              <Carousel>
                <CarouselContent>
                  <CarouselItem>
                    <div className="relative w-full aspect-[16/4] rounded-lg overflow-hidden">
                      <Image src={findImage('runtime-omni')!} alt="National Omni" fill className="object-cover" data-ai-hint="network nodes" />
                      <div className="absolute inset-0 bg-black/30 flex flex-col justify-center p-8 text-white">
                          <h3 className="font-bold text-xl">National-Omni</h3>
                          <p className="text-sm max-w-sm">Expand your business nationwide with our Omni platform.</p>
                          <Button size="sm" className="mt-4 w-fit bg-teal-500 hover:bg-teal-600">Learn More &gt;</Button>
                      </div>
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                      <div className="relative w-full aspect-[16/4] rounded-lg overflow-hidden">
                        <Image src={findImage('leads-business-performance')!} alt="Business Performance" fill className="object-cover" data-ai-hint="business chart"/>
                        <div className="absolute inset-0 bg-black/30 flex flex-col justify-center p-8 text-white">
                            <h3 className="font-bold text-xl">Boost Performance</h3>
                            <p className="text-sm max-w-sm">Upgrade your plan to unlock powerful business analytics.</p>
                            <Button size="sm" className="mt-4 w-fit bg-blue-500 hover:bg-blue-600">Upgrade Now &gt;</Button>
                        </div>
                      </div>
                  </CarouselItem>
                </CarouselContent>
              </Carousel>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Recent Enquiries</h2>
                <Button variant="link" className="text-sm text-primary">View all &gt;</Button>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-4">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="text-center py-20 bg-red-50 rounded-lg">
                  <SearchX className="h-16 w-16 text-red-400 mx-auto mb-4"/>
                  <h3 className="text-xl font-semibold text-red-700">Failed to load enquiries</h3>
                  <p className="text-red-600">{error}</p>
                </div>
              ) : paginatedLeads.length > 0 ? (
                paginatedLeads.map(lead => (
                  <Card key={lead.leadResponseId} className="p-6 shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden relative">
                      <div className={cn("absolute top-0 left-0 h-full w-1.5", getStatusClass(lead.status))}></div>
                      <div className="flex flex-col sm:flex-row items-start gap-6 ml-1.5">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                              <div className="flex justify-between items-start">
                                  {lead.status === 'pending' ? (
                                      <div className="relative">
                                        <div className="flex items-center gap-2 filter blur-sm select-none">
                                            <div>
                                                <p className="font-bold text-gray-800 text-lg">Hidden User</p>
                                                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                    <MapPin className="h-4 w-4" />
                                                    Hidden Location
                                                </p>
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                              <p className="text-xs font-semibold text-gray-600 bg-gray-200/80 px-2 py-1 rounded-full backdrop-blur-sm">Accept lead to view details</p>
                                          </div>
                                      </div>
                                  ) : (
                                      <div>
                                          <p className="font-bold text-gray-800 text-lg">{lead.user.name}</p>
                                          <div className="text-sm text-gray-500 mt-1 space-y-1">
                                            <p className="flex items-center gap-1"><MapPin className="h-4 w-4" />{lead.userLocation.city}</p>
                                            {lead.user.email && <p className="flex items-center gap-1"><Mail className="h-4 w-4" />{lead.user.email}</p>}
                                            {lead.user.phone && <p className="flex items-center gap-1"><Phone className="h-4 w-4" />{lead.user.phone}</p>}
                                          </div>
                                      </div>
                                  )}
                                  <Badge className={cn("capitalize", getStatusClass(lead.status))}>
                                      {lead.status}
                                  </Badge>
                              </div>
                              <div className="mt-3 p-4 bg-gray-50 rounded-lg border">
                                  <p className="font-semibold text-sm text-gray-700">Wants: {lead.searchKeyword}</p>
                                  <p className="text-sm text-gray-600 mt-1">{lead.description}</p>
                              </div>
                              <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(lead.createdAt).toLocaleString()}
                              </p>
                          </div>
                          <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto self-stretch sm:justify-between pt-2">
                            
                              {lead.status === 'pending' && (
                                  <div className="flex flex-col items-center justify-center h-full w-full">
                                      <div className="flex gap-2 w-full">
                                          <Button variant="destructive" className="flex-1"><XIcon className="mr-1 h-4 w-4"/>Reject</Button>
                                          <Button onClick={() => handleAcceptLead(lead)} className="bg-green-600 hover:bg-green-700 flex-1"><Check className="mr-1 h-4 w-4"/>Accept</Button>
                                      </div>
                                      <p className="text-xs text-center mt-2 text-gray-500">Pay to accept this lead.</p>
                                  </div>
                              )}
                          </div>
                      </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                  <SearchX className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
                  <h3 className="text-xl font-semibold text-gray-700">No Recent Enquiries</h3>
                  <p className="text-gray-500">New leads for your business will appear here.</p>
                </div>
              )}
            </motion.div>

            {!loading && !error && leads.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" onClick={(e) => {e.preventDefault(); handlePageChange(currentPage - 1);}} />
                    </PaginationItem>
                    {renderPaginationItems()}
                    <PaginationItem>
                      <PaginationNext href="#" onClick={(e) => {e.preventDefault(); handlePageChange(currentPage + 1);}} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </motion.div>
            )}
          </motion.div>
        </main>
      </motion.div>
    </>
  );
}

export default function Page() {
  return (
    <Suspense>
      <VendorLeadsPageComponent />
    </Suspense>
  )
}
