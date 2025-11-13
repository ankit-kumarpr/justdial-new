
'use client';

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertTriangle, Users, Briefcase, Building, Key, IndianRupee, FileText, BarChart2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";

type AnalyticsData = {
    overview: {
        users: { total: number; verified: number; unverified: number };
        vendors: { total: number; verified: number; unverified: number };
        businesses: { total: number; approved: number; pending: number; rejected: number };
        keywords: { total: number };
        leads: { total: number; pending: number; inProgress: number; completed: number; cancelled: number };
        responses: { total: number; accepted: number; rejected: number; pending: number; acceptanceRate: string };
        payments: { total: number; revenue: string; averagePerTransaction: string };
    };
    recentActivity: {
        users: { _id: string; name: string; email: string; createdAt: string }[];
        vendors: { _id: string; name: string; email: string; createdAt: string }[];
        businesses: { _id: string; userId: { name: string }; businessName: string; status: string; createdAt: string }[];
        leads: { _id: string; userId: { name: string }; searchKeyword: string; status: string; createdAt: string }[];
    };
};

async function getAnalyticsData(token: string): Promise<{ data: AnalyticsData | null; error: string | null }> {
    if (!token) {
        return { data: null, error: 'Authentication token is required.' };
    }

    try {
        const result = await apiFetch('/api/admin/statistics', token, { cache: 'no-store' });
        return { data: result.data, error: null };
    } catch (e) {
        console.error('Client-side getAnalyticsData failed:', e);
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

const RecentActivityTable = ({ data, columns }: { data: any[], columns: { header: string, accessor: (item: any) => React.ReactNode }[] }) => {
    if (!data || data.length === 0) {
        return <p className="text-center text-muted-foreground py-4">No recent activity.</p>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {columns.map(col => <TableHead key={col.header}>{col.header}</TableHead>)}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item) => (
                    <TableRow key={item._id}>
                        {columns.map(col => <TableCell key={col.header}>{col.accessor(item)}</TableCell>)}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    const fetchAnalytics = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast({ title: "Authentication Error", description: "Please log in to view analytics.", variant: "destructive" });
            router.push('/login');
            return;
        }

        const result = await getAnalyticsData(token);
        if (result.error) {
            const errorMessage = result.error;
            setError(errorMessage);
            toast({ title: "Error", description: `Failed to fetch analytics: ${errorMessage}`, variant: "destructive" });
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
        fetchAnalytics();
    }, [fetchAnalytics]);

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
                             Failed to Load Analytics
                         </CardTitle>
                     </CardHeader>
                     <CardContent>
                         <p>{error || "An unknown error occurred."}</p>
                         <Button onClick={fetchAnalytics} variant="destructive" className="mt-4">Retry</Button>
                     </CardContent>
                 </Card>
             </main>
        );
    }

    const { overview, recentActivity } = data;

    return (
        <main className="p-4 md:p-8 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BarChart2 /> Platform Overview</CardTitle>
                    <CardDescription>A snapshot of key metrics across the platform.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Total Users" value={overview.users.total} icon={Users} subValue={overview.users.verified} subLabel="verified" />
                    <StatCard title="Total Vendors" value={overview.vendors.total} icon={Briefcase} subValue={overview.vendors.verified} subLabel="verified" />
                    <StatCard title="Total Businesses" value={overview.businesses.total} icon={Building} subValue={overview.businesses.approved} subLabel="approved" />
                    <StatCard title="Total Keywords" value={overview.keywords.total} icon={Key} />
                    <StatCard title="Total Leads" value={overview.leads.total} icon={FileText} subValue={overview.leads.pending} subLabel="pending" />
                    <StatCard title="Lead Acceptance" value={`${overview.responses.acceptanceRate}%`} icon={CheckCircle} subValue={overview.responses.total} subLabel="responses" />
                    <StatCard title="Total Revenue" value={overview.payments.revenue} icon={IndianRupee} subValue={overview.payments.total} subLabel="transactions" />
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest updates from users, vendors, and businesses.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="users">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="users">Users ({recentActivity.users.length})</TabsTrigger>
                            <TabsTrigger value="vendors">Vendors ({recentActivity.vendors.length})</TabsTrigger>
                            <TabsTrigger value="businesses">Businesses ({recentActivity.businesses.length})</TabsTrigger>
                            <TabsTrigger value="leads">Leads ({recentActivity.leads.length})</TabsTrigger>
                        </TabsList>
                        <TabsContent value="users">
                            <RecentActivityTable 
                                data={recentActivity.users}
                                columns={[
                                    { header: 'Name', accessor: (item) => item.name },
                                    { header: 'Email', accessor: (item) => item.email },
                                    { header: 'Joined On', accessor: (item) => new Date(item.createdAt).toLocaleDateString() }
                                ]}
                            />
                        </TabsContent>
                         <TabsContent value="vendors">
                            <RecentActivityTable 
                                data={recentActivity.vendors}
                                columns={[
                                    { header: 'Name', accessor: (item) => item.name },
                                    { header: 'Email', accessor: (item) => item.email },
                                    { header: 'Joined On', accessor: (item) => new Date(item.createdAt).toLocaleDateString() }
                                ]}
                            />
                        </TabsContent>
                         <TabsContent value="businesses">
                             <RecentActivityTable 
                                data={recentActivity.businesses}
                                columns={[
                                    { header: 'Business Name', accessor: (item) => item.businessName },
                                    { header: 'Owner', accessor: (item) => item.userId.name },
                                    { header: 'Status', accessor: (item) => <Badge variant={item.status === 'approved' ? 'default' : item.status === 'pending' ? 'secondary' : 'destructive'} className="capitalize">{item.status}</Badge> },
                                    { header: 'Created On', accessor: (item) => new Date(item.createdAt).toLocaleDateString() }
                                ]}
                            />
                        </TabsContent>
                         <TabsContent value="leads">
                             <RecentActivityTable 
                                data={recentActivity.leads}
                                columns={[
                                    { header: 'Keyword', accessor: (item) => item.searchKeyword },
                                    { header: 'User', accessor: (item) => item.userId.name },
                                    { header: 'Status', accessor: (item) => <Badge variant={item.status === 'completed' ? 'default' : item.status === 'pending' ? 'secondary' : 'outline'} className="capitalize">{item.status}</Badge> },
                                    { header: 'Created On', accessor: (item) => new Date(item.createdAt).toLocaleDateString() }
                                ]}
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </main>
    )
}

    