

'use client';

import { Suspense } from 'react';
import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { Skeleton } from '@/components/ui/skeleton';


// This would come from your data source
const users = [
  { id: "1", name: "Olivia Martin", email: "olivia.martin@email.com", role: "admin" },
  { id: "6", name: "Super Admin", email: "superadmin@gnetdial.com", role: "admin" },
];

const admins = users.filter(u => u.role === 'admin');

function ResetPasswordComponent() {
  const searchParams = useSearchParams();
  const userIdFromQuery = searchParams.get('user');

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<(typeof admins[0]) | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetError, setResetError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (userIdFromQuery) {
      const user = admins.find(u => u.id === userIdFromQuery);
      if (user) {
        setSelectedUser(user);
        setSearchError(null);
      } else {
        setSearchError("Admin with the provided ID not found.");
      }
    }
  }, [userIdFromQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const user = admins.find(u => u.id === searchQuery);
    if (user) {
      setSelectedUser(user);
      setSearchError(null);
    } else {
      setSelectedUser(null);
      setSearchError("Admin not found with that ID.");
    }
    setPassword("");
    setConfirmPassword("");
    setResetError(null);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setResetError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setResetError("Passwords do not match.");
      return;
    }

    // In a real app, you would make an API call to reset the password.
    console.log(`Resetting password for ${selectedUser?.email} to ${password}`);
    
    setResetError(null);
    setPassword("");
    setConfirmPassword("");
    toast({
      title: "Password Reset",
      description: `Password for ${selectedUser?.name || 'user'} has been successfully reset.`,
    });
  };
    
  return (
    <main className="p-4 md:p-8">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" asChild>
            <Link href="/super-admin/users">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Users</span>
            </Link>
        </Button>
        <h2 className="text-2xl font-bold ml-4">Reset Admin Password</h2>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Search for Admin</CardTitle>
            <CardDescription>
              Enter the ID of the admin whose password you want to reset.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSearch} className="flex items-center gap-2 mb-6 max-w-sm">
                <Input
                    id="search-id"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter admin ID..."
                    className="flex-1"
                />
                <Button type="submit" size="icon">
                    <Search className="h-4 w-4"/>
                    <span className="sr-only">Search</span>
                </Button>
            </form>
            {searchError && <p className="text-sm font-medium text-destructive mb-4">{searchError}</p>}
            
            <div className="border-t pt-6">
                {selectedUser ? (
                    <div>
                        <h3 className="text-lg font-semibold mb-1">Reset Password for:</h3>
                        <p className="text-muted-foreground mb-4">{selectedUser.name} ({selectedUser.email})</p>
                        <form onSubmit={handleResetPassword} className="space-y-6 max-w-lg">
                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input
                                id="new-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                <Input
                                id="confirm-password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                />
                            </div>
                            {resetError && <p className="text-sm font-medium text-destructive">{resetError}</p>}
                            <div className="flex justify-end">
                                <Button type="submit">Reset Password</Button>
                            </div>
                        </form>
                    </div>
                ): (
                    <div className="text-center text-muted-foreground py-8">
                        <p>Enter an admin ID above or select an admin from the user management page.</p>
                    </div>
                )}
            </div>
        </CardContent>
      </Card>
    </main>
  );
}


function ResetPasswordSkeleton() {
  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center mb-6">
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-7 w-64 ml-4" />
      </div>
      <Skeleton className="h-[450px] w-full" />
    </div>
  );
}

function ResetPasswordPage() {
    return (
        <Suspense fallback={<ResetPasswordSkeleton />}>
            <ResetPasswordComponent />
        </Suspense>
    )
}

export default function Page() {
  return (
    <Suspense>
      <ResetPasswordPage />
    </Suspense>
  )
}
