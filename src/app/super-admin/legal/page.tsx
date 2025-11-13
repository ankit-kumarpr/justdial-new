
'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Gavel, Eye, Edit, Trash2 } from "lucide-react";
import { getLegalContent, deleteTerms, deletePrivacyPolicy } from './actions';
import { PreviewDialog } from '@/components/super-admin/legal/PreviewDialog';
import { UpdateDialog } from '@/components/super-admin/legal/UpdateDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function LegalContentList() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [legalDocs, setLegalDocs] = useState<any[]>([]);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<{ id: string; title: string; content: string; } | null>(null);
    
    const fetchContent = useCallback(async () => {
        setIsLoading(true);
        const { terms_conditions, privacy_policy } = await getLegalContent();
        const documents = [
            {
                id: terms_conditions._id || 'terms-and-conditions',
                title: 'Terms & Conditions',
                lastUpdated: terms_conditions.updatedAt,
                content: terms_conditions.content,
            },
            {
                id: privacy_policy._id || 'privacy-policy',
                title: 'Privacy Policy',
                lastUpdated: privacy_policy.updatedAt,
                content: privacy_policy.content,
            },
        ];
        setLegalDocs(documents);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchContent();
    }, [fetchContent]);

    const handlePreview = (doc: { title: string; content: string; id: string }) => {
        setSelectedDoc(doc);
        setIsPreviewOpen(true);
    };
    
    const handleUpdate = (doc: { title: string; content: string; id: string }) => {
        setSelectedDoc(doc);
        setIsUpdateOpen(true);
    };

    const handleDelete = async (doc: any) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            toast({ title: 'Error', description: 'Authentication required.', variant: 'destructive' });
            return;
        }

        let result;
        if (doc.title === 'Terms & Conditions') {
            result = await deleteTerms(token);
        } else if (doc.title === 'Privacy Policy') {
            result = await deletePrivacyPolicy(token);
        } else {
            toast({ title: 'Info', description: 'Delete functionality for this document is not yet implemented.', variant: 'default' });
            return;
        }
        
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            fetchContent(); // Refresh the list
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    };


    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Gavel /> Legal Documents</CardTitle>
                    <CardDescription>Manage your Terms & Conditions and Privacy Policy.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Document Title</TableHead>
                                    <TableHead>Last Updated</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {legalDocs.map((doc) => (
                                    <TableRow key={doc.id}>
                                        <TableCell className="font-medium">{doc.title}</TableCell>
                                        <TableCell>{new Date(doc.lastUpdated).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" size="sm" onClick={() => handlePreview(doc)}>
                                                    <Eye className="mr-2 h-4 w-4" /> Preview
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => handleUpdate(doc)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Update
                                                </Button>
                                                 <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                         <Button variant="destructive" size="sm">
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the {doc.title}.
                                                        </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(doc)}>
                                                            Delete
                                                        </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            {selectedDoc && (
                <PreviewDialog 
                    isOpen={isPreviewOpen} 
                    onClose={() => setIsPreviewOpen(false)} 
                    title={selectedDoc.title} 
                    content={selectedDoc.content} 
                />
            )}
             {selectedDoc && (
                <UpdateDialog 
                    isOpen={isUpdateOpen} 
                    onClose={() => setIsUpdateOpen(false)} 
                    doc={selectedDoc}
                    onSuccess={fetchContent}
                />
            )}
        </>
    );
}

export default function LegalContentPage() {
    return (
        <main className="p-4 md:p-8">
            <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="h-12 w-12 animate-spin" /></div>}>
                <LegalContentList />
            </Suspense>
        </main>
    );
}
