
'use client';

import { useEffect, useRef, useActionState, useState } from 'react';
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
import { Loader2 } from "lucide-react";
import { updateTicket, type UpdateTicketState, type Ticket } from '@/app/customer-service/actions';

type UpdateTicketDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
  ticket: Ticket | null;
};

export function UpdateTicketDialog({ isOpen, onOpenChange, onSuccess, ticket }: UpdateTicketDialogProps) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  const initialState: UpdateTicketState = {};
  const actionToCall = ticket ? updateTicket.bind(null, ticket._id) : async () => initialState;
  const [state, formAction, isPending] = useActionState(actionToCall, initialState);
  const lastMessageRef = useRef<string | null>();

  useEffect(() => {
    if (state.message && state.message !== lastMessageRef.current) {
        lastMessageRef.current = state.message;
        if (state.success) {
            toast({ title: 'Success!', description: state.message });
            onSuccess();
            onOpenChange(false);
        } else {
            toast({ title: 'Error', description: state.message, variant: 'destructive' });
        }
    }
  }, [state, toast, onSuccess, onOpenChange]);

  useEffect(() => {
    if (!isOpen) {
      formRef.current?.reset();
      lastMessageRef.current = null;
    }
  }, [isOpen]);
  
  const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  if (!ticket) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Update Support Ticket</DialogTitle>
          <DialogDescription>
            Edit the details of your support ticket.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} ref={formRef} className="space-y-4">
          <input type="hidden" name="token" value={getToken() || ''} />
          
          <div className="space-y-2">
            <Label htmlFor="subject-update">Subject</Label>
            <Input id="subject-update" name="subject" defaultValue={ticket.subject} />
            {state.errors?.subject && <p className="text-xs text-red-500">{state.errors.subject[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description-update">Description</Label>
            <Textarea id="description-update" name="description" defaultValue={ticket.description} />
            {state.errors?.description && <p className="text-xs text-red-500">{state.errors.description[0]}</p>}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Ticket
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
