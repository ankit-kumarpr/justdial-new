
'use client';

import { useState, useEffect, Suspense } from "react";
import { JustdialHeader } from "@/components/justdial/JustdialHeader";
import { JustdialFooter } from "@/components/justdial/JustdialFooter";
import { ProfileForm } from "@/components/justdial/edit-profile/ProfileForm";
import { UserCog, Loader2 } from "lucide-react";
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { FloatingButtons } from '@/components/justdial/FloatingButtons';
import { apiFetch } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

function EditProfilePageComponent() {
  const [user, setUser] = useState<{name: string, phone: string, email: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast({ title: "Authentication Error", description: "Please log in to edit your profile.", variant: "destructive" });
        router.push('/login');
        return;
      }

      try {
        const result = await apiFetch('/api/auth/my-location', token);
        const userData = result.data.user; // Correctly access the nested user object
        if (userData && userData.name && userData.email && userData.phone) {
          setUser({
            name: userData.name,
            email: userData.email,
            phone: userData.phone
          });
        } else {
            throw new Error("User data not found in API response.");
        }
      } catch (err: any) {
        toast({ title: "Error", description: `Failed to fetch profile: ${err.message}`, variant: "destructive" });
        if (err.message.includes('token')) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [router, toast]);


  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen"
    >
      <JustdialHeader />
      <FloatingButtons />

      {/* Animated background blobs */}
      <motion.div
        className="fixed top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"
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
        className="fixed bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none"
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

      <header className="bg-white/80 backdrop-blur-md border-b shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="h-10 w-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
              <UserCog className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-lg text-gray-800">{user?.name || 'My Profile'}</h1>
              <p className="text-sm text-gray-500">{user?.email || ''}</p>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {user && <ProfileForm user={user} />}
          </motion.div>
        </div>
      </main>

      <JustdialFooter />
    </motion.div>
  );
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EditProfilePageComponent />
        </Suspense>
    )
}
