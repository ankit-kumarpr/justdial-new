
'use client';

import { useState, useEffect, useCallback } from 'react';
import { JustdialHeader } from '@/components/justdial/JustdialHeader';
import { JustdialFooter } from '@/components/justdial/JustdialFooter';
import { FloatingButtons } from '@/components/justdial/FloatingButtons';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, SearchX, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, fadeInUp } from '@/lib/animations';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { apiFetch } from '@/lib/api-client';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/business/star-rating';
import Link from 'next/link';
import type { Review } from '@/lib/types';


async function getMyReviews(token: string): Promise<{ data: Review[] | null; error: string | null; }> {
    if (!token) {
        return { data: null, error: 'Authentication is required.' };
    }
    try {
        const result = await apiFetch('/api/review/my-reviews', token, { cache: 'no-store' });
        return { data: result.data || [], error: null };
    } catch (e: any) {
        return { data: null, error: e.message };
    }
}

export default function MyReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        if (!token) {
            router.push('/login');
            return;
        }

        const { data, error } = await getMyReviews(token);

        if (error) {
            setError(error);
            if (error.toLowerCase().includes('token')) {
                toast({ title: "Session Expired", description: "Please log in again.", variant: "destructive" });
                router.push('/login');
            } else {
                toast({ title: "Error", description: `Could not load your reviews: ${error}`, variant: "destructive" });
            }
        } else {
            setReviews(data || []);
        }
        setLoading(false);
    }, [router, toast]);
    
    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);
    
    const getStatusClass = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'pending':
            default: return 'bg-yellow-100 text-yellow-800';
        }
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

            <section className="relative bg-gradient-to-br from-primary/5 via-accent/5 to-background pt-28 pb-16 overflow-hidden">
                <motion.div
                  className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
                  animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
                  animate={{ scale: [1.2, 1, 1.2], x: [0, -50, 0], y: [0, -30, 0] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                      initial={{ opacity: 0, y: -30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="flex items-center gap-3 mb-4"
                    >
                        <Star className="h-10 w-10 text-primary" />
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gradient-animated">
                            My Reviews
                        </h1>
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-lg text-muted-foreground"
                    >
                      A collection of all the reviews you have submitted.
                    </motion.p>
                </div>
            </section>

            <main className="container mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>
                ) : error ? (
                    <div className="text-center py-20 bg-red-50 rounded-lg">
                        <SearchX className="h-16 w-16 text-red-400 mx-auto mb-4"/>
                        <h3 className="text-xl font-semibold text-red-700">Failed to load reviews</h3>
                        <p className="text-red-600">{error}</p>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-lg">
                        <SearchX className="h-16 w-16 text-gray-400 mx-auto mb-4"/>
                        <h3 className="text-xl font-semibold text-gray-700">No Reviews Yet</h3>
                        <p className="text-gray-500">You haven't submitted any reviews.</p>
                    </div>
                ) : (
                    <motion.div
                        className="space-y-4"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                    >
                        {reviews.map(review => (
                            <motion.div key={review.id} variants={fadeInUp}>
                                <Card>
                                    <CardContent className="p-4 flex justify-between items-start">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-4">
                                                <h3 className="font-bold text-lg">{review.vendor.name}</h3>
                                                <Badge className={getStatusClass(review.status)}>{review.status}</Badge>
                                            </div>
                                            <StarRating rating={review.rating} size={16} />
                                            <p className="text-sm text-gray-700 pt-2">{review.comment}</p>
                                            <p className="text-xs text-gray-400 pt-1">{new Date(review.createdAt).toLocaleString()}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </main>

            <JustdialFooter />
        </motion.div>
    );
}
