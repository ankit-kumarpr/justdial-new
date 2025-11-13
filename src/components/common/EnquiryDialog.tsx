
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from '@/contexts/LocationContext';
import { useRouter } from 'next/navigation';

type EnquiryDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  searchKeyword: string;
  onSuccess: () => void;
};

export function EnquiryDialog({ isOpen, onOpenChange, searchKeyword, onSuccess }: EnquiryDialogProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { city, latitude, longitude, address, state, pincode } = useLocation();

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast({ title: "Description Required", description: "Please provide a description of your needs.", variant: "destructive" });
      return;
    }

    if (!latitude || !longitude) {
      toast({ title: "Location Required", description: "Could not determine your location. Please enable location services.", variant: "destructive" });
      onSuccess(); // Redirect even if location is missing
      onOpenChange(false);
      return;
    }
    
    setIsSubmitting(true);
    const token = localStorage.getItem('accessToken');

    if (!token) {
        toast({ title: "Authentication Error", description: "You must be logged in to submit an enquiry.", variant: "destructive" });
        onSuccess(); // Redirect to search page
        onOpenChange(false);
        router.push('/login'); // Then redirect to login
        setIsSubmitting(false);
        return;
    }

    try {
      const response = await fetch('/api/enquiry/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          searchKeyword,
          description,
          location: {
            longitude,
            latitude,
            address,
            city,
            state,
            pincode,
          },
          radius: 15000,
        }),
      });

      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event("storage"));
        toast({ title: "Session Expired", description: "Please log in again.", variant: "destructive" });
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit enquiry.');
      }
      
      toast({ title: "Enquiry Submitted!", description: "We're finding the best matches for you." });
      
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      onOpenChange(false);
      onSuccess(); // Redirect on both success and failure
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tell us more about your needs</DialogTitle>
          <DialogDescription>
            Provide a detailed description for &quot;{searchKeyword}&quot; to get better results.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="description" className="sr-only">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., I need a React.js training course for beginners. Looking for weekend batches. Please contact me with course details and fees."
            rows={5}
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Skip</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !description.trim()}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit & Search'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
