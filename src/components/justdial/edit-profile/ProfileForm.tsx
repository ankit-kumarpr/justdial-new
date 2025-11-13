
'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Loader2, AlertCircle } from "lucide-react";
import { useEffect, useState, useActionState, useMemo } from 'react';
import { updateProfile, type ProfileFormState } from '@/app/edit-profile/actions';
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";


export function ProfileForm({ user }: { user: { name: string; phone: string; email: string; } | null }) {
    const { toast } = useToast();
    const [token, setToken] = useState<string | null>(null);
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');

    useEffect(() => {
        const userToken = localStorage.getItem('accessToken');
        if (userToken) {
            setToken(userToken);
        }
        if (user) {
            setName(user.name);
            setPhone(user.phone);
        }
    }, [user]);
    
    const initialState: ProfileFormState = {};
    const [state, formAction, isPending] = useActionState(updateProfile, initialState);

    useEffect(() => {
        if (state.message) {
            if (state.success && state.updatedUser) {
                toast({ title: "Success!", description: state.message });
                // Update local storage and re-trigger user state update in header/sheets
                localStorage.setItem('user', JSON.stringify(state.updatedUser));
                window.dispatchEvent(new Event('storage'));
            } else if (state.errors) {
                toast({ title: "Error", description: state.message, variant: "destructive" });
            }
        }
    }, [state, toast]);

    const formKey = useMemo(() => JSON.stringify(user), [user]);

  return (
    <form action={formAction} key={formKey}>
        <input type="hidden" name="token" value={token || ''} />
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your name and phone number.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                  <Label htmlFor="name" className="text-sm text-gray-600">Full Name <span className="text-red-500">*</span></Label>
                  <Input id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
                   {state.errors?.name && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{state.errors.name[0]}</motion.p>}
              </div>

              <div>
                  <Label htmlFor="email" className="text-sm text-gray-600">Email ID</Label>
                  <Input id="email" name="email" type="email" defaultValue={user?.email || ''} disabled className="mt-1 bg-gray-100" />
              </div>

              <div>
                  <Label htmlFor="phone" className="text-sm text-gray-600">Mobile Number <span className="text-red-500">*</span></Label>
                   <div className="relative mt-1">
                      <Input id="phone" name="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="pr-16" />
                      <div className="absolute inset-y-0 right-2 flex items-center gap-2">
                          <Lock className="h-4 w-4 text-gray-400" />
                      </div>
                  </div>
                   {state.errors?.phone && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{state.errors.phone[0]}</motion.p>}
              </div>
            </div>

            <div className="flex justify-end">
                <Button size="lg" type="submit" className="bg-primary hover:bg-primary/90" disabled={isPending}>
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isPending ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </CardContent>
        </Card>
    </form>
  );
}
