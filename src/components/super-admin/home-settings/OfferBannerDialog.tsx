
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
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { updateOfferBannerByAdmin, type BannerFormState } from '@/app/super-admin/home-settings/actions';
import type { Banner } from '@/lib/types';
import Image from 'next/image';

type OfferBannerDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  banner?: Banner | null;
};

export function OfferBannerDialog({ isOpen, onClose, onSuccess, banner }: OfferBannerDialogProps) {
  const { toast } = useToast();
  const isEditing = !!banner;
  
  const initialState: BannerFormState = {};
  // The action is bound here, ensuring banner._id is available.
  const action = banner ? updateOfferBannerByAdmin.bind(null, banner._id) : async () => initialState;
  const [state, formAction, isPending] = useActionState(action, initialState);

  const formRef = useRef<HTMLFormElement>(null);
  const lastMessageRef = useRef<string>();
  const [token, setToken] = useState<string | null>(null);

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
    if (isOpen && typeof window !== 'undefined') {
      setToken(localStorage.getItem('accessToken'));
    }
    if (!isOpen) {
      formRef.current?.reset();
    }
  }, [isOpen]);

  if (!banner) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit Offer Banner</DialogTitle>
          <DialogDescription>
            Update the details for the offer banner by &quot;{banner.vendor?.businessName}&quot;.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} ref={formRef}>
          <input type="hidden" name="token" value={token || ''} />
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
              <Label htmlFor="image">Banner Image (Leave blank to keep existing)</Label>
              {banner?.image && (
                <div className="relative h-24 w-full rounded-md overflow-hidden border">
                    <Image src={banner.image} alt="Current banner image" layout="fill" objectFit="cover" />
                </div>
              )}
              <Input id="image" name="image" type="file" accept="image/*" />
              {state?.errors?.image && <p className="text-xs text-red-500">{state.errors.image[0]}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Banner
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
