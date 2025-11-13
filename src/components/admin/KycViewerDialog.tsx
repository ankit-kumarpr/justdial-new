
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";

type KycViewerDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string | null;
  mediaType: 'image' | 'video' | null;
};

export function KycViewerDialog({ isOpen, onClose, mediaUrl, mediaType }: KycViewerDialogProps) {
  if (!isOpen || !mediaUrl || !mediaType) return null;

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const fullMediaUrl = mediaUrl.startsWith('http') ? mediaUrl : `${apiBaseUrl}${mediaUrl}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>KYC Document Viewer</DialogTitle>
           <DialogDescription>
            Review the submitted document below.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
            {mediaType === 'image' && (
                <div className="relative w-full aspect-video">
                    <Image src={fullMediaUrl} alt="KYC Document" layout="fill" objectFit="contain" />
                </div>
            )}
            {mediaType === 'video' && (
                <video src={fullMediaUrl} controls autoPlay className="w-full rounded-md">
                    Your browser does not support the video tag.
                </video>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
