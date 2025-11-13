
'use client';

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { KycViewerDialog } from "@/components/admin/KycViewerDialog";
import type { KycStatus, KycSubmission } from "@/lib/types";

const KycTable = ({ submissions }: { submissions: KycSubmission[] }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [mediaUrl, setMediaUrl] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const openViewer = (url: string, type: 'image' | 'video') => {
        // The API returns a relative path, so we construct the full URL.
        const fullUrl = url.startsWith('http') ? url : `${apiBaseUrl}${url}`;
        setMediaUrl(fullUrl);
        setMediaType(type);
        setDialogOpen(true);
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
                                    <div className="font-medium">{submission.businessName}</div>
                                </TableCell>
                                <TableCell>{submission.userId.name}</TableCell>
                                <TableCell>{submission.userId.email}</TableCell>
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
                                    <div className="flex justify-end gap-2">
                                        {submission.aadharImage && <Button variant="outline" size="sm" onClick={() => openViewer(submission.aadharImage!, 'image')}>View Aadhar</Button>}
                                        {submission.videoKyc && <Button variant="outline" size="sm" onClick={() => openViewer(submission.videoKyc!, 'video')}>View Video</Button>}
                                    </div>
                                </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <KycViewerDialog 
                isOpen={dialogOpen} 
                onClose={() => setDialogOpen(false)}
                mediaUrl={mediaUrl}
                mediaType={mediaType}
            />
        </>
    );
};


export default function ManageKycPage() {
  const [submissions, setSubmissions] = useState<KycSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchKycSubmissions = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('vendor_kyc')
            .select(`
                id,
                status,
                created_at,
                rejection_reason,
                aadhar_url,
                video_kyc_url,
                vendors (
                    businessName,
                    contactPersonName,
                    email
                )
            `);

        if (error) {
            toast({ title: "Error", description: "Failed to fetch KYC submissions.", variant: 'destructive'});
            console.error("Fetch KYC error:", error);
        } else {
            const adaptedData = data.map((item: any) => ({
                _id: item.id,
                status: item.status,
                createdAt: item.created_at,
                rejectionReason: item.rejection_reason,
                aadharImage: item.aadhar_url,
                videoKyc: item.video_kyc_url,
                businessName: item.vendors.businessName,
                userId: {
                    name: item.vendors.contactPersonName,
                    email: item.vendors.email,
                },
            }));
            setSubmissions(adaptedData as KycSubmission[]);
        }
        setLoading(false);
    };

    fetchKycSubmissions();
  }, [toast]);

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
                    <KycTable submissions={getSubmissionsByStatus("pending")} />
                </TabsContent>
                 <TabsContent value="approved" className="mt-4">
                    <KycTable submissions={getSubmissionsByStatus("approved")} />
                </TabsContent>
                 <TabsContent value="rejected" className="mt-4">
                    <KycTable submissions={getSubmissionsByStatus("rejected")} />
                </TabsContent>
            </Tabs>
        </CardContent>
       </Card>
    </main>
  );
}
