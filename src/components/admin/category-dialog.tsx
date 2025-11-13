
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Category } from "@/lib/types";
import { useEffect, useState, useRef } from "react";
import { useActionState } from 'react';
import { createCategory, updateCategory, type FormState } from "@/app/super-admin/categories/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Image from "next/image";

type CategoryDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onSuccess?: () => void;
};

export function CategoryDialog({ isOpen, onClose, category, onSuccess }: CategoryDialogProps) {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [iconImage, setIconImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const lastMessageRef = useRef<string | null>();

  const isEditing = !!category;
  
  const initialState: FormState = {};
  const actionToCall = isEditing ? updateCategory.bind(null, category.id!) : createCategory;
  const [state, formAction, isPending] = useActionState(actionToCall, initialState);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setPreview(category.icon_url || null);
    } else {
      setName('');
      setPreview(null);
    }
    setIconImage(null);
    formRef.current?.reset();
  }, [category, isOpen]);
  
  useEffect(() => {
    if (state?.message && state.message !== lastMessageRef.current) {
        lastMessageRef.current = state.message;
        if(state.errors) {
            toast({ title: 'Error', description: state.message, variant: 'destructive' });
        } else {
            toast({ title: 'Success!', description: state.message });
            if (onSuccess) {
              onSuccess();
            }
            onClose();
        }
    }
  }, [state, toast, onClose, onSuccess]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('accessToken');
    }
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Category' : 'Add New Category'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the details for this category.' : 'Fill in the details for the new category.'}
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} ref={formRef}>
            <input type="hidden" name="token" value={getToken() || ''} />
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="categoryName" className="text-right">Name</Label>
                  <Input id="categoryName" name="categoryName" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" placeholder="e.g., Coffee Shops"/>
              </div>
              {state?.errors?.categoryName && <p className="col-span-4 text-xs text-red-500 text-right -mt-2">{state.errors.categoryName[0]}</p>}
              
              <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="categoryImage" className="text-right">Icon</Label>
                  <div className="col-span-3 flex items-center gap-4">
                    {preview && <Image src={preview} alt="Icon preview" width={40} height={40} className="rounded-full object-cover" />}
                    <Input id="categoryImage" name="categoryImage" type="file" onChange={handleFileChange} className="col-span-3" accept="image/*" />
                  </div>
              </div>
              {isEditing && category?.icon_url && <input type="hidden" name="current_icon_url" value={category.icon_url} />}
            </div>
            <DialogFooter>
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEditing ? 'Save Changes' : 'Create Category'}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
