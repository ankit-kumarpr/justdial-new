
'use client';

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
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { updateKycStatus } from "@/app/super-admin/kyc/actions";

type RejectionDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  submissionId: string;
  onStatusUpdate: () => void;
};

export function RejectionDialog({ isOpen, onClose, submissionId, onStatusUpdate }: RejectionDialogProps) {
  const { toast } = useToast();
  const [reason, setReason] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleReject = async () => {
      if (!reason.trim()) {
          toast({ title: "Error", description: "Rejection reason cannot be empty.", variant: 'destructive'});
          return;
      }
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast({ title: "Error", description: "Authentication token not found.", variant: 'destructive' });
        return;
      }
      setIsPending(true);
      const result = await updateKycStatus(submissionId, 'rejected', token, reason);
      if (result.success) {
          toast({ title: "Success", description: result.message });
          onStatusUpdate();
          onClose();
      } else {
          toast({ title: "Error", description: result.message, variant: 'destructive'});
      }
      setIsPending(false);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reason for Rejection</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this KYC submission. This will be visible to the vendor.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <Label htmlFor="rejection-reason" className="sr-only">Rejection Reason</Label>
            <Textarea 
                id="rejection-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Aadhar card image is not clear."
            />
        </div>
        <DialogFooter>
            <Button variant="ghost" onClick={onClose} disabled={isPending}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject} disabled={isPending || !reason.trim()}>
                 {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm Rejection
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
