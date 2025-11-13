
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { History, Loader2, PlusCircle, SearchX, Edit, Trash2 } from "lucide-react";
import { getAllNotifications, deleteNotification } from './actions';
import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { SendNotificationDialog } from '@/components/super-admin/notifications/SendNotificationDialog';
import { NotificationDetailsDialog } from '@/components/super-admin/notifications/NotificationDetailsDialog';
import { UpdateNotificationDialog } from '@/components/super-admin/notifications/UpdateNotificationDialog';
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

function NotificationHistory({ onRefresh }: { onRefresh: () => void }) {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<any | null>(null);
    const { toast } = useToast();

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        if(!token) {
            setLoading(false);
            return;
        }
        const result = await getAllNotifications(token);
        if (result.error) {
            toast({ title: 'Error', description: `Could not fetch history: ${result.error}`, variant: 'destructive' });
        } else {
            setNotifications(result.data || []);
        }
        setLoading(false);
    }, [toast]);
    
    useEffect(() => {
      fetchHistory();
    }, [fetchHistory]);

    const handleSuccess = () => {
        setIsSendDialogOpen(false);
        setIsUpdateOpen(false);
        fetchHistory();
        onRefresh();
    };

    const handleViewDetails = (notification: any) => {
        setSelectedNotification(notification);
        setIsDetailsOpen(true);
    };

    const handleEdit = (notification: any) => {
        setSelectedNotification(notification);
        setIsUpdateOpen(true);
    };
    
    const handleDelete = async (notificationId: string) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast({ title: 'Error', description: 'Authentication required.', variant: 'destructive' });
            return;
        }
        const result = await deleteNotification(notificationId, token);
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            fetchHistory(); // Refresh the list
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    };

    return (
      <>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2"><History /> Notification History</CardTitle>
                    <CardDescription>A log of all previously sent notifications.</CardDescription>
                </div>
                <Button onClick={() => setIsSendDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Send New Notification
                </Button>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center items-center h-48">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-10">
                        <SearchX className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-center text-sm text-gray-500">No notifications have been sent yet.</p>
                    </div>
                ) : (
                    <div className="border rounded-lg max-h-96 overflow-y-auto">
                        <Table>
                            <TableHeader className="sticky top-0 bg-gray-50 z-10">
                                <TableRow>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Recipients</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {notifications.map(n => (
                                    <TableRow key={n._id}>
                                        <TableCell className="font-medium truncate max-w-xs">{n.subject}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="capitalize">
                                                {n.recipientType.replace('_', ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(n.createdAt).toLocaleString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" onClick={() => handleViewDetails(n)}>
                                                View
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(n)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                             <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will permanently delete the notification "{n.subject}". This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(n._id)}>Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>

        <SendNotificationDialog 
            isOpen={isSendDialogOpen} 
            onOpenChange={setIsSendDialogOpen} 
            onSuccess={handleSuccess}
        />
        
        {selectedNotification && (
            <NotificationDetailsDialog
                isOpen={isDetailsOpen}
                onOpenChange={(open) => {
                    if (!open) setSelectedNotification(null);
                    setIsDetailsOpen(open);
                }}
                notificationId={selectedNotification._id}
            />
        )}

        {selectedNotification && (
            <UpdateNotificationDialog
                isOpen={isUpdateOpen}
                onOpenChange={(open) => {
                    if (!open) setSelectedNotification(null);
                    setIsUpdateOpen(open);
                }}
                notification={selectedNotification}
                onSuccess={handleSuccess}
            />
        )}
      </>
    )
}

export default function SendNotificationPage() {
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <main className="p-4 md:p-8">
            <motion.div 
                key={refreshKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
               <NotificationHistory onRefresh={() => setRefreshKey(prev => prev + 1)} />
            </motion.div>
        </main>
    );
}
