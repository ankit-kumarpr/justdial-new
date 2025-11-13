
'use client';

import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Loader2, Ticket, FileText, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { getAllTickets } from "./actions";
import { markTicketAsSolved, type Ticket } from "@/app/customer-service/actions";
import { cn } from "@/lib/utils";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { TicketDetailsDialog } from "@/components/customer-service/TicketDetailsDialog";


const TicketTable = ({ tickets, onUpdate }: { tickets: Ticket[], onUpdate: () => void }) => {
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
    const { toast } = useToast();
    
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
    
    const handleMarkAsSolved = async (ticketId: string) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast({ title: 'Error', description: 'Authentication required.', variant: 'destructive' });
            return;
        }
        const result = await markTicketAsSolved(ticketId, token);
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            onUpdate();
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    };

    return (
        <>
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Subject</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tickets.length > 0 ? tickets.map(ticket => (
                            <TableRow key={ticket._id}>
                                <TableCell className="font-medium">{ticket.subject}</TableCell>
                                <TableCell>{ticket.createdBy.name}</TableCell>
                                <TableCell>
                                    <Badge className={cn("capitalize", getStatusClass(ticket.status))}>
                                        {ticket.status.replace('_', ' ')}
                                    </Badge>
                                </TableCell>
                                <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => setSelectedTicketId(ticket._id)}>
                                                <FileText className="mr-2 h-4 w-4" />
                                                View Details
                                            </DropdownMenuItem>
                                             {ticket.status !== 'solved' && ticket.status !== 'closed' && (
                                                <DropdownMenuItem onClick={() => handleMarkAsSolved(ticket._id)}>
                                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                                    Mark as Solved
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24">No tickets in this category.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {selectedTicketId && (
                <TicketDetailsDialog 
                    isOpen={!!selectedTicketId}
                    onOpenChange={(isOpen) => !isOpen && setSelectedTicketId(null)}
                    ticketId={selectedTicketId}
                    onUpdate={onUpdate}
                />
            )}
        </>
    );
};


export default function ManageTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast({ title: "Error", description: "You must be logged in.", variant: 'destructive'});
      router.push('/login');
      return;
    }
    const { data, error } = await getAllTickets(token);
    if (error) {
      toast({ title: "Error", description: `Failed to fetch tickets: ${error}`, variant: 'destructive'});
    } else {
      setTickets(data || []);
    }
    setLoading(false);
  }, [router, toast]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);
  
  const getTicketsByStatus = (status: string | string[]) => {
      const statuses = Array.isArray(status) ? status : [status];
      return tickets.filter(t => statuses.includes(t.status));
  }

  return (
    <main className="p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Ticket /> Manage Support Tickets</CardTitle>
          <CardDescription>View, manage, and respond to all user support tickets.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Tabs defaultValue="open">
                <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
                    <TabsTrigger value="open">Open ({getTicketsByStatus(['open', 'replied']).length})</TabsTrigger>
                    <TabsTrigger value="closed">Closed ({getTicketsByStatus(['closed', 'solved']).length})</TabsTrigger>
                    <TabsTrigger value="all">All ({tickets.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="open" className="mt-4">
                    <TicketTable tickets={getTicketsByStatus(['open', 'replied'])} onUpdate={fetchTickets} />
                </TabsContent>
                <TabsContent value="closed" className="mt-4">
                    <TicketTable tickets={getTicketsByStatus(['closed', 'solved'])} onUpdate={fetchTickets} />
                </TabsContent>
                 <TabsContent value="all" className="mt-4">
                    <TicketTable tickets={tickets} onUpdate={fetchTickets} />
                </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
