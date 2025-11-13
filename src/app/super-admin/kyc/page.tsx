
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
import { MoreHorizontal, Loader2, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { updateKycStatus, getKycSubmissions } from './actions';
import type { KycStatus, KycSubmission } from '@/lib/types';
import { KycDetailsDialog } from "@/components/admin/KycDetailsDialog";
import { RejectionDialog } from "@/components/admin/RejectionDialog";
import { useRouter } from "next/navigation";

const KycTable = ({ submissions, onStatusUpdate }: { submissions: KycSubmission[], onStatusUpdate: () => void }) => {
    const { toast } = useToast();
    const [selectedKyc, setSelectedKyc] = useState<KycSubmission | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isRejectionOpen, setIsRejectionOpen] = useState(false);

    const handleApprove = async (id: string) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast({ title: "Error", description: "Authentication token not found.", variant: 'destructive' });
            return;
        }
        const result = await updateKycStatus(id, 'approved', token);
        if (result.success) {
            toast({ title: "Success", description: result.message });
            onStatusUpdate();
        } else {
            toast({ title: "Error", description: result.message, variant: 'destructive' });
        }
    };

    const handleOpenRejectDialog = (submission: KycSubmission) => {
        setSelectedKyc(submission);
        setIsRejectionOpen(true);
    };

    const handleViewDetails = (submission: KycSubmission) => {
        setSelectedKyc(submission);
        setIsDetailsOpen(true);
    };
    
    return (
    <>
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Business Name</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                    {submissions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center h-24">No submissions found.</TableCell>
                        </TableRow>
                    ) : (
                        submissions.map((submission) => (
                            <TableRow key={submission._id}>
                            <TableCell>
                                <div className="font-medium">{submission.businessName || submission.contactPerson}</div>
                            </TableCell>
                            <TableCell>{submission.contactPerson}</TableCell>
                            <TableCell>{submission.email}</TableCell>
                            <TableCell>{new Date(submission.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <Badge
                                variant={
                                    submission.status === "approved" ? "default" :
                                    submission.status === "pending" ? "secondary" : "destructive"
                                }
                                className={
                                    submission.status === "approved" ? "bg-green-100 text-green-800" :
                                    submission.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                    "bg-red-100 text-red-800"
                                }
                                >
                                {submission.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">KYC actions</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleViewDetails(submission)}>
                                        <FileText className="mr-2 h-4 w-4" />
                                        View Details
                                    </DropdownMenuItem>
                                    {submission.status === 'pending' && (
                                    <>
                                        <DropdownMenuItem className="text-green-600" onClick={() => handleApprove(submission._id)}>Approve</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive" onClick={() => handleOpenRejectDialog(submission)}>Reject</DropdownMenuItem>
                                    </>
                                    )}
                                </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
        {selectedKyc && (
            <KycDetailsDialog 
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                kycSubmission={selectedKyc}
                onStatusUpdate={() => {
                    setIsDetailsOpen(false);
                    onStatusUpdate();
                }}
            />
        )}
        {selectedKyc && (
             <RejectionDialog
                isOpen={isRejectionOpen}
                onClose={() => setIsRejectionOpen(false)}
                submissionId={selectedKyc._id}
                onStatusUpdate={() => {
                    setIsRejectionOpen(false);
                    onStatusUpdate();
                }}
            />
        )}
    </>
    );
};


export default function ManageKycPage() {
  const [submissions, setSubmissions] = useState<KycSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const fetchKycSubmissions = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    if (!token) {
        toast({ title: "Error", description: "You must be logged in to view KYC submissions.", variant: 'destructive'});
        router.push('/login');
        return;
    }
    
    const { data, error } = await getKycSubmissions(token);

    if (error) {
        const errorMessage = error;
        toast({ title: "Error", description: `Failed to fetch KYC submissions: ${errorMessage}`, variant: 'destructive'});
        if (errorMessage.toLowerCase().includes('token')) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.dispatchEvent(new Event("storage"));
            router.push('/login');
        }
    } else {
        setSubmissions(data || []);
    }
    setLoading(false);
  }, [toast, router]);
  
  useEffect(() => {
    fetchKycSubmissions();
  }, [fetchKycSubmissions]);

  const getSubmissionsByStatus = (status: KycStatus) => submissions.filter(s => s.status === status);

  if (loading) {
      return (
          <main className="p-4 md:p-8 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
          </main>
      );
  }

  return (
    <main className="p-4 md:p-8">
       <Card>
        <CardHeader>
            <CardTitle>Manage KYC</CardTitle>
            <CardDescription>Review and manage KYC submissions from businesses.</CardDescription>
        </CardHeader>
        <CardContent>
           <Tabs defaultValue="pending">
                <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
                    <TabsTrigger value="pending">Pending ({getSubmissionsByStatus("pending").length})</TabsTrigger>
                    <TabsTrigger value="approved">Approved ({getSubmissionsByStatus("approved").length})</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected ({getSubmissionsByStatus("rejected").length})</TabsTrigger>
                </TabsList>
                <TabsContent value="pending" className="mt-4">
                    <KycTable submissions={getSubmissionsByStatus("pending")} onStatusUpdate={fetchKycSubmissions} />
                </TabsContent>
                 <TabsContent value="approved" className="mt-4">
                    <KycTable submissions={getSubmissionsByStatus("approved")} onStatusUpdate={fetchKycSubmissions} />
                </TabsContent>
                 <TabsContent value="rejected" className="mt-4">
                    <KycTable submissions={getSubmissionsByStatus("rejected")} onStatusUpdate={fetchKycSubmissions} />
                </TabsContent>
            </Tabs>
        </CardContent>
       </Card>
    </main>
  );
}
