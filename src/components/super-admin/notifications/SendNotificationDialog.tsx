
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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import { Send, Loader2, Paperclip, X } from "lucide-react";
import { sendNotification, type NotificationFormState } from '@/app/super-admin/notifications/actions';
import { motion, AnimatePresence } from 'framer-motion';

const MAX_FILES = 5;

type SendNotificationDialogProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
};

export function SendNotificationDialog({ isOpen, onOpenChange, onSuccess }: SendNotificationDialogProps) {
    const { toast } = useToast();
    const initialState: NotificationFormState = {};
    const [state, formAction, isPending] = useActionState(sendNotification, initialState);
    
    const [token, setToken] = useState<string | null>(null);
    const [recipientType, setRecipientType] = useState<string>('');
    const [attachments, setAttachments] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const lastMessageRef = useRef<string>();


    useEffect(() => {
        if (typeof window !== 'undefined') {
            setToken(localStorage.getItem('accessToken'));
        }
    }, []);

    useEffect(() => {
        if (state.message && state.message !== lastMessageRef.current) {
            lastMessageRef.current = state.message;
            if (state.success) {
                toast({ title: 'Success', description: state.message });
                onSuccess();
            } else {
                toast({ title: 'Error', description: state.message, variant: 'destructive' });
            }
        }
    }, [state, toast, onSuccess]);
    
     useEffect(() => {
        if (!isOpen) {
          formRef.current?.reset();
          setRecipientType('');
          setAttachments([]);
          // Reset the action state if needed, though useActionState doesn't have a built-in reset
        }
    }, [isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            const totalFiles = attachments.length + newFiles.length;
            if (totalFiles > MAX_FILES) {
                toast({
                    title: 'Too many files',
                    description: `You can only upload a maximum of ${MAX_FILES} files.`,
                    variant: 'destructive',
                });
                return;
            }
            setAttachments(prev => [...prev, ...newFiles]);
        }
    };

    const removeAttachment = (indexToRemove: number) => {
        setAttachments(prev => prev.filter((_, index) => index !== indexToRemove));
        // This is a bit tricky with FileList, a better approach might involve managing the files in state
        // and constructing the FormData on submission. For now, this just removes from display.
        if (fileInputRef.current) {
            const dt = new DataTransfer();
            attachments.filter((_, i) => i !== indexToRemove).forEach(file => dt.items.add(file));
            fileInputRef.current.files = dt.files;
        }
    };

    const showRecipientId = ['single_user', 'single_vendor'].includes(recipientType);
    
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><Send /> Send Notification</DialogTitle>
                    <DialogDescription>Compose and send a notification to users or vendors.</DialogDescription>
                </DialogHeader>
                <form action={formAction} ref={formRef} className="space-y-6">
                    <input type="hidden" name="token" value={token || ''} />
                    <input type="file" name="attachments" multiple ref={fileInputRef} className="hidden" onChange={handleFileChange} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Notification Type</Label>
                            <Select name="type">
                                <SelectTrigger id="type"><SelectValue placeholder="Select type..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="service">Service</SelectItem>
                                    <SelectItem value="report">Report</SelectItem>
                                </SelectContent>
                            </Select>
                            {state.errors?.type && <p className="text-xs text-red-500">{state.errors.type[0]}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="recipientType">Recipient Type</Label>
                            <Select name="recipientType" onValueChange={setRecipientType} value={recipientType}>
                                <SelectTrigger id="recipientType"><SelectValue placeholder="Select recipients..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all_users">All Users</SelectItem>
                                    <SelectItem value="all_vendors">All Vendors</SelectItem>
                                    <SelectItem value="single_user">Single User</SelectItem>
                                    <SelectItem value="single_vendor">Single Vendor</SelectItem>
                                </SelectContent>
                            </Select>
                            {state.errors?.recipientType && <p className="text-xs text-red-500">{state.errors.recipientType[0]}</p>}
                        </div>
                    </div>
                    
                    <AnimatePresence>
                        {showRecipientId && (
                            <motion.div
                                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                animate={{ height: 'auto', opacity: 1, marginTop: '1.5rem' }}
                                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-2 overflow-hidden"
                            >
                                <Label htmlFor="recipientIds">Recipient ID</Label>
                                <Input id="recipientIds" name="recipientIds" placeholder={`Enter ${recipientType.replace('_', ' ')} ID`} />
                                {state.errors?.recipientIds && <p className="text-xs text-red-500">{state.errors.recipientIds[0]}</p>}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject / Title</Label>
                        <Input id="subject" name="subject" placeholder="Enter notification title" />
                        {state.errors?.subject && <p className="text-xs text-red-500">{state.errors.subject[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">Content / Body</Label>
                        <Textarea id="content" name="content" placeholder="Enter the main message of the notification." rows={5}/>
                        {state.errors?.content && <p className="text-xs text-red-500">{state.errors.content[0]}</p>}
                    </div>
                    
                    <div className="space-y-3">
                        <Label>Attachments (Max {MAX_FILES})</Label>
                        {attachments.length > 0 && (
                            <div className="space-y-2">
                                <AnimatePresence>
                                {attachments.map((file, index) => (
                                    <motion.div 
                                        key={file.name + index} 
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="flex items-center justify-between p-2 text-sm bg-gray-100 rounded-md"
                                    >
                                        <span className="truncate">{file.name}</span>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeAttachment(index)} className="h-6 w-6">
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </motion.div>
                                ))}
                                </AnimatePresence>
                            </div>
                        )}
                        <Button type="button" variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                            <Paperclip className="mr-2 h-4 w-4" /> Add Attachment
                        </Button>
                        {state.errors?.attachments && <p className="text-xs text-red-500">{state.errors.attachments[0]}</p>}
                    </div>

                    {state.errors?.server && <p className="text-sm text-red-500">{state.errors.server[0]}</p>}

                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Send Notification
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
