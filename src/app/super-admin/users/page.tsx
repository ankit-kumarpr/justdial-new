
'use client';

import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, SearchX, Briefcase, UserCog, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { getAllUsers, getAllVendors } from "./actions";
import type { User } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";


const UserTable = ({ users, role }: { users: User[], role: 'admin' | 'vendor' | 'user' }) => (
    <div className="border rounded-lg bg-white">
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Verification Status</TableHead>
                <TableHead>Joined On</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.length > 0 ? users.map((user) => (
                <TableRow key={user._id}>
                    <TableCell>
                    <div className="flex items-center gap-3">
                        <Avatar>
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${user.email}`} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                    </TableCell>
                    <TableCell className="capitalize">{user.role}</TableCell>
                    <TableCell>
                    <Badge 
                        variant={user.isVerified ? "default" : "destructive"}
                        className={user.isVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                        {user.isVerified ? 'Verified' : 'Not Verified'}
                    </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
                )) : (
                    <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">No {role}s found.</TableCell>
                </TableRow>
                )}
            </TableBody>
        </Table>
    </div>
);


export default function UsersPage() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [vendors, setVendors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const fetchUsersAndVendors = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    if (!token) {
        toast({ title: "Authentication Error", description: "Please log in.", variant: "destructive" });
        router.push('/login');
        return;
    }

    const [userResult, vendorResult] = await Promise.all([
        getAllUsers(token),
        getAllVendors(token)
    ]);

    if (userResult.error || vendorResult.error) {
        const errorMessage = userResult.error || vendorResult.error || "An unknown error occurred.";
        setError(errorMessage);
        toast({ title: "Error", description: errorMessage, variant: 'destructive' });
        if (errorMessage.toLowerCase().includes('token')) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.dispatchEvent(new Event("storage"));
            router.push('/login');
        }
    } else {
        setAllUsers(userResult.data || []);
        setVendors(vendorResult.data || []);
    }
    setLoading(false);
  }, [router, toast]);

  useEffect(() => {
    fetchUsersAndVendors();
  }, [fetchUsersAndVendors]);
  
  const admins = allUsers.filter(user => user.role === 'admin');
  const regularUsers = allUsers.filter(user => user.role === 'user');

  return (
    <main className="p-4 md:p-8">
      <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage all users on the platform.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
             {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                    <SearchX className="h-12 w-12 text-destructive mb-4" />
                    <h3 className="text-lg font-semibold text-destructive">Failed to load data</h3>
                    <p className="text-muted-foreground">{error}</p>
                </div>
            ) : (
                <Tabs defaultValue="admins">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="admins">
                           <UserCog className="mr-2 h-4 w-4" />
                           Admins ({admins.length})
                        </TabsTrigger>
                        <TabsTrigger value="vendors">
                            <Briefcase className="mr-2 h-4 w-4" />
                           Vendors ({vendors.length})
                        </TabsTrigger>
                         <TabsTrigger value="users">
                           <Users className="mr-2 h-4 w-4" />
                           Users ({regularUsers.length})
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="admins" className="mt-4">
                        <UserTable users={admins} role="admin" />
                    </TabsContent>
                    <TabsContent value="vendors" className="mt-4">
                        <UserTable users={vendors} role="vendor" />
                    </TabsContent>
                     <TabsContent value="users" className="mt-4">
                        <UserTable users={regularUsers} role="user" />
                    </TabsContent>
                </Tabs>
            )}
          </CardContent>
      </Card>
    </main>
  );
}
