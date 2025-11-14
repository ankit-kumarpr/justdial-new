
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { getAllReviews, updateReviewStatus } from "./actions";
import type { AdminReview } from "@/lib/types";
import { cn } from "@/lib/utils";
import { StarRating } from "@/components/business/star-rating";

const ReviewTable = ({ reviews, onUpdate }: { reviews: AdminReview[], onUpdate: () => void }) => {
    const { toast } = useToast();
    
    const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast({ title: 'Error', description: 'Authentication required.', variant: 'destructive' });
            return;
        }
        const result = await updateReviewStatus(id, status, token);
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            onUpdate();
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    };

    const getStatusClass = (status: string) => {
        switch (status.toLowerCase()) {
        case 'approved': return 'bg-green-100 text-green-800';
        case 'rejected': return 'bg-red-100 text-red-800';
        case 'pending':
        default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Comment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reviews.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center h-24">No reviews found in this category.</TableCell>
                        </TableRow>
                    ) : (
                        reviews.map((review) => (
                            <TableRow key={review.id}>
                                <TableCell className="font-medium">{review.user.name}</TableCell>
                                <TableCell>{review.vendor.name}</TableCell>
                                <TableCell>
                                    <StarRating rating={review.rating} size={16} />
                                </TableCell>
                                <TableCell className="max-w-xs truncate">{review.comment}</TableCell>
                                <TableCell>
                                    <Badge className={cn("capitalize", getStatusClass(review.status))}>
                                        {review.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {review.status === 'pending' && (
                                        <div className="flex justify-end gap-2">
                                            <Button size="icon" variant="outline" className="h-8 w-8 text-green-600 hover:text-green-600 hover:bg-green-50" onClick={() => handleStatusUpdate(review.id, 'approved')}>
                                                <ThumbsUp className="h-4 w-4" />
                                            </Button>
                                            <Button size="icon" variant="outline" className="h-8 w-8 text-red-600 hover:text-red-600 hover:bg-red-50" onClick={() => handleStatusUpdate(review.id, 'rejected')}>
                                                <ThumbsDown className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default function ManageReviewsPage() {
    const [reviews, setReviews] = useState<AdminReview[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast({ title: "Error", description: "Authentication required.", variant: 'destructive' });
            router.push('/login');
            return;
        }
        const { data, error } = await getAllReviews(token);
        if (error) {
            toast({ title: "Error", description: `Failed to fetch reviews: ${error}`, variant: 'destructive' });
        } else {
            setReviews(data || []);
        }
        setLoading(false);
    }, [router, toast]);
    
    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);
    
    const getReviewsByStatus = (status: string) => reviews.filter(r => r.status === status);

    return (
        <main className="p-4 md:p-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Star /> Manage Reviews</CardTitle>
                    <CardDescription>Approve, reject, or manage all user-submitted reviews.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>
                    ) : (
                        <Tabs defaultValue="pending">
                            <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
                                <TabsTrigger value="pending">Pending ({getReviewsByStatus('pending').length})</TabsTrigger>
                                <TabsTrigger value="approved">Approved ({getReviewsByStatus('approved').length})</TabsTrigger>
                                <TabsTrigger value="rejected">Rejected ({getReviewsByStatus('rejected').length})</TabsTrigger>
                                <TabsTrigger value="all">All ({reviews.length})</TabsTrigger>
                            </TabsList>
                            <TabsContent value="pending" className="mt-4">
                                <ReviewTable reviews={getReviewsByStatus('pending')} onUpdate={fetchReviews} />
                            </TabsContent>
                            <TabsContent value="approved" className="mt-4">
                                <ReviewTable reviews={getReviewsByStatus('approved')} onUpdate={fetchReviews} />
                            </TabsContent>
                            <TabsContent value="rejected" className="mt-4">
                                <ReviewTable reviews={getReviewsByStatus('rejected')} onUpdate={fetchReviews} />
                            </TabsContent>
                            <TabsContent value="all" className="mt-4">
                                <ReviewTable reviews={reviews} onUpdate={fetchReviews} />
                            </TabsContent>
                        </Tabs>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}
