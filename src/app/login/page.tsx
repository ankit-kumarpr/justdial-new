
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';
import { login, type LoginState } from './actions';
import { JustdialHeader } from "@/components/justdial/JustdialHeader";
import { JustdialFooter } from "@/components/justdial/JustdialFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LogIn, Lock, Mail, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  
  const initialState: LoginState = {};
  const [state, formAction, isPending] = useActionState(login, initialState);

  useEffect(() => {
    if (state?.message) {
      if (state.user && state.accessToken && state.refreshToken) {
        localStorage.setItem('accessToken', state.accessToken);
        localStorage.setItem('refreshToken', state.refreshToken);
        localStorage.setItem('user', JSON.stringify(state.user));
        
        window.dispatchEvent(new Event("storage")); 

        toast({
            title: "Login Successful! 🎉",
            description: `Welcome back, ${state.user.name}! Redirecting...`,
        });
        
        if (state.user.role === 'superadmin') {
            setTimeout(() => router.push('/super-admin'), 1000);
        } else if (state.user.role === 'admin') {
            setTimeout(() => router.push('/admin'), 1000);
        } else {
            setTimeout(() => router.push('/'), 1000);
        }
      } else if (state.errors) {
         toast({
            title: "Login Failed",
            description: state.message,
            variant: "destructive"
        });
      }
    }
  }, [state, router, toast]);

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
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <main className="flex-grow flex items-center justify-center py-12 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95 hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-50" />
            
            <CardHeader className="text-center relative z-10 pt-8 pb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-4 shadow-xl"
              >
                <LogIn className="h-8 w-8 text-white" />
              </motion.div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Login to access your Gnetdial account
              </CardDescription>
            </CardHeader>

            <CardContent className="relative z-10 px-8 pb-8">
              <form action={formAction} className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    Email
                  </Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    placeholder="Enter your email" 
                    className={`h-12 rounded-xl border-2 transition-all duration-300 ${
                      state?.errors?.email ? 'border-red-500 focus:border-red-500' : 'focus:border-primary'
                    }`}
                  />
                  {state?.errors?.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-500 flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3" />
                      {state.errors.email[0]}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-semibold flex items-center gap-2">
                      <Lock className="h-4 w-4 text-primary" />
                      Password
                    </Label>
                    <Link href="/forgot-password" className="text-sm text-accent hover:text-accent/80 font-medium transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input 
                      id="password"
                      name="password" 
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password" 
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
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-500 flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3" />
                      {state.errors.password[0]}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="flex items-center space-x-2"
                >
                  <Checkbox id="remember" />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Remember me for 30 days
                  </Label>
                </motion.div>
                
                {state?.errors?.server && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-lg text-sm"
                    >
                      <p>{state.errors.server[0]}</p>
                    </motion.div>
                )}


                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                    <Button 
                        type="submit" 
                        className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:shadow-xl text-white rounded-xl font-semibold text-base transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            Logging in...
                            </>
                        ) : (
                            'Login'
                        )}
                    </Button>
                </motion.div>
              </form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <div className="mt-8 text-center text-sm">
                  Don't have an account?{" "}
                  <Link href="/register" className="font-semibold text-accent hover:text-accent/80 transition-colors underline-offset-4 hover:underline">
                    Sign up now
                  </Link>
                </div>
              </motion.div>
              
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <JustdialFooter />
    </motion.div>
  );
}
