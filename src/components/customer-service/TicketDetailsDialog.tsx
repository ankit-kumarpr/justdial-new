
'use client';

import { useState, useEffect, useActionState, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Image as ImageIcon, Paperclip, Send, User, UserCog } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getSingleTicket, replyToTicket, adminReplyToTicket, type Ticket, type ReplyState } from '@/app/customer-service/actions';
import Image from "next/image";
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Textarea } from '../ui/textarea';

type TicketDetailsDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  ticketId: string | null;
  onUpdate: () => void;
};

const DetailItem = ({ label, value }: { label: string, value?: string }) => (
    value ? <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-sm break-all">{value}</p>
    </div> : null
);

export function TicketDetailsDialog({ isOpen, onOpenChange, ticketId, onUpdate }: TicketDetailsDialogProps) {
  const { toast } = useToast();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<'user' | 'admin' | 'superadmin' | null>(null);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const replyFormRef = useRef<HTMLFormElement>(null);
  const lastReplyMessageRef = useRef<string | null>();

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const user = localStorage.getItem('user');
        if (user) {
            try {
                setUserRole(JSON.parse(user).role);
            } catch (e) {
                console.error("Failed to parse user role:", e);
            }
        }
    }
  }, [isOpen]);

  const initialState: ReplyState = {};
  const isAdmin = userRole === 'admin' || userRole === 'superadmin';
  const action = ticket ? (isAdmin ? adminReplyToTicket.bind(null, ticket._id) : replyToTicket.bind(null, ticket._id)) : async () => initialState;
  const [replyState, replyFormAction, isReplyPending] = useActionState(action, initialState);

  const fetchTicket = useCallback(async (id: string) => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast({ title: 'Error', description: 'Authentication required.', variant: 'destructive' });
      onOpenChange(false);
      return;
    }
    const { data, error } = await getSingleTicket(id, token);
    if (error) {
      toast({ title: 'Error', description: `Failed to fetch ticket details: ${error}`, variant: 'destructive' });
      onOpenChange(false);
    } else {
      setTicket(data);
    }
    setLoading(false);
  }, [onOpenChange, toast]);
  
  useEffect(() => {
    if (isOpen && ticketId) {
      fetchTicket(ticketId);
    } else {
      setTicket(null); // Clear ticket data when dialog closes
    }
  }, [isOpen, ticketId, fetchTicket]);

  useEffect(() => {
    if (replyState.message && replyState.message !== lastReplyMessageRef.current) {
        lastReplyMessageRef.current = replyState.message;
        if (replyState.success) {
            toast({ title: "Success!", description: replyState.message });
            replyFormRef.current?.reset();
            onUpdate(); // Notify parent to refetch ticket list
            if (ticketId) fetchTicket(ticketId); // Re-fetch ticket to show new reply
        } else {
            toast({ title: "Reply Failed", description: replyState.message, variant: 'destructive' });
        }
    }
  }, [replyState, toast, ticketId, fetchTicket, onUpdate]);

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

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return null;
    return imagePath.startsWith('http') ? imagePath : `${apiBaseUrl}${imagePath}`;
  };

  const getReplyAuthor = (reply: any) => {
    if (reply.repliedBy) return reply.repliedBy;
    if (reply.user) return reply.user;
    return { name: 'Unknown', role: 'user' };
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="truncate">Ticket Details</DialogTitle>
          <DialogDescription>
            Viewing details for ticket ID: <span className="font-mono text-xs bg-gray-100 p-1 rounded">{ticket?._id}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full pr-6">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : ticket ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem label="Subject" value={ticket.subject} />
                  <div className="flex items-center gap-2">
                    <DetailItem label="Status" value="" />
                    <Badge className={cn("capitalize text-sm", getStatusClass(ticket.status))}>{ticket.status.replace('_', ' ')}</Badge>
                  </div>
                </div>
                <DetailItem label="Description" value={ticket.description} />
                
                {ticket.image && (
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Attached Image</p>
                    <div className="relative w-full aspect-video rounded-md overflow-hidden border">
                      <Image src={getImageUrl(ticket.image)!} alt="Ticket attachment" layout="fill" objectFit="contain" />
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="font-semibold text-lg border-b pb-2 mb-4">Replies</h3>
                  <div className="space-y-4">
                    {ticket.replies && ticket.replies.length > 0 ? ticket.replies.map(reply => {
                      const author = getReplyAuthor(reply);
                      const replyUserRole = author.role || (reply.isAdminReply ? 'admin' : 'user');
                      const isAuthorAdmin = replyUserRole === 'admin' || replyUserRole === 'superadmin';
                      const isMyReply = isAuthorAdmin === isAdmin;

                      return (
                        <div key={reply._id} className={cn("flex gap-3", isMyReply ? 'justify-end' : '')}>
                            {!isMyReply && (
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                    {isAuthorAdmin ? <UserCog className="h-5 w-5 text-gray-600"/> : <User className="h-5 w-5 text-gray-600"/>}
                                </div>
                            )}
                             <div className={cn(
                                "p-3 rounded-lg max-w-sm",
                                isMyReply ? 'bg-primary text-primary-foreground' : 'bg-gray-100'
                             )}>
                                <p className="text-sm">{reply.replyText}</p>
                                <p className={cn("text-xs mt-1", isMyReply ? 'text-primary-foreground/80' : 'text-gray-500')}>
                                    {author.name} - {new Date(reply.repliedAt).toLocaleString()}
                                </p>
                            </div>
                            {isMyReply && (
                                <div className="h-8 w-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center flex-shrink-0">
                                     {isAuthorAdmin ? <UserCog className="h-5 w-5"/> : <User className="h-5 w-5"/>}
                                </div>
                            )}
                        </div>
                      )
                    }) : (
                        <p className="text-sm text-gray-500 text-center py-4">No replies yet.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-10">Could not load ticket details.</p>
            )}
          </ScrollArea>
        </div>

        {ticket && !['closed', 'solved'].includes(ticket.status) && (
             <DialogFooter className="border-t p-4 flex flex-col md:flex-row gap-2">
                <form action={replyFormAction} className="w-full flex items-center gap-2" ref={replyFormRef}>
                  <input type="hidden" name="token" value={typeof window !== 'undefined' ? localStorage.getItem('accessToken') || '' : ''} />
                  <Textarea name="replyText" placeholder="Type your reply..." className="flex-1" rows={1} />
                  <Button type="submit" disabled={isReplyPending}>
                    {isReplyPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Send className="mr-2 h-4 w-4" />
                    Reply
                  </Button>
                </form>
             </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
