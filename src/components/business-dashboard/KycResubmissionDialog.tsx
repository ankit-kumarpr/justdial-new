
'use client';

import { useState, useEffect } from 'react';
import { useActionState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { resubmitKyc } from '@/app/business-dashboard/actions';

type KycResubmissionDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  kycId: string;
  vendorId: string;
};

type FormState = {
  success: boolean;
  message: string;
  errors?: any;
};

export function KycResubmissionDialog({ isOpen, onOpenChange, kycId, vendorId }: KycResubmissionDialogProps) {
  const { toast } = useToast();
  
  const initialState: FormState = { success: false, message: '' };
  const [state, formAction, isPending] = useActionState(resubmitKyc, initialState);
  
  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({ title: 'Success', description: state.message });
        onOpenChange(false); // Close dialog on success
      } else {
        toast({ title: 'Error', description: state.message, variant: 'destructive' });
      }
    }
  }, [state, toast, onOpenChange]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Resubmit KYC Documents</DialogTitle>
          <DialogDescription>
            Please upload your corrected documents for verification.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-6 py-4">
            <input type="hidden" name="kycId" value={kycId} />
            <input type="hidden" name="vendorId" value={vendorId} />
            <div className="space-y-2">
                <Label htmlFor="aadharUpload">Aadhar Card</Label>
                <Input 
                    id="aadharUpload" 
                    name="aadharUpload" 
                    type="file" 
                    accept="image/*"
                />
                 {state.errors?.aadharUpload && <p className="text-xs text-red-500">{state.errors.aadharUpload[0]}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="videoUpload">Video KYC</Label>
                <Input 
                    id="videoUpload" 
                    name="videoUpload" 
                    type="file" 
                    accept="video/*"
                />
                 {state.errors?.videoUpload && <p className="text-xs text-red-500">{state.errors.videoUpload[0]}</p>}
            </div>

            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                   Your previous documents will be replaced. Ensure you upload the correct files.
                </AlertDescription>
            </Alert>
            
            {state.errors?.server && <p className="text-sm text-red-500 text-center">{state.errors.server[0]}</p>}

            <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resubmit
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
