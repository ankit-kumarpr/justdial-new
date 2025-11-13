
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
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { updateNotification, type NotificationFormState } from '@/app/super-admin/notifications/actions';

type UpdateNotificationDialogProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    notification: any | null;
};

export function UpdateNotificationDialog({ isOpen, onOpenChange, onSuccess, notification }: UpdateNotificationDialogProps) {
    const { toast } = useToast();
    const [content, setContent] = useState('');
    const formRef = useRef<HTMLFormElement>(null);
    const lastMessageRef = useRef<string>();
    
    const initialState: NotificationFormState = {};
    const actionToCall = notification ? updateNotification.bind(null, notification._id) : async () => initialState;
    const [state, formAction, isPending] = useActionState(actionToCall, initialState);

    useEffect(() => {
        if (notification) {
            setContent(notification.content || '');
        }
    }, [notification]);

    useEffect(() => {
        if (state.message && state.message !== lastMessageRef.current) {
            lastMessageRef.current = state.message;
            if (state.success) {
                toast({ title: 'Success!', description: state.message });
                onSuccess();
            } else {
                toast({ title: 'Error', description: state.message, variant: 'destructive' });
            }
        }
    }, [state, toast, onSuccess]);
    
    const handleOpenChange = (open: boolean) => {
        if (!open) {
          formRef.current?.reset();
          setContent('');
        }
        onOpenChange(open);
    };

    const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    if (!notification) return null;

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Update Notification</DialogTitle>
                    <DialogDescription>
                        Edit the content for the notification: "{notification.subject}"
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction} ref={formRef}>
                    <input type="hidden" name="token" value={getToken() || ''} />
                    <div className="py-4">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                            id="content"
                            name="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={8}
                            className="mt-2"
                        />
                        {state?.errors?.content && <p className="text-xs text-red-500 mt-1">{state.errors.content[0]}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Notification
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
