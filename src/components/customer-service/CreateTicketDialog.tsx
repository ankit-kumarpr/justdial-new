
'use client';

import { useEffect, useRef, useState, useActionState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { createTicket, type CreateTicketState } from '@/app/customer-service/actions';

type CreateTicketDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
};

export function CreateTicketDialog({ isOpen, onOpenChange, onSuccess }: CreateTicketDialogProps) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const initialState: CreateTicketState = {};
  const [state, formAction, isPending] = useActionState(createTicket, initialState);
  const lastMessageRef = useRef<string | null>();


  useEffect(() => {
    if (state.message && state.message !== lastMessageRef.current) {
      lastMessageRef.current = state.message;
      if (state.errors) {
        toast({ title: 'Error', description: state.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success!', description: state.message });
        onSuccess();
        onOpenChange(false);
      }
    }
  }, [state, toast, onSuccess, onOpenChange]);

  useEffect(() => {
    if (!isOpen) {
      formRef.current?.reset();
      setImagePreview(null);
      lastMessageRef.current = null; // Reset the ref when dialog closes
    }
  }, [isOpen]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Create a New Support Ticket</DialogTitle>
          <DialogDescription>
            Describe your issue, and our support team will get back to you shortly.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} ref={formRef} className="space-y-4">
          <input type="hidden" name="token" value={getToken() || ''} />
          
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" name="subject" placeholder="e.g., Payment Issue" />
            {state.errors?.subject && <p className="text-xs text-red-500">{state.errors.subject[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" placeholder="Please describe your problem in detail..." />
            {state.errors?.description && <p className="text-xs text-red-500">{state.errors.description[0]}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Attach Image (Optional)</Label>
            <div 
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Image preview" className="mx-auto h-24 w-auto object-contain rounded-md" />
                ) : (
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                )}
                <div className="flex text-sm text-gray-600">
                  <span className="relative rounded-md bg-white font-medium text-primary hover:text-accent focus-within:outline-none">
                    <span>{imagePreview ? 'Change file' : 'Upload a file'}</span>
                    <Input ref={fileInputRef} id="image" name="image" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                  </span>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Ticket
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
