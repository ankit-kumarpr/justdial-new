
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { X, Trash2, Video } from "lucide-react";
import type { GalleryItem } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type MediaViewerDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  item: GalleryItem;
  onDelete: (item: GalleryItem) => void;
};

export function MediaViewerDialog({ isOpen, onClose, item, onDelete }: MediaViewerDialogProps) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 flex-row items-center justify-between border-b">
          <DialogTitle>Media Viewer</DialogTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>

        <div className="flex-1 p-4 flex items-center justify-center bg-black/90 min-h-0">
          {item.media_type === 'image' ? (
            <div className="relative w-full h-full">
              <Image 
                src={item.media_url} 
                alt={item.caption || "Gallery image"} 
                layout="fill" 
                objectFit="contain"
              />
            </div>
          ) : (
             <video src={item.media_url} controls autoPlay className="max-h-full max-w-full rounded-md">
                Your browser does not support the video tag.
            </video>
          )}
        </div>
        
        <DialogFooter className="p-4 border-t bg-background">
          <AlertDialog>
              <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                  </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                  <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete this media from your gallery.
                  </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(item)}>
                      Delete
                  </AlertDialogAction>
                  </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
