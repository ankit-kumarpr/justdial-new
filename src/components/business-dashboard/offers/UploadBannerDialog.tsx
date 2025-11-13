
'use client';

import { useState, useEffect, useActionState, useRef } from 'react';
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
import { Loader2, UploadCloud } from "lucide-react";
import Image from 'next/image';
import { uploadBannerImage, updateOfferBanner } from '@/app/business-dashboard/offers/actions';
import type { Banner } from '@/lib/types';

type UploadBannerDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  banner: Banner | null;
  onSuccess: () => void;
};

export function UploadBannerDialog({ isOpen, onOpenChange, banner, onSuccess }: UploadBannerDialogProps) {
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const isEditing = !!(banner && banner.isBannerUploaded);

  const initialState = { message: '', errors: null, success: false };
  
  // Conditionally define the action to avoid null reference on banner._id
  const actionToCall = banner ? (isEditing ? updateOfferBanner.bind(null, banner._id) : uploadBannerImage.bind(null, banner._id)) : () => {};
  const [state, formAction, isPending] = useActionState(actionToCall, initialState);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({ title: 'Success!', description: state.message });
        onSuccess();
        onOpenChange(false);
      } else {
        toast({ title: 'Action Failed', description: state.message, variant: 'destructive' });
      }
    }
  }, [state, toast, onSuccess, onOpenChange]);

  useEffect(() => {
    if (isOpen) {
        setPreview(banner?.image || null);
    } else {
      setFile(null);
      setPreview(null);
      formRef.current?.reset();
    }
  }, [isOpen, banner]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  if (!banner) return null; // Don't render the form if there's no banner object

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Banner' : 'Upload Banner Image'}</DialogTitle>
          <DialogDescription>
            {isEditing ? `Update the details for your '${banner?.place}' banner.` : `Upload an image for your purchased '${banner?.place}' banner placement.`}
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} ref={formRef}>
          <input type="hidden" name="token" value={getToken() || ''} />
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image">Banner Image {isEditing && '(Leave blank to keep existing)'}</Label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {preview ? (
                    <Image src={preview} alt="Banner preview" width={400} height={200} className="mx-auto h-32 w-auto object-contain rounded-md" />
                  ) : (
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <Label htmlFor="image" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-accent focus-within:outline-none">
                      <span>{file || preview ? 'Change file' : 'Upload a file'}</span>
                      <Input id="image" name="image" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                    </Label>
                    {!file && !preview && <p className="pl-1">or drag and drop</p>}
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="title">Banner Title</Label>
                <Input id="title" name="title" placeholder="e.g., Special Winter Discount" defaultValue={banner?.title}/>
            </div>
             <div className="space-y-2">
                <Label htmlFor="link">Link URL (Optional)</Label>
                <Input id="link" name="link" placeholder="https://yourwebsite.com/offer" defaultValue={banner?.link} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending || (!file && !isEditing)}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update Banner' : 'Upload and Activate'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
