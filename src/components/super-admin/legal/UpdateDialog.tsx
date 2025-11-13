
'use client';

import { useState, useEffect, useActionState, useMemo } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { updateTerms, updatePrivacyPolicy, type LegalFormState } from '@/app/super-admin/legal/actions';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

type UpdateDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  doc: { id: string; title: string; content: string; };
};

export function UpdateDialog({ isOpen, onClose, onSuccess, doc }: UpdateDialogProps) {
  const { toast } = useToast();
  const [content, setContent] = useState(doc.content);
  const initialState: LegalFormState = {};
  
  const actionToCall = doc.title === 'Terms & Conditions' ? updateTerms : updatePrivacyPolicy;
  const [state, formAction, isPending] = useActionState(actionToCall, initialState);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({ title: 'Success!', description: state.message });
        onSuccess();
        onClose();
      } else {
        toast({ title: 'Error', description: state.message, variant: 'destructive' });
      }
    }
  }, [state, toast, onClose, onSuccess]);

  useEffect(() => {
    if(isOpen) {
        setContent(doc.content);
    }
  }, [isOpen, doc.content])
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : '';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Update {doc.title}</DialogTitle>
          <DialogDescription>
            Make changes to the content below. Your changes will be live upon saving.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="flex flex-col flex-1 min-h-0">
          <input type="hidden" name="token" value={token || ''} />
          <input type="hidden" name="id" value={doc.id || ''} />
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full">
              <Textarea
                name="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="h-full min-h-[300px] text-sm"
                placeholder="Enter document content here..."
              />
            </ScrollArea>
            {state.errors?.content && <p className="text-xs text-red-500 mt-1">{state.errors.content[0]}</p>}
            {state.errors?.server && <p className="text-xs text-red-500 mt-1">{state.errors.server[0]}</p>}
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
