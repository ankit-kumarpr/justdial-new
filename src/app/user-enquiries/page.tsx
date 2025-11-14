
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, fadeInUp } from '@/lib/animations';
import { FloatingButtons } from '@/components/justdial/FloatingButtons';
import { Filter, Users, Loader2, SearchX, Briefcase, Calendar } from 'lucide-react';
import { JustdialHeader } from '@/components/justdial/JustdialHeader';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { getMyLeads } from './actions';
import type { Lead, VendorResponse } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { ViewResponsesDialog } from '@/components/user-enquiries/ViewResponsesDialog';

const ITEMS_PER_PAGE = 5;

export default function UserEnquiriesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeadResponses, setSelectedLeadResponses] = useState<VendorResponse[] | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const fetchLeads = useCallback(async (page: number, filterValue: string) => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const { data, error } = await getMyLeads(token, page, filterValue);
      if (error) {
        throw new Error(error);
      }
      setLeads(data?.leads || []);
      setPagination(data?.pagination || { total: 0, page: 1, pages: 1 });
    } catch (e) {
      const errorMessage = (e as Error).message;
      setError(errorMessage);
      if (errorMessage.includes('token')) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchLeads(currentPage, filter);
  }, [fetchLeads, currentPage, filter]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.pages) {
      setCurrentPage(page);
    }
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    setCurrentPage(1); // Reset to first page on filter change
  };
  
  const handleViewResponses = (responses: VendorResponse[]) => {
    setSelectedLeadResponses(responses);
  };
  
  const renderPaginationItems = () => {
    const pageNumbers = [];
    const maxPagesToShow = 3;

    if (pagination.pages <= maxPagesToShow + 2) {
      for (let i = 1; i <= pagination.pages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= maxPagesToShow) {
        for (let i = 1; i <= maxPagesToShow + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(-1);
        pageNumbers.push(pagination.pages);
      } else if (currentPage > pagination.pages - maxPagesToShow) {
        pageNumbers.push(1);
        pageNumbers.push(-1);
        for (let i = pagination.pages - maxPagesToShow; i <= pagination.pages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push(-1);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(-1);
        pageNumbers.push(pagination.pages);
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

  const renderStatus = (lead: Lead) => {
    if (lead.status === 'in-progress') {
        return <Button onClick={() => handleViewResponses(lead.responses)}>View Responses</Button>;
    } else if (lead.status === 'pending') {
        return <Badge variant="secondary">Awaiting Responses</Badge>;
    } else if (lead.status === 'cancelled') {
        return <Badge variant="destructive">Cancelled</Badge>;
    } else {
        return <Badge variant="outline" className="capitalize">{lead.status}</Badge>;
    }
  };


  return (
    <>
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
              <p className="text-sm text-gray-600">{loading ? 'Loading...' : `${pagination.total} total enquiries submitted`}</p>
            </div>
          </div>
          <div className="w-48">
            <Select value={filter} onValueChange={handleFilterChange}>
              <SelectTrigger className="bg-white/80 backdrop-blur-sm shadow-md">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">Accepted</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
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
                <p className="text-gray-500">You haven't submitted any enquiries with this status yet.</p>
            </div>
        ) : (
            <>
                <motion.div 
                    className="space-y-6"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    {leads.map((lead) => (
                        <motion.div
                            key={lead._id}
                            variants={fadeInUp}
                        >
                            <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all hover-lift border-0 overflow-hidden relative" data-testid={`enquiry-card-${lead._id}`}>
                                <div className={`absolute top-0 left-0 h-full w-1.5 ${lead.status === 'pending' ? 'bg-yellow-400' : lead.status === 'in-progress' ? 'bg-green-500' : lead.status === 'cancelled' ? 'bg-red-500' : 'bg-gray-400'}`}></div>
                                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                    <div className="flex-1 space-y-3 ml-1.5">
                                        <div className="flex items-center gap-3">
                                            <Briefcase className="h-5 w-5 text-primary"/>
                                            <p className="font-bold text-gray-800 text-lg">Looking for: {lead.searchKeyword}</p>
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed pl-8 break-all line-clamp-2">{lead.description}</p>
                                        <div className="flex items-center gap-3 text-xs text-gray-500 pl-8">
                                            <Calendar className="h-4 w-4"/>
                                            <span>{new Date(lead.createdAt).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
                                        {renderStatus(lead)}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {pagination.pages > 1 && (
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
                )}
            </>
        )}
      </main>
    </motion.div>
    <ViewResponsesDialog
        isOpen={!!selectedLeadResponses}
        onClose={() => setSelectedLeadResponses(null)}
        responses={selectedLeadResponses || []}
    />
    </>
  );
}
