

'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
    Rocket, ChevronRight, Heart, Bookmark, User,
    Bell, Briefcase, Mail, Headset, Shield, MessageSquare, HelpCircle, LogOut, Star
} from 'lucide-react';
import Link from "next/link";
import { Separator } from "../ui/separator";
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

const menuItems = [
    { icon: Heart, label: "Favorites", href: "/favourites" },
    { icon: Bookmark, label: "Saved", href: "/saved" },
    { icon: Star, label: "My Reviews", href: "/reviews" },
    { icon: User, label: "Edit Profile", href: "/edit-profile" },
];

const bottomMenuItems = [
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: Briefcase, label: "My Business", href: "/my-business" },
    { icon: Mail, label: "Leads", href: "/user-enquiries" },
    { icon: Headset, label: "Customer Service", href: "/customer-service" },
];

const policyItems = [
    { icon: Shield, label: "Policy", href: "/policy" },
    { icon: MessageSquare, label: "Feedback", href: "/customer-service" },
    { icon: HelpCircle, label: "Help", href: "/help" },
    { icon: LogOut, label: "Logout", action: 'logout' },
];

export function UserProfileSheet({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (isOpen: boolean) => void }) {
  const [userName, setUserName] = useState('User Profile');
  const [userEmail, setUserEmail] = useState('Click to view profile');
  const router = useRouter();

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setUserName(user.name || 'User Profile');
          setUserEmail(user.email || 'Click to view profile');
        } catch (e) {
          console.error("Failed to parse user data from cookie", e);
        }
      } else {
        setUserName('User Profile');
        setUserEmail('Click to view profile');
      }
    }
  }, [isOpen]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event("storage")); // Notify other tabs/windows
      onOpenChange(false);
      router.push('/');
    }
  };

  const handleItemClick = (item: { action?: string, href?: string }) => {
    if (item.action === 'logout') {
      handleLogout();
    } else {
      onOpenChange(false);
    }
  }
  
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full md:w-[380px] sm:w-[340px] p-0 flex flex-col bg-white" side="right">
           <SheetHeader className="flex items-center justify-between p-4 border-b">
              <SheetTitle>Profile</SheetTitle>
          </SheetHeader>
        <ScrollArea className="flex-1">
          <motion.div 
            className="p-4 space-y-4"
            initial="hidden"
            animate={isOpen ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            <motion.div variants={staggerItem}>
              <Link href="/edit-profile" passHref>
                  <div className="flex items-center gap-4 cursor-pointer" onClick={() => onOpenChange(false)}>
                      <Avatar className="h-12 w-12">
                          <AvatarImage src="https://github.com/shadcn.png" alt="User Profile" />
                          <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div>
                          <p className="font-bold text-lg">{userName}</p>
                          <p className="text-sm text-gray-500">{userEmail}</p>
                      </div>
                  </div>
              </Link>
            </motion.div>
            
            <motion.div variants={staggerItem}><Separator /></motion.div>

            <motion.div variants={staggerItem}>
              <Link href="#" passHref>
                  <div className="bg-primary/10 border border-primary/20 p-3 rounded-lg flex items-center justify-between cursor-pointer hover:bg-primary/20" onClick={() => onOpenChange(false)}>
                      <div className="flex items-center gap-3">
                          <div className="bg-primary/20 p-2 rounded-full">
                              <Rocket className="h-5 w-5 text-primary" />
                          </div>
                          <span className="font-semibold text-sm">Boost Your Business</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
              </Link>
            </motion.div>

            <motion.div variants={staggerItem}><Separator /></motion.div>

            <motion.div variants={staggerContainer} className="space-y-1">
                {menuItems.map(item => (
                    <motion.div variants={staggerItem} key={item.label}>
                      <Link href={item.href} passHref>
                          <div className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100" onClick={() => onOpenChange(false)}>
                              <item.icon className="h-5 w-5 text-gray-600" />
                              <span className="text-sm font-medium">{item.label}</span>
                          </div>
                      </Link>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div variants={staggerItem}><Separator /></motion.div>

            <motion.div variants={staggerContainer} className="space-y-1">
                {bottomMenuItems.map(item => (
                    <motion.div variants={staggerItem} key={item.label}>
                      <Link href={item.href} passHref>
                          <div className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100" onClick={() => onOpenChange(false)}>
                              <item.icon className="h-5 w-5 text-gray-600" />
                              <span className="text-sm font-medium">{item.label}</span>
                          </div>
                      </Link>
                    </motion.div>
                ))}
            </motion.div>
            
            <motion.div variants={staggerItem}><Separator /></motion.div>

            <motion.div variants={staggerContainer} className="space-y-1">
                {policyItems.map(item => {
                  const Wrapper = item.href ? Link : 'div';
                  const props = item.href ? { href: item.href, passHref: true } : { onClick: () => handleItemClick(item) };
                  return (
                    <motion.div variants={staggerItem} key={item.label}>
                      <Wrapper {...props}>
                        <div className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100">
                          <item.icon className="h-5 w-5 text-gray-600" />
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                      </Wrapper>
                    </motion.div>
                  )
                })}
            </motion.div>

          </motion.div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
