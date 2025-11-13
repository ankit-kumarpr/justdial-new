
'use client';

import { useEffect, useRef, useActionState, useMemo } from 'react';
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
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { addBanner, updateBanner, type BannerFormState } from './actions';
import type { Banner } from '@/lib/types';
import Image from 'next/image';

type BannerDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  banner?: Banner | null;
};

export function BannerDialog({ isOpen, onClose, onSuccess, banner }: BannerDialogProps) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const isEditing = !!banner;
  const lastMessageRef = useRef<string | null>();

  const initialState: BannerFormState = {};
  const action = isEditing ? updateBanner.bind(null, banner._id) : addBanner;
  const [state, formAction, isPending] = useActionState(action, initialState);
  
  useEffect(() => {
    if (state.message && state.message !== lastMessageRef.current) {
      lastMessageRef.current = state.message;
      if (state.errors) {
        toast({ title: 'Error', description: state.message, variant: 'destructive' });
      } else {
        toast({ title: 'Success!', description: state.message });
        onSuccess();
        onClose();
      }
    }
  }, [state, toast, onClose, onSuccess]);

  useEffect(() => {
    if (!isOpen) {
      formRef.current?.reset();
    }
  }, [isOpen]);
  
  const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('accessToken');
    }
    return null;
  }
  
  const formatDateForInput = (dateString: string | undefined | null) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    } catch(e) {
        return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Banner' : 'Add New Banner'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details for this banner.' : 'Upload a banner image and provide its details.'}
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} ref={formRef}>
          <input type="hidden" name="token" value={getToken() || ''} />
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" placeholder="e.g., Diwali Sale" defaultValue={banner?.title} />
              {state?.errors?.title && <p className="text-xs text-red-500">{state.errors.title[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="link">Link URL</Label>
              <Input id="link" name="link" placeholder="https://example.com/offer" defaultValue={banner?.link} />
              {state?.errors?.link && <p className="text-xs text-red-500">{state.errors.link[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Banner Image {isEditing && '(Leave blank to keep existing)'}</Label>
              {isEditing && banner?.image && (
                <div className="relative h-24 w-full rounded-md overflow-hidden border">
                    <Image src={banner.image} alt="Current banner image" layout="fill" objectFit="cover" />
                </div>
              )}
              <Input id="image" name="image" type="file" accept="image/*" />
              {state?.errors?.image && <p className="text-xs text-red-500">{state.errors.image[0]}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" name="startDate" type="date" defaultValue={formatDateForInput(banner?.startDate)} />
                 {state?.errors?.startDate && <p className="text-xs text-red-500">{state.errors.startDate[0]}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" name="endDate" type="date" defaultValue={formatDateForInput(banner?.endDate)} />
                 {state?.errors?.endDate && <p className="text-xs text-red-500">{state.errors.endDate[0]}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update Banner' : 'Add Banner'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
