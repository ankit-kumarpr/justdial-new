
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, SearchX, Ticket, Trash2, MessageSquare, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { getMyTickets, deleteTicket, type Ticket } from '@/app/customer-service/actions';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/animations';
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
import { cn } from '@/lib/utils';
import { TicketDetailsDialog } from './TicketDetailsDialog';
import { UpdateTicketDialog } from './UpdateTicketDialog';

export function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);


  const fetchTickets = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }
    const { data, error } = await getMyTickets(token);
    if (error) {
      setError(error);
      if (error.toLowerCase().includes('token')) {
        toast({ title: "Session Expired", description: "Please log in again.", variant: 'destructive' });
        router.push('/login');
      }
    } else {
      setTickets(data || []);
    }
    setLoading(false);
  }, [router, toast]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleDelete = async (ticketId: string) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        toast({ title: 'Error', description: 'Authentication required.', variant: 'destructive' });
        return;
    }
    const result = await deleteTicket(ticketId, token);
    if (result.success) {
        toast({ title: 'Success', description: result.message });
        fetchTickets(); // Re-fetch tickets after deletion
    } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
    }
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
      case 'replied':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'closed':
      case 'solved':
        return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-red-50 rounded-lg">
        <SearchX className="h-16 w-16 text-red-400 mx-auto mb-4"/>
        <h3 className="text-xl font-semibold text-red-700">Failed to load tickets</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed">
        <Ticket className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
        <h3 className="text-xl font-semibold text-gray-700">No Tickets Found</h3>
        <p className="text-gray-500">You haven't created any support tickets yet.</p>
      </div>
    );
  }

  return (
    <>
    <motion.div
      className="space-y-4"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {tickets.map((ticket) => (
        <motion.div key={ticket._id} variants={fadeInUp}>
          <Card className="hover-lift p-4">
            <CardContent className="flex justify-between items-start p-0">
              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-lg">{ticket.subject}</h3>
                  <Badge className={cn("capitalize", getStatusClass(ticket.status))}>{ticket.status.replace('_', ' ')}</Badge>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 break-all">{ticket.description}</p>
                <p className="text-xs text-gray-400">Created: {new Date(ticket.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedTicketId(ticket._id)}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      View
                  </Button>
                   <Button variant="outline" size="sm" onClick={() => setEditingTicket(ticket)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </Button>
                  <AlertDialog>
                      <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-destructive hover:bg-destructive/10">
                              <Trash2 className="h-4 w-4" />
                          </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                          <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your support ticket.
                          </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(ticket._id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                      </AlertDialogContent>
                  </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
    <TicketDetailsDialog 
        isOpen={!!selectedTicketId}
        onOpenChange={(isOpen) => !isOpen && setSelectedTicketId(null)}
        ticketId={selectedTicketId}
    />
    <UpdateTicketDialog
      isOpen={!!editingTicket}
      onOpenChange={(isOpen) => !isOpen && setEditingTicket(null)}
      ticket={editingTicket}
      onSuccess={() => {
        setEditingTicket(null);
        fetchTickets();
      }}
    />
    </>
  );
}
