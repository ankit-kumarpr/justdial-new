
'use client';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarTrigger, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, Users, Settings, PlusCircle, Lock, LogOut, FileText, Shapes, BarChart2, Gavel, Ticket, Send, Star } from "lucide-react";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string, email: string } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event("storage")); // Notify other tabs/windows
      router.push('/');
    }
  };
  
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt={user?.name || 'Super Admin'} />
                <AvatarFallback>{user?.name?.charAt(0) || 'S'}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                  <span className="font-semibold tracking-tight text-sm">{user?.name || 'Super Admin'}</span>
                  <span className="text-muted-foreground text-xs">{user?.email || 'superadmin@gnetdial.com'}</span>
              </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/super-admin'}>
                    <Link href="/super-admin">
                        <LayoutDashboard />
                        Dashboard
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/super-admin/analytics')}>
                     <Link href="/super-admin/analytics">
                        <BarChart2 />
                        Analytics
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/super-admin/notifications')}>
                     <Link href="/super-admin/notifications">
                        <Send />
                        Send Notification
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/super-admin/tickets')}>
                     <Link href="/super-admin/tickets">
                        <Ticket />
                        Manage Tickets
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/super-admin/reviews')}>
                     <Link href="/super-admin/reviews">
                        <Star />
                        Manage Reviews
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/super-admin/users'}>
                     <Link href="/super-admin/users">
                        <Users />
                        User Management
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/super-admin/users/new')}>
                     <Link href="/super-admin/users/new">
                        <PlusCircle />
                        Create New Admin
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/super-admin/kyc')}>
                     <Link href="/super-admin/kyc">
                        <FileText />
                        Manage KYC
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/super-admin/categories')}>
                     <Link href="/super-admin/categories">
                        <Shapes />
                        Manage Business Categories
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/super-admin/service-categories')}>
                     <Link href="/super-admin/service-categories">
                        <Shapes />
                        Manage Service Categories
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/super-admin/home-settings')}>
                     <Link href="/super-admin/home-settings">
                        <Settings />
                       Home Page Setting
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/super-admin/legal')}>
                     <Link href="/super-admin/legal">
                        <Gavel />
                       Legal Content
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/super-admin/settings')}>
                     <Link href="/super-admin/settings">
                        <Lock />
                       Reset Password
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <SidebarMenu>
                 <SidebarMenuItem>
                    <SidebarMenuButton>
                        <Settings />
                        Account Settings
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleLogout}>
                        <LogOut />
                        Log out
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Super Admin Panel</h1>
            <div />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
