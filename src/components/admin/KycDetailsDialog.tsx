
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { KycSubmission } from "@/lib/types";
import Image from "next/image";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { RejectionDialog } from "./RejectionDialog";
import { updateKycStatus } from "@/app/super-admin/kyc/actions";
import { useToast } from "@/hooks/use-toast";
import { KycViewerDialog } from "./KycViewerDialog";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertTriangle } from "lucide-react";

type KycDetailsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  kycSubmission: KycSubmission | null;
  onStatusUpdate: () => void;
};

const DetailItem = ({ label, value }: { label: string, value: string | string[] | undefined | null }) => {
    if (!value) return null;
    return (
        <div>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className="text-sm">{Array.isArray(value) ? value.join(', ') : value}</p>
        </div>
    )
}

export function KycDetailsDialog({ isOpen, onClose, kycSubmission, onStatusUpdate }: KycDetailsDialogProps) {
  const { toast } = useToast();
  const [isRejectionOpen, setIsRejectionOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  
  if (!isOpen || !kycSubmission) return null;

  const { status, rejectionReason } = kycSubmission;
  
  const handleApprove = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        toast({ title: "Error", description: "Authentication token not found.", variant: 'destructive' });
        return;
    }
    const result = await updateKycStatus(kycSubmission._id, 'approved', token);
    if (result.success) {
      toast({ title: "Success", description: result.message });
      onStatusUpdate();
    } else {
      toast({ title: "Error", description: result.message, variant: 'destructive' });
    }
  };
  
  const handleOpenRejectDialog = () => {
    setIsRejectionOpen(true);
  };
  
  const openMediaViewer = (url: string, type: 'image' | 'video') => {
      setMediaUrl(url);
      setMediaType(type);
      setIsViewerOpen(true);
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl h-[90vh]">
          <DialogHeader>
            <DialogTitle>KYC Submission Details</DialogTitle>
            <DialogDescription>
              Review the complete details for business: <span className="font-semibold">{kycSubmission.businessName}</span>
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-full">
            <div className="p-4 space-y-6">
                
                {status === 'rejected' && rejectionReason && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Rejection Reason</AlertTitle>
                        <AlertDescription>
                            {rejectionReason}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Business Details */}
                <div className="space-y-2">
                    <h3 className="font-semibold border-b pb-1">Business Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <DetailItem label="Business Name" value={kycSubmission.businessName} />
                        <DetailItem label="GST Number" value={kycSubmission.gstNumber} />
                        <DetailItem label="Address" value={`${kycSubmission.plotNo}, ${kycSubmission.buildingName}, ${kycSubmission.street}, ${kycSubmission.landmark}, ${kycSubmission.area}, ${kycSubmission.city} - ${kycSubmission.pincode}, ${kycSubmission.state}`} />
                    </div>
                </div>

                 {/* Contact Details */}
                <div className="space-y-2">
                    <h3 className="font-semibold border-b pb-1">Contact Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <DetailItem label="Contact Person" value={`${kycSubmission.contactPerson}`} />
                        <DetailItem label="Email" value={kycSubmission.email} />
                        <DetailItem label="Mobile" value={kycSubmission.mobileNumber} />
                        <DetailItem label="WhatsApp" value={kycSubmission.whatsappNumber} />
                    </div>
                </div>

                 {/* Timings */}
                <div className="space-y-2">
                    <h3 className="font-semibold border-b pb-1">Business Timings</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <DetailItem label="Working Days" value={kycSubmission.workingDays} />
                        <DetailItem label="Hours" value={`${kycSubmission.businessHoursOpen} - ${kycSubmission.businessHoursClose}`} />
                    </div>
                </div>

                {/* KYC Documents */}
                <div className="space-y-2">
                    <h3 className="font-semibold border-b pb-1">KYC Documents</h3>
                     <div className="grid grid-cols-2 gap-4 items-start">
                        <div>
                            <DetailItem label="Aadhar Number" value={kycSubmission.aadharNumber} />
                            {kycSubmission.aadharImage && (
                                <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => openMediaViewer(kycSubmission.aadharImage!, 'image')}>
                                    View Aadhar Image
                                </Button>
                            )}
                        </div>
                        <div>
                           <p className="text-xs text-gray-500 font-medium">Video KYC</p>
                           {kycSubmission.videoKyc && (
                                <Button variant="link" size="sm" className="p-0 h-auto" onClick={() => openMediaViewer(kycSubmission.videoKyc!, 'video')}>
                                    Play Video
                                </Button>
                           )}
                           {!kycSubmission.videoKyc && <p className="text-sm text-gray-400">Not provided</p>}
                        </div>
                    </div>
                </div>
            </div>
          </ScrollArea>
          {status === 'pending' && (
            <DialogFooter>
                <Button variant="destructive" onClick={handleOpenRejectDialog}>Reject</Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={handleApprove}>Approve</Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
      
      <RejectionDialog 
          isOpen={isRejectionOpen}
          onClose={() => setIsRejectionOpen(false)}
          submissionId={kycSubmission._id}
          onStatusUpdate={() => {
              setIsRejectionOpen(false);
              onStatusUpdate();
          }}
      />
      
      <KycViewerDialog
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
          mediaUrl={mediaUrl}
          mediaType={mediaType}
      />
    </>
  );
}
