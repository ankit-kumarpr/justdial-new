

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';
import { resetPassword, type ResetPasswordState } from './actions';
import { JustdialHeader } from "@/components/justdial/JustdialHeader";
import { JustdialFooter } from "@/components/justdial/JustdialFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { useSearchParams } from 'next/navigation';

function ResetPasswordForm() {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const initialState: ResetPasswordState = { token: token || undefined };
  const [state, formAction, isPending] = useActionState(resetPassword, initialState);

  useEffect(() => {
    if (state?.message) {
      if (state.errors) {
        toast({
          title: "Error",
          description: state.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success!",
          description: state.message,
        });
        setTimeout(() => router.push('/login'), 2000);
      }
    }
  }, [state, router, toast]);

  if (!token) {
    return (
        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95 rounded-3xl overflow-hidden">
            <CardHeader className="text-center relative z-10 pt-8 pb-6">
                <CardTitle className="text-2xl font-bold text-destructive">Invalid Reset Link</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-center text-muted-foreground">The password reset link is missing or invalid. Please request a new one.</p>
                <div className="mt-6 text-center">
                    <Button asChild>
                        <Link href="/forgot-password">Request New Link</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95 hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-50" />
      <CardHeader className="text-center relative z-10 pt-8 pb-6">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Reset Your Password
        </CardTitle>
        <CardDescription className="text-base mt-2">
          Choose a new, strong password for your account.
        </CardDescription>
      </CardHeader>

      <CardContent className="relative z-10 px-8 pb-8">
        <form action={formAction} className="space-y-5">
           <input type="hidden" name="token" value={token} />
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="space-y-2"
          >
            <Label htmlFor="password" className="text-sm font-semibold flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                New Password
            </Label>
            <div className="relative">
                <Input 
                  id="password"
                  name="password" 
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password" 
                  className={`h-12 rounded-xl border-2 pr-12 transition-all duration-300 ${
                    state?.errors?.password ? 'border-red-500 focus:border-red-500' : 'focus:border-primary'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
            </div>
            {state?.errors?.password && (
              <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {state.errors.password[0]}
              </motion.p>
            )}
          </motion.div>

           <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-2"
          >
            <Label htmlFor="confirmPassword" className="text-sm font-semibold flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                Confirm New Password
            </Label>
             <div className="relative">
                <Input 
                  id="confirmPassword"
                  name="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password" 
                  className={`h-12 rounded-xl border-2 pr-12 transition-all duration-300 ${
                    state?.errors?.confirmPassword ? 'border-red-500 focus:border-red-500' : 'focus:border-primary'
                  }`}
                />
                 <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
            </div>
            {state?.errors?.confirmPassword && (
              <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {state.errors.confirmPassword[0]}
              </motion.p>
            )}
          </motion.div>
          
          {state?.errors?.server && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-lg text-sm">
                <p>{state.errors.server[0]}</p>
              </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 }}>
              <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:shadow-xl text-white rounded-xl font-semibold text-base transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                  disabled={isPending}
              >
                  {isPending ? (<><Loader2 className="h-5 w-5 mr-2 animate-spin" />Updating...</>) : ('Reset Password')}
              </Button>
          </motion.div>
        </form>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.9 }}>
          <div className="mt-8 text-center text-sm">
            Remembered your password?{" "}
            <Link href="/login" className="font-semibold text-accent hover:text-accent/80 transition-colors underline-offset-4 hover:underline">
              Login here
            </Link>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}


function ResetPasswordPage() {
    return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50"
    >
      <JustdialHeader />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <main className="flex-grow flex items-center justify-center py-12 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
            <Suspense fallback={<div>Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </motion.div>
      </main>
      <JustdialFooter />
    </motion.div>
    );
}

export default function Page() {
  return (
    <Suspense>
      <ResetPasswordPage />
    </Suspense>
  )
}
