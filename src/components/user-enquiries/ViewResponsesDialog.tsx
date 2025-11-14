
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MessageSquare, Star, Eye, ChevronUp, Edit } from "lucide-react";
import type { VendorResponse } from "@/lib/types";
import Link from 'next/link';
import { ReviewForm } from "../business/review-form";
import { AnimatePresence, motion } from 'framer-motion';
import { Separator } from '../ui/separator';

type ViewResponsesDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  responses: VendorResponse[];
};

export function ViewResponsesDialog({ isOpen, onClose, responses }: ViewResponsesDialogProps) {
  const [reviewingVendorId, setReviewingVendorId] = useState<string | null>(null);
  const [submittedReviewIds, setSubmittedReviewIds] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const handleToggleReview = (businessId: string) => {
    setReviewingVendorId(prevId => prevId === businessId ? null : businessId);
  }

  const handleReviewSuccess = (businessId: string) => {
    setSubmittedReviewIds(prev => new Set(prev).add(businessId));
    setReviewingVendorId(null); // Close the form after successful submission
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Vendor Responses</DialogTitle>
          <DialogDescription>
            Here are the businesses that have responded to your enquiry.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] mt-4">
          <div className="space-y-4 pr-6">
            {responses.length > 0 ? (
              responses.map(response => (
                <Card key={response._id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">{response.businessId.businessName}</p>
                        <p className="text-sm text-gray-500">{response.businessId.city}, {response.businessId.state}</p>
                        <div className="flex items-center gap-1 text-xs mt-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="font-semibold">4.5</span>
                          <span className="text-gray-500">(120 ratings)</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                          <Button asChild size="sm" variant="outline">
                              <Link href={`/business-profile?id=${response.businessId._id}`}>
                                  <Eye className="h-4 w-4 mr-2" /> View
                              </Link>
                          </Button>
                          <Button size="sm" onClick={() => handleToggleReview(response.businessId._id)}>
                              {reviewingVendorId === response.businessId._id ? (
                                  <ChevronUp className="h-4 w-4 mr-2" />
                              ) : submittedReviewIds.has(response.businessId._id) ? (
                                  <Edit className="h-4 w-4 mr-2" />
                              ) : (
                                  <Star className="h-4 w-4 mr-2" />
                              )}
                              {reviewingVendorId === response.businessId._id 
                                ? 'Close Review' 
                                : submittedReviewIds.has(response.businessId._id) 
                                ? 'Edit Review' 
                                : 'Submit Review'
                              }
                          </Button>
                      </div>
                    </div>
                    <AnimatePresence>
                      {reviewingVendorId === response.businessId._id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0, marginTop: 0 }}
                          animate={{ height: 'auto', opacity: 1, marginTop: '1rem' }}
                          exit={{ height: 0, opacity: 0, marginTop: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                           <Separator className="my-4" />
                           <ReviewForm 
                              businessId={response.businessId._id}
                              onReviewSubmitSuccess={() => handleReviewSuccess(response.businessId._id)}
                            />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No responses yet.</p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
