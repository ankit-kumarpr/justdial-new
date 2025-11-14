
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, User, Mail, Phone, MapPin, Briefcase, Calendar, FileText } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { getEmployeeProfile } from '@/app/business-dashboard/employees/actions';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

type EmployeeProfileDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  individualId: string;
};

const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | undefined | null }) => {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3">
            <Icon className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
            <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-sm font-medium">{value}</p>
            </div>
        </div>
    );
};

export function EmployeeProfileDialog({ isOpen, onOpenChange, individualId }: EmployeeProfileDialogProps) {
  const { toast } = useToast();
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!individualId) return;
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast({ title: 'Error', description: 'Authentication is required.', variant: 'destructive' });
      onOpenChange(false);
      return;
    }
    const { data, error } = await getEmployeeProfile(individualId, token);
    if (error) {
      toast({ title: 'Error', description: `Failed to fetch employee profile: ${error}`, variant: 'destructive' });
      onOpenChange(false);
    } else {
      setProfile(data);
    }
    setLoading(false);
  }, [individualId, onOpenChange, toast]);

  useEffect(() => {
    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen, fetchProfile]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Employee Profile</DialogTitle>
          <DialogDescription>
            Detailed information for the selected employee.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] -mx-6 px-6">
            <ScrollArea className="h-full">
            {loading ? (
                <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : profile ? (
                <div className="space-y-6 py-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarFallback className="text-xl">{profile.individual.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-xl font-bold">{profile.individual.name}</h2>
                            <p className="text-sm text-gray-500 capitalize">{profile.individual.role}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold border-b pb-1">Contact Information</h3>
                        <DetailItem icon={Mail} label="Email" value={profile.individual.email} />
                        <DetailItem icon={Phone} label="Phone" value={profile.individual.phone} />
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold border-b pb-1">KYC & Business Info</h3>
                         <DetailItem icon={Briefcase} label="Primary Business" value={profile.kyc.businessName} />
                         <DetailItem icon={MapPin} label="Personal Address" value={profile.kyc.personalAddress} />
                    </div>
                    
                    <div className="space-y-4">
                        <h3 className="font-semibold border-b pb-1">Employment Details</h3>
                        <DetailItem icon={Calendar} label="Hired On" value={new Date(profile.hiredAt).toLocaleDateString()} />
                        <DetailItem icon={FileText} label="Notes" value={profile.notes} />
                    </div>
                </div>
            ) : (
                <p className="text-center py-10 text-gray-500">Could not load employee profile.</p>
            )}
            </ScrollArea>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
