
'use client';

import { useState } from "react";
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";


// This would come from your data source
const users = [
  { id: "1", name: "Olivia Martin", email: "olivia.martin@email.com" },
  { id: "6", name: "Super Admin", email: "superadmin@gnetdial.com" },
];


export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('user');
  const user = users.find(u => u.id === userId);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // In a real app, you would make an API call to reset the password.
    console.log(`Resetting password for ${user?.email} to ${password}`);
    
    setError(null);
    setPassword("");
    setConfirmPassword("");
    toast({
      title: "Password Reset",
      description: `Password for ${user?.name || 'user'} has been successfully reset.`,
    });
  };
    
  return (
    <main className="p-4 md:p-8">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" asChild>
            <Link href="/admin/users">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Users</span>
            </Link>
        </Button>
        <h2 className="text-2xl font-bold ml-4">Settings</h2>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              {user ? `Enter a new password for ${user.name} (${user.email}).` : "Select a user from the user management page to reset their password."}
            </CardDescription>
        </CardHeader>
        <CardContent>
            {user ? (
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
                    {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                    <div className="flex justify-end">
                        <Button type="submit">Reset Password</Button>
                    </div>
                </form>
            ): (
                <div className="text-center text-muted-foreground py-8">
                    <p>Please go to the <Link href="/admin/users" className="text-blue-600 hover:underline">User Management</Link> page and select an admin to reset their password.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </main>
  );
}
