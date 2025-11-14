
'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X, Briefcase, MapPin, Check, X as XIcon, Calendar } from 'lucide-react';

type LeadData = {
    searchKeyword: string;
    description: string;
    userLocation: {
        city: string;
    };
    createdAt: string;
};

type LeadNotificationPopupProps = {
  lead: LeadData | null;
  onClose: () => void;
  onAccept: () => void;
  onReject: () => void;
};

export function LeadNotificationPopup({ lead, onClose, onAccept, onReject }: LeadNotificationPopupProps) {
  if (!lead) return null;

  return (
    <AlertDialog open={!!lead} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            New Lead Received!
          </AlertDialogTitle>
          <AlertDialogDescription>
            A new customer is looking for services you provide.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 py-4">
            <div className="p-4 bg-gray-50 rounded-lg border">
                <p className="font-semibold text-sm text-gray-700">Looking for: {lead.searchKeyword}</p>
                <p className="text-sm text-gray-600 mt-1">{lead.description}</p>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{lead.userLocation.city}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>
        </div>
        <AlertDialogFooter>
          <Button variant="destructive" onClick={onReject} className="flex-1">
            <XIcon className="mr-2 h-4 w-4" /> Reject
          </Button>
          <Button onClick={onAccept} className="bg-green-600 hover:bg-green-700 flex-1">
            <Check className="mr-2 h-4 w-4" /> Accept
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
