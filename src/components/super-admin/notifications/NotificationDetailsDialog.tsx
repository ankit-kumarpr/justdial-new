
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle, Paperclip, Download } from "lucide-react";
import { getSingleNotification } from '@/app/super-admin/notifications/actions';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

type NotificationDetailsDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  notificationId: string | null;
};

const DetailItem = ({ label, value }: { label: string, value: string | undefined }) => {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-sm text-gray-800">{value}</p>
    </div>
  )
};

export function NotificationDetailsDialog({ isOpen, onOpenChange, notificationId }: NotificationDetailsDialogProps) {
  const { toast } = useToast();
  const [notification, setNotification] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (isOpen && notificationId) {
      const fetchNotification = async () => {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        if (!token) {
          toast({ title: 'Error', description: 'Authentication required.', variant: 'destructive' });
          onOpenChange(false);
          return;
        }
        const result = await getSingleNotification(notificationId, token);
        if (result.error) {
          toast({ title: 'Error', description: `Failed to fetch notification: ${result.error}`, variant: 'destructive' });
        } else {
          setNotification(result.data);
        }
        setLoading(false);
      };
      fetchNotification();
    }
  }, [isOpen, notificationId, toast, onOpenChange]);

  const constructUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const cleanPath = path.replace(/\\/g, '/').replace(/^.*uploads/, '/uploads');
    return `${apiBaseUrl}${cleanPath}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Notification Details</DialogTitle>
          <DialogDescription>
            Complete information for the selected notification.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full pr-4">
            {loading ? (
              <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin"/></div>
            ) : notification ? (
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                  <DetailItem label="Subject" value={notification.subject} />
                  <DetailItem label="Content" value={notification.content} />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <DetailItem label="Type" value={notification.type} />
                  <DetailItem label="Recipient Type" value={notification.recipientType?.replace('_', ' ')} />
                  <DetailItem label="Sent On" value={new Date(notification.createdAt).toLocaleString()} />
                </div>
                
                {notification.sentBy && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Sent By</h3>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                        {notification.sentBy.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{notification.sentBy.name}</p>
                        <p className="text-xs text-gray-500">{notification.sentBy.email}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {notification.specificRecipients && notification.specificRecipients.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Specific Recipients</h3>
                    <div className="space-y-2">
                      {notification.specificRecipients.map((recipient: any) => (
                        <div key={recipient._id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border">
                          <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">
                            {recipient.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{recipient.name}</p>
                            <p className="text-xs text-gray-500">{recipient.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {notification.attachments && notification.attachments.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Attachments</h3>
                    <div className="space-y-2">
                      {notification.attachments.map((attachment: string, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded-md bg-gray-50">
                            <div className="flex items-center gap-2 text-sm truncate">
                                <Paperclip className="h-4 w-4 text-gray-500" />
                                <span className="truncate">{attachment.split('/').pop()}</span>
                            </div>
                            <a href={constructUrl(attachment)} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Download className="h-4 w-4" />
                                </Button>
                            </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
                <div className="text-center py-10 text-gray-500 flex flex-col items-center">
                    <AlertTriangle className="w-10 h-10 text-destructive mb-4" />
                    <p className="font-semibold">Could not load notification details.</p>
                </div>
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
