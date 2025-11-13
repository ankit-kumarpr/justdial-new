
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext, PaginationEllipsis } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem, fadeInUp } from '@/lib/animations';
import { FloatingButtons } from '@/components/justdial/FloatingButtons';
import { Filter, Users, Loader2, SearchX, Briefcase, Calendar, CheckCircle } from 'lucide-react';
import { JustdialHeader } from '@/components/justdial/JustdialHeader';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

const ITEMS_PER_PAGE = 5;

type Lead = {
    _id: string;
    searchKeyword: string;
    description: string;
    status: string;
    createdAt: string;
    userLocation: {
        city: string;
        address?: string;
    };
    totalVendorsNotified: number;
    totalAccepted: number;
};

const dynamicMessages = [
    { text: "Vendors Await", color: "text-primary" },
    { text: "Quick Responses", color: "text-green-600" },
    { text: "Best Prices", color: "text-accent" },
    { text: "Trusted Pros", color: "text-blue-600" }
];

export default function UserEnquiriesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentMessageIndex(prevIndex => (prevIndex + 1) % dynamicMessages.length);
    }, 3000); // Change message every 3 seconds

    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const fetchLeads = async () => {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await fetch('/api/user-leads', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Failed to fetch enquiries.');
            }
            setLeads(result.data?.leads || []);
        } catch (e) {
            setError((e as Error).message);
            if((e as Error).message.includes('token')) {
                router.push('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    fetchLeads();
  }, [router]);


  const totalPages = Math.ceil(leads.length / ITEMS_PER_PAGE);

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

      <main className="container mx-auto px-4 py-6 relative z-10 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-between items-center mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Enquiries</h1>
              <p className="text-sm text-gray-600">{loading ? 'Loading...' : `${leads.length} total enquiries submitted`}</p>
            </div>
          </div>
          <div className="w-48">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="bg-white/80 backdrop-blur-sm shadow-md">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter enquiries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Enquiries</SelectItem>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {loading ? (
             <div className="flex justify-center py-20"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>
        ) : error ? (
            <div className="text-center py-20 bg-red-50 rounded-lg">
                <SearchX className="h-16 w-16 text-red-400 mx-auto mb-4"/>
                <h3 className="text-xl font-semibold text-red-700">Failed to load enquiries</h3>
                <p className="text-red-600">{error}</p>
            </div>
        ) : leads.length === 0 ? (
            <div className="text-center py-20 bg-gray-100 rounded-lg">
                <SearchX className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
                <h3 className="text-xl font-semibold text-gray-700">No Enquiries Found</h3>
                <p className="text-gray-500">You haven't submitted any enquiries yet.</p>
            </div>
        ) : (
            <>
                <motion.div 
                    className="space-y-6"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    {paginatedLeads.map((lead, index) => (
                        <motion.div
                            key={lead._id}
                            variants={fadeInUp}
                        >
                            <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all hover-lift border-0 overflow-hidden relative" data-testid={`enquiry-card-${lead._id}`}>
                                <div className="absolute top-0 left-0 h-full w-1.5 bg-gradient-to-b from-primary to-accent"></div>
                                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Briefcase className="h-5 w-5 text-primary"/>
                                            <p className="font-bold text-gray-800 text-lg">Looking for: {lead.searchKeyword}</p>
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed pl-8 line-clamp-2">{lead.description}</p>
                                        <div className="flex items-center gap-3 text-xs text-gray-500 pl-8">
                                            <Calendar className="h-4 w-4"/>
                                            <span>{new Date(lead.createdAt).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
                                        <div className="text-sm text-gray-600 text-left md:text-right h-12 flex items-center">
                                            <AnimatePresence mode="wait">
                                                <motion.p
                                                    key={currentMessageIndex}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.5 }}
                                                    className={`font-semibold text-lg ${dynamicMessages[currentMessageIndex].color}`}
                                                >
                                                    {dynamicMessages[currentMessageIndex].text}
                                                </motion.p>
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-8"
                >
                <Pagination>
                    <PaginationContent className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-2">
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
            </>
        )}
      </main>
    </motion.div>
  );
}
