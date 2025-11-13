
'use client';

import { useEffect, useState, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { register, verifyOtpAndCreateUser, type RegisterState, type OtpState } from './actions';
import { JustdialHeader } from "@/components/justdial/JustdialHeader";
import { JustdialFooter } from "@/components/justdial/JustdialFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserPlus, User, Mail, Loader2, AlertCircle, Phone, Lock, KeyRound } from "lucide-react";
import Link from "next/link";
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { useLocation } from '@/contexts/LocationContext';

function OtpForm({ state, otpFormAction, isOtpPending, latitude, longitude, city, streetAddress, pincode, userState }: { state: RegisterState, otpFormAction: (payload: FormData) => void, isOtpPending: boolean, latitude: number | null, longitude: number | null, city: string, streetAddress: string, pincode: string, userState: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <form action={otpFormAction} className="space-y-4">
        {/* Hidden fields to pass user data */}
        <input type="hidden" name="name" value={state.userData?.name} />
        <input type="hidden" name="email" value={state.userData?.email} />
        <input type="hidden" name="phone" value={state.userData?.phone} />
        <input type="hidden" name="hashedPassword" value={state.userData?.hashedPassword} />
        <input type="hidden" name="generatedOtp" value={state.userData?.generatedOtp} />
        <input type="hidden" name="userId" value={state.userData?.userId} />

        {/* Hidden fields for location */}
        <input type="hidden" name="latitude" value={latitude || ''} />
        <input type="hidden" name="longitude" value={longitude || ''} />
        <input type="hidden" name="city" value={city || ''} />
        <input type="hidden" name="streetAddress" value={streetAddress || ''} />
        <input type="hidden" name="pincode" value={pincode || ''} />
        <input type="hidden" name="state" value={userState || ''} />
        
        <div className="space-y-2">
            <Label htmlFor="otp" className="text-sm font-semibold flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-accent" />
              Enter OTP
            </Label>
            <Input 
              id="otp" 
              name="otp"
              type="text" 
              maxLength={6}
              placeholder="_ _ _ _ _ _"
              className="text-center tracking-[0.5em] text-lg font-semibold h-12 rounded-xl border-2 focus:border-accent"
            />
             {(state as OtpState).errors?.otp && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{(state as OtpState).errors.otp[0]}</motion.p>}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-accent to-primary hover:shadow-xl text-white rounded-xl font-semibold text-base transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={isOtpPending}
            >
                {isOtpPending ? (<><Loader2 className="h-5 w-5 mr-2 animate-spin" />Verifying...</>) : ('Verify & Create Account')}
            </Button>
        </motion.div>
         {(state as OtpState).errors?.server && (
            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 text-center flex items-center gap-1 justify-center"><AlertCircle className="h-3 w-3" />{(state as OtpState).errors.server[0]}</motion.p>
        )}
      </form>
    </motion.div>
  );
}


export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { latitude, longitude, city } = useLocation();
  
  const initialRegisterState: RegisterState = {};
  const [registerState, registerFormAction, isRegisterPending] = useActionState(register, initialRegisterState);
  
  const initialOtpState: OtpState = {};
  const [otpState, otpFormAction, isOtpPending] = useActionState(verifyOtpAndCreateUser, initialOtpState);

  const finalRegisterState = registerState.requiresOtp ? { ...initialRegisterState, ...registerState } : { ...otpState, ...registerState };

  useEffect(() => {
    if (registerState.message && registerState.requiresOtp) {
        toast({
            title: "OTP Sent!",
            description: registerState.message,
        });
    } else if (registerState.message && registerState.errors) {
         toast({
            title: "Registration Error",
            description: registerState.message,
            variant: "destructive",
        });
    }
  }, [registerState, toast]);

  useEffect(() => {
    if (otpState.message) {
      if (otpState.errors) {
        toast({
          title: "Verification Error",
          description: otpState.message,
          variant: "destructive",
        });
      } else {
         toast({
          title: "Registration Successful! 🎉",
          description: otpState.message,
        });
        setTimeout(() => {
          router.push('/login');
        }, 1000);
      }
    }
  }, [otpState, router, toast]);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50"
    >
      <JustdialHeader />

      <main className="flex-grow flex items-center justify-center py-12 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95 hover:shadow-3xl transition-all duration-500 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-50" />
            <CardHeader className="text-center relative z-10 pt-8 pb-6">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.4, type: "spring" }}
                className="mx-auto w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center mb-4 shadow-xl"
              >
                <UserPlus className="h-8 w-8 text-white" />
              </motion.div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                 {registerState.requiresOtp ? 'Verify Your Email' : 'Create Account'}
              </CardTitle>
              <CardDescription className="text-base mt-2">
                 {registerState.requiresOtp ? `Enter the OTP sent to ${registerState.userData?.email}` : 'Join Gnetdial to discover local businesses'}
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 px-8 pb-8">
              {registerState.requiresOtp ? (
                <OtpForm 
                    state={registerState} 
                    otpFormAction={otpFormAction} 
                    isOtpPending={isOtpPending}
                    latitude={latitude}
                    longitude={longitude}
                    city={city}
                    streetAddress=""
                    pincode=""
                    userState=""
                />
              ) : (
                <form action={registerFormAction} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
                        <User className="h-4 w-4 text-accent" />
                        Full Name
                      </Label>
                      <Input id="name" name="name" type="text" placeholder="John Doe" className={`h-11 rounded-xl border-2 transition-all duration-300 ${finalRegisterState.errors?.name ? 'border-red-500 focus:border-red-500' : 'focus:border-accent'}`} />
                      {finalRegisterState.errors?.name && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{finalRegisterState.errors.name[0]}</motion.p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                        <Mail className="h-4 w-4 text-accent" />
                        Email Address
                      </Label>
                      <Input id="email" name="email" type="email" placeholder="you@example.com" className={`h-11 rounded-xl border-2 transition-all duration-300 ${finalRegisterState.errors?.email ? 'border-red-500 focus:border-red-500' : 'focus:border-accent'}`} />
                      {finalRegisterState.errors?.email && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{finalRegisterState.errors.email[0]}</motion.p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobile" className="text-sm font-semibold flex items-center gap-2">
                          <Phone className="h-4 w-4 text-accent" />
                          Mobile Number
                      </Label>
                      <Input id="mobile" name="phone" type="tel" placeholder="10-digit mobile number" className={`h-11 rounded-xl border-2 transition-all duration-300 ${finalRegisterState.errors?.phone ? 'border-red-500 focus:border-red-500' : 'focus:border-accent'}`} />
                      {finalRegisterState.errors?.phone && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{finalRegisterState.errors.phone[0]}</motion.p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-semibold flex items-center gap-2">
                        <Lock className="h-4 w-4 text-accent" />
                        Password
                      </Label>
                      <Input id="password" name="password" type="password" placeholder="Create a strong password" className={`h-11 rounded-xl border-2 transition-all duration-300 ${finalRegisterState.errors?.password ? 'border-red-500 focus:border-red-500' : 'focus:border-accent'}`} />
                      {finalRegisterState.errors?.password && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{finalRegisterState.errors.password[0]}</motion.p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-semibold flex items-center gap-2">
                        <Lock className="h-4 w-4 text-accent" />
                        Confirm Password
                      </Label>
                      <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm your password" className="h-11 rounded-xl border-2 transition-all duration-300 focus:border-accent" />
                       {finalRegisterState.errors?.cpassword && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{finalRegisterState.errors.cpassword[0]}</motion.p>}
                    </div>
                    <div className="space-y-2 pt-2">
                      <div className="flex items-start space-x-2">
                        <Checkbox id="terms" name="acceptTerms" />
                        <Label htmlFor="terms" className="text-sm font-medium leading-tight cursor-pointer">I agree to the <Link href="#" className="text-accent hover:text-accent/80 underline underline-offset-2">Terms</Link> and <Link href="#" className="text-accent hover:text-accent/80 underline underline-offset-2">Privacy Policy</Link></Label>
                      </div>
                    </div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 }} className="pt-2">
                      <Button 
                          type="submit" 
                          className="w-full h-12 bg-gradient-to-r from-accent to-primary hover:shadow-xl text-white rounded-xl font-semibold text-base transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                          disabled={isRegisterPending}
                      >
                          {isRegisterPending ? (<><Loader2 className="h-5 w-5 mr-2 animate-spin" />Registering...</>) : ('Create Account')}
                      </Button>
                  </motion.div>
                </form>
              )}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.9 }}>
                <div className="mt-7 text-center text-sm">
                  Already have an account? <Link href="/login" className="font-semibold text-accent hover:text-accent/80 transition-colors underline-offset-4 hover:underline">Login here</Link>
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
