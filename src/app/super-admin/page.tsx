
'use client';
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Building2, UserCheck, Loader2, AlertTriangle, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";

type AnalyticsData = {
    overview: {
        users: { total: number; verified: number; };
        vendors: { total: number; verified: number; };
        businesses: { total: number; approved: number; };
        leads: { total: number; pending: number; };
    };
    recentActivity: {
        users: { _id: string; name: string; email: string; createdAt: string }[];
        vendors: { _id: string; name: string; email: string; createdAt: string }[];
    };
};

async function getDashboardData(token: string): Promise<{ data: AnalyticsData | null; error: string | null }> {
    if (!token) {
        return { data: null, error: 'Authentication token is required.' };
    }
    try {
        const result = await apiFetch('/api/admin/statistics', token, { cache: 'no-store' });
        return { data: result.data, error: null };
    } catch (e) {
        console.error('Client-side getDashboardData failed:', e);
        return { data: null, error: (e as Error).message };
    }
}

const StatCard = ({ title, value, icon: Icon, subValue, subLabel }: { title: string, value: string | number, icon: React.ElementType, subValue?: string | number, subLabel?: string }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {subValue != null && subLabel != null && <p className="text-xs text-muted-foreground">{subValue} {subLabel}</p>}
        </CardContent>
    </Card>
);


export default function SuperAdminDashboardPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast({ title: "Authentication Error", description: "Please log in to view the dashboard.", variant: "destructive" });
            router.push('/login');
            return;
        }

        const result = await getDashboardData(token);
        if (result.error) {
            const errorMessage = result.error;
            setError(errorMessage);
            toast({ title: "Error", description: `Failed to fetch dashboard data: ${errorMessage}`, variant: "destructive" });
            if (errorMessage.toLowerCase().includes('token')) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.dispatchEvent(new Event("storage"));
                router.push('/login');
            }
        } else {
            setData(result.data);
        }
        setLoading(false);
    }, [router, toast]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

  if (loading) {
        return (
            <main className="p-4 md:p-8 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </main>
        );
    }
    
    if (error || !data) {
        return (
             <main className="p-4 md:p-8">
                 <Card className="bg-destructive/10 border-destructive/20">
                     <CardHeader>
                         <CardTitle className="flex items-center gap-2 text-destructive">
                             <AlertTriangle />
                             Failed to Load Dashboard
                         </CardTitle>
                     </CardHeader>
                     <CardContent>
                         <p>{error || "An unknown error occurred."}</p>
                         <Button onClick={fetchDashboardData} variant="destructive" className="mt-4">Retry</Button>
                     </CardContent>
                 </Card>
             </main>
        );
    }
    
  const { overview, recentActivity } = data;

  return (
    <main className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-6">Super Admin Dashboard</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={overview.users.total} icon={Users} subValue={overview.users.verified} subLabel="verified" />
        <StatCard title="Total Vendors" value={overview.vendors.total} icon={UserCheck} subValue={overview.vendors.verified} subLabel="verified" />
        <StatCard title="Total Businesses" value={overview.businesses.total} icon={Building2} subValue={overview.businesses.approved} subLabel="approved" />
        <StatCard title="Total Leads" value={overview.leads.total} icon={FileText} subValue={overview.leads.pending} subLabel="pending" />
      </div>

       <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest user and vendor registrations.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.users.slice(0, 2).map(user => (
                <div key={user._id} className="flex items-center justify-between">
                    <p>New user signup: <span className="font-semibold">{user.name}</span> ({user.email})</p>
                    <p className="text-sm text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
               {recentActivity.vendors.slice(0, 2).map(vendor => (
                <div key={vendor._id} className="flex items-center justify-between">
                    <p>New vendor registration: <span className="font-semibold">{vendor.name}</span> ({vendor.email})</p>
                    <p className="text-sm text-muted-foreground">{new Date(vendor.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

    