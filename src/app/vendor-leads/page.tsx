
'use client';

import { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext, PaginationEllipsis } from '@/components/ui/pagination';
import Image from 'next/image';
import { getVendorLeads } from './actions';
import type { Lead } from '@/lib/leads-data';
import { Phone, MessageSquare, Filter, BarChart, TrendingUp, User, Briefcase, BookOpen, Star, Camera, FileText, ChevronUp, ChevronDown, Loader2, SearchX, Check, X as XIcon, Calendar, MapPin, Search, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageTransition, staggerContainer, fadeInUp } from '@/lib/animations';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { DashboardHeader } from '@/components/justdial/your-dashboard/DashboardHeader';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { io } from "socket.io-client";

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

  useEffect(() => {
    const socket = io("https://mytestbackend-wq48.onrender.com", {
        transports: ['websocket']
    });

    function onConnect() {
        console.log("Socket connected:", socket.id);
        setLoading(false);
    }

    function onDisconnect() {
        console.log("Socket disconnected");
    }
    
    function onNewLead(newLead: Lead) {
        toast({
            title: "New Lead Received!",
            description: `A new lead for "${newLead.searchKeyword}" has arrived.`,
        });
        setLeads((prevLeads) => [newLead, ...prevLeads]);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('new-lead', onNewLead);

    return () => {
        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
        socket.off('new-lead', onNewLead);
        socket.disconnect();
    };
}, [toast]);


    const handleAcceptLead = (leadId: string) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: 900, // Amount in paise (9 INR)
      currency: "INR",
      name: "Gnetdial Lead Acceptance",
      description: `Payment for accepting lead #${leadId}`,
      handler: function (response: any) {
        toast({
            title: "Payment Successful!",
            description: `Payment ID: ${response.razorpay_payment_id}`,
        });
        // Update lead status to 'accepted'
        setLeads(prevLeads => 
            prevLeads.map(lead => 
                lead._id === leadId ? { ...lead, status: 'accepted' } : lead
            )
        );
      },
      prefill: {
        name: "Vendor Name", // Prefill with vendor's name
        email: "vendor@example.com", // Prefill with vendor's email
        contact: "9999999999" // Prefill with vendor's contact
      },
      theme: {
        color: "#3399cc"
      }
    };
    
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
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


  return (
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
              <Card className="p-4 shadow-lg hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-sm">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <Link href={`/vendor-leads?id=${businessId || ''}`} className="block p-2 border-r hover:bg-gray-50 rounded-md transition-colors">
                    <p className="text-3xl font-bold text-primary">{pagination.total > 0 ? pagination.total : leads.length}</p>
                    <p className="text-sm text-gray-500">Category Enquiries &gt;</p>
                  </Link>
                  <Link href={`/trends?id=${businessId || ''}`} className="block p-2 border-r hover:bg-gray-50 rounded-md transition-colors">
                    <TrendingUp className="mx-auto h-8 w-8 text-green-500 mb-1"/>
                    <p className="text-sm text-gray-500">Competition Trend &gt;</p>
                  </Link>
                  <Link href={`/business-dashboard?id=${businessId || ''}`} className="block p-2 border-r hover:bg-gray-50 rounded-md transition-colors">
                    <p className="text-3xl font-bold text-red-500">16% <span className="text-base font-normal">(Poor)</span></p>
                    <p className="text-sm text-gray-500">Profile Score &gt;</p>
                  </Link>
                  <Link href={`/business-dashboard?id=${businessId || ''}`} className="block p-2 hover:bg-gray-50 rounded-md transition-colors">
                    <Briefcase className="mx-auto h-8 w-8 text-blue-500 mb-1"/>
                    <p className="text-sm text-gray-500">Your Dashboard &gt;</p>
                  </Link>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="border-t mt-4 pt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                         <Link href={`/business-dashboard/photos-videos?id=${businessId || ''}`} className="block p-2 border-r hover:bg-gray-50 rounded-md transition-colors">
                            <p className="text-3xl font-bold text-primary">1</p>
                            <p className="text-sm text-gray-500">Photos &gt;</p>
                         </Link>
                         <Link href={`/questions?id=${businessId || ''}`} className=" block p-2 border-r hover:bg-gray-50 rounded-md transition-colors">
                            <MessageSquare className="mx-auto h-8 w-8 text-purple-500 mb-1"/>
                            <p className="text-sm text-gray-500">Reply to Questions &gt;</p>
                         </Link>
                         <Link href={`/reviews?id=${businessId || ''}`} className="block p-2 border-r hover:bg-gray-50 rounded-md transition-colors">
                            <Star className="mx-auto h-8 w-8 text-yellow-500 mb-1"/>
                            <p className="text-sm text-gray-500">Respond To Reviews &gt;</p>
                         </Link>
                         <Link href={`/passbook?id=${businessId || ''}`} className="block p-2 hover:bg-gray-50 rounded-md transition-colors">
                            <FileText className="mx-auto h-8 w-8 text-cyan-500 mb-1"/>
                            <p className="text-sm text-gray-500">Passbook &gt;</p>
                         </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="text-center mt-2">
                    <Button variant="link" className="text-sm text-primary" onClick={() => setIsExpanded(!isExpanded)}>
                      {isExpanded ? 'View Less' : 'View More'}
                      {isExpanded ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                    </Button>
                </div>
              </Card>
          </motion.div>

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
                <Card key={lead._id} className="p-6 shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden relative">
                    <div className={cn("absolute top-0 left-0 h-full w-1.5", getStatusClass(lead.status).split(' ')[0])}></div>
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
                                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                            <MapPin className="h-4 w-4" />
                                            {lead.userLocation.city}
                                        </p>
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
                           

                            {lead.status === 'pending' ? (
                                <div className="flex flex-col items-center justify-center h-full w-full">
                                    <div className="flex gap-2 w-full">
                                        <Button variant="destructive" className="flex-1"><XIcon className="mr-1 h-4 w-4"/>Reject</Button>
                                        <Button onClick={() => handleAcceptLead(lead._id)} className="bg-green-600 hover:bg-green-700 flex-1"><Check className="mr-1 h-4 w-4"/>Accept</Button>
                                    </div>
                                    <p className="text-xs text-center mt-2 text-gray-500">Pay ₹9 to accept this lead.</p>
                                </div>
                            ) : (
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <Button variant="outline" className="flex-1"><Phone className="mr-1 h-4 w-4"/> Call</Button>
                                    <Button variant="outline" className="flex-1"><MessageSquare className="mr-1 h-4 w-4"/> Chat</Button>
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
  );
}

export default function Page() {
  return (
    <Suspense>
      <VendorLeadsPageComponent />
    </Suspense>
  )
}
