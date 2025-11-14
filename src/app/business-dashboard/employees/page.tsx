
'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle as AlertCircleIcon, Search, UserPlus, Trash2, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { DashboardHeader } from '@/components/justdial/your-dashboard/DashboardHeader';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { searchUsers, getEmployees, addEmployee, removeEmployee } from '../employees/actions';
import { EmployeeProfileDialog } from '@/components/business-dashboard/employees/EmployeeProfileDialog';

function EmployeeManagementComponent() {
    const searchParams = useSearchParams();
    const businessId = searchParams.get('id');
    const { toast } = useToast();
    
    const [isLoading, setIsLoading] = useState(true);
    const [employees, setEmployees] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    const fetchEmployees = useCallback(async () => {
        if (!token) return;
        setIsLoading(true);
        const { data, error } = await getEmployees(token);
        if (error) {
            toast({ title: "Error", description: `Could not fetch employees: ${error}`, variant: 'destructive' });
        } else {
            setEmployees(data || []);
        }
        setIsLoading(false);
    }, [token, toast]);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);
    
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.length < 2) {
            setSearchResults([]);
            toast({ title: 'Info', description: 'Please enter at least 2 characters to search.' });
            return;
        }

        if (!token) return;
        setIsSearching(true);
        const { data } = await searchUsers(searchQuery, token);
        setSearchResults(data || []);
        setIsSearching(false);
    };

    const handleAddEmployee = async (individualId: string) => {
        if (!token) return;

        const result = await addEmployee(individualId, token, businessId || undefined);
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            setSearchQuery('');
            setSearchResults([]);
            fetchEmployees();
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    };

    const handleRemoveEmployee = async (userId: string) => {
        if (!businessId || !token) return;

        const result = await removeEmployee(businessId, userId, token);
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            fetchEmployees();
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    };
    
    if (isLoading && employees.length === 0) {
        return <div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>;
    }

    if (!businessId) {
        return (
            <Alert variant="destructive">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    No business ID provided. Please access this page from your business dashboard.
                </AlertDescription>
            </Alert>
        );
    }
    
    return (
        <>
        <div className="max-w-4xl mx-auto space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                    <CardHeader>
                        <CardTitle>Search for Employees</CardTitle>
                        <CardDescription>Search for users by name or email to add them to your business.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex items-center gap-2">
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
                                <Input 
                                    placeholder="Search by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Button type="submit" disabled={isSearching}>
                                {isSearching ? <Loader2 className="h-4 w-4 animate-spin"/> : <Search className="h-4 w-4"/>}
                                <span className="ml-2 hidden sm:inline">Search</span>
                            </Button>
                        </form>
                        {isSearching ? (
                            <div className="text-center p-4"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>
                        ) : searchResults.length > 0 ? (
                            <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                                {searchResults.map(user => (
                                    <div key={user.individualId} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8"><AvatarFallback>{user.name.charAt(0)}</AvatarFallback></Avatar>
                                            <div>
                                                <p className="text-sm font-medium">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                        <Button size="sm" onClick={() => handleAddEmployee(user.individualId)}>
                                            <UserPlus className="mr-2 h-4 w-4" />
                                            Add
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : searchQuery.length > 1 && !isSearching ? (
                             <p className="text-sm text-center text-gray-500 mt-4">No users found.</p>
                        ) : null}
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                <Card>
                    <CardHeader>
                        <CardTitle>Current Employees ({employees.length})</CardTitle>
                        <CardDescription>The list of individuals associated with your business.</CardDescription>
                    </CardHeader>
                     <CardContent>
                        {isLoading ? (
                             <div className="text-center p-4"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>
                        ) : employees.length > 0 ? (
                            <div className="space-y-3">
                                {employees.map(employee => (
                                    <div key={employee.individualId} className="flex items-center justify-between p-3 border rounded-lg">
                                         <div className="flex items-center gap-3">
                                            <Avatar><AvatarFallback>{employee.individualName.charAt(0)}</AvatarFallback></Avatar>
                                            <div>
                                                <p className="font-semibold">{employee.individualName}</p>
                                                <p className="text-sm text-gray-500">{employee.individualEmail}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" onClick={() => setSelectedEmployeeId(employee.individualId)}>
                                                <Eye className="mr-2 h-4 w-4" /> View
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleRemoveEmployee(employee.individualId)}>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-8">No employees have been added yet.</p>
                        )}
                     </CardContent>
                </Card>
            </motion.div>
        </div>
        {selectedEmployeeId && (
            <EmployeeProfileDialog
                isOpen={!!selectedEmployeeId}
                onOpenChange={(isOpen) => !isOpen && setSelectedEmployeeId(null)}
                individualId={selectedEmployeeId}
            />
        )}
        </>
    );
}


function EmployeeManagementPage() {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageTransition}
            className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden"
        >
            <DashboardHeader title="Manage Employees" />

            <main className="flex-grow container mx-auto px-4 py-6 relative z-10">
                <Suspense fallback={<div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>}>
                    <EmployeeManagementComponent />
                </Suspense>
            </main>
        </motion.div>
    );
}

export default function Page() {
  return (
    <Suspense>
      <EmployeeManagementPage />
    </Suspense>
  )
}
