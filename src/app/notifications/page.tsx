'use client';

import { useState, useEffect, useCallback } from 'react';
import { JustdialHeader } from "@/components/justdial/JustdialHeader";
import { JustdialFooter } from "@/components/justdial/JustdialFooter";
import { FloatingButtons } from "@/components/justdial/FloatingButtons";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Tag, Star, Gift, Sparkles, Loader2, SearchX, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '@/lib/animations';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { getMyNotifications, type UserNotification } from './actions';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const { data, error } = await getMyNotifications(token);

    if (error) {
        setError(error);
        if (error.toLowerCase().includes('token')) {
            toast({ title: "Session Expired", description: "Please log in again.", variant: "destructive" });
            router.push('/login');
        } else {
             toast({ title: "Error", description: "Could not load notifications.", variant: "destructive" });
        }
    } else {
        setNotifications(data || []);
    }
    setLoading(false);
  }, [router, toast]);
  
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);
  
  const getIconForType = (type: string) => {
    switch(type) {
      case 'service': return Star;
      case 'report': return Tag;
      case 'normal': return Bell;
      default: return Gift;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
      
      {/* Enhanced Hero Section with Animated Background */}
      <section className="relative bg-gradient-to-br from-primary/5 via-accent/5 to-background pt-28 pb-16 overflow-hidden">
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

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <Bell className="h-10 w-10 text-primary" />
                {unreadCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {unreadCount}
                  </motion.div>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gradient-animated">
                Notifications
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Stay updated with your business activities and important updates
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <motion.path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="#ffffff"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </svg>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>
          ) : error ? (
            <div className="text-center py-20 bg-red-50 rounded-lg">
                <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4"/>
                <h3 className="text-xl font-semibold text-red-700">Failed to load notifications</h3>
                <p className="text-red-600">{error}</p>
            </div>
          ) : notifications.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-4 -mt-8"
            >
              {notifications.map((notification) => {
                const Icon = getIconForType(notification.type);
                return (
                    <motion.div
                    key={notification._id}
                    variants={staggerItem}
                    whileHover={{ scale: 1.02 }}
                    >
                    <Card className={cn(
                        "transition-all hover:shadow-lg border-border/50",
                        !notification.isRead && "bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20"
                    )}>
                        <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <motion.div 
                            className={cn(
                                "flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center",
                                !notification.isRead ? "bg-gradient-to-br from-primary/20 to-accent/20" : "bg-muted"
                            )}
                            animate={!notification.isRead ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                            >
                            <Icon className={cn(
                                "h-6 w-6",
                                !notification.isRead ? "text-primary" : "text-muted-foreground"
                            )} />
                            </motion.div>
                            <div className="flex-1">
                            <div className="flex items-start justify-between gap-4 mb-2">
                                <h3 className="font-semibold text-lg">{notification.subject}</h3>
                                {!notification.isRead && (
                                <Badge className="bg-primary text-primary-foreground">
                                    New
                                </Badge>
                                )}
                            </div>
                            <p className="text-muted-foreground mb-3">{notification.content}</p>
                            <div className="flex items-center gap-2">
                                <p className="text-xs text-muted-foreground">{new Date(notification.createdAt).toLocaleString()}</p>
                                {!notification.isRead && (
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="h-2 w-2 rounded-full bg-primary"
                                />
                                )}
                            </div>
                            </div>
                        </div>
                        </CardContent>
                    </Card>
                    </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-24 bg-card rounded-2xl shadow-xl border border-border/50 backdrop-blur-sm -mt-8"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Bell className="mx-auto h-20 w-20 text-muted-foreground mb-6" />
              </motion.div>
              <h2 className="text-2xl font-semibold text-foreground mb-3">No New Notifications</h2>
              <p className="text-muted-foreground text-lg">You&apos;re all caught up!</p>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mt-6">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Check back later for updates</span>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      
      <JustdialFooter />
    </motion.div>
  );
}