
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ChevronRight, HelpCircle } from 'lucide-react';
import Image from 'next/image';

type AddPhotoDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  file: File | null;
  onContinueWithNewService: (file: File) => void;
  onAddToExistingService: (file: File) => void;
};

export function AddPhotoDialog({ isOpen, onOpenChange, file, onContinueWithNewService, onAddToExistingService }: AddPhotoDialogProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const handleClose = () => {
    setPreviewUrl(null);
    onOpenChange(false);
  };
  
  const handleCreateNewService = () => {
    if (file) {
        onContinueWithNewService(file);
    }
  };

  const handleAddToExisting = () => {
    if (file) {
      onAddToExistingService(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-0 flex flex-col h-[90vh]">
        <DialogHeader className="p-4 border-b flex flex-row items-center justify-between flex-shrink-0">
          <DialogTitle>Add Photo</DialogTitle>
           <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                  <HelpCircle className="h-5 w-5" />
              </Button>
               <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 rounded-full" onClick={handleClose}>
                  <X className="h-5 w-5" />
              </Button>
            </div>
        </DialogHeader>
        
        <div className="flex-1 p-6 flex flex-col items-center justify-center">
            {previewUrl && (
                <div className="relative w-32 h-32 mb-6">
                    <Image src={previewUrl} alt="Selected photo preview" layout="fill" objectFit="cover" className="rounded-lg" />
                </div>
            )}
            
            <p className="text-sm text-gray-500 mb-4 text-center">
                Tell us where do you want to add this photo
            </p>

            <div className="w-full space-y-3">
                <Button variant="outline" className="w-full justify-between h-auto py-3" onClick={handleCreateNewService}>
                    <div className="text-left">
                        <p className="font-semibold">Create New Service</p>
                        <p className="text-xs text-gray-500">Create a new service with this photo</p>
                    </div>
                    <ChevronRight className="h-5 w-5" />
                </Button>
                 <Button variant="outline" className="w-full justify-between h-auto py-3" onClick={handleAddToExisting}>
                    <div className="text-left">
                        <p className="font-semibold">Add to Existing Service</p>
                        <p className="text-xs text-gray-500">Add this photo to a service from catalogue</p>
                    </div>
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>
        </div>

        <DialogFooter className="p-4 border-t">
            <Button onClick={handleClose} className="w-full">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
