
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

type LocationUpdateDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  oldCity: string;
  newCity: string;
  onConfirm: () => void;
  onDecline: () => void;
};

export function LocationUpdateDialog({ isOpen, onOpenChange, oldCity, newCity, onConfirm, onDecline }: LocationUpdateDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <MapPin className="text-primary h-6 w-6"/>
            Update Your Location?
          </AlertDialogTitle>
          <AlertDialogDescription>
            We noticed you seem to be in <span className="font-bold">{newCity}</span>, but your saved location is <span className="font-bold">{oldCity}</span>. Would you like to update your location for better local results?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onDecline}>Keep {oldCity}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Update to {newCity}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
