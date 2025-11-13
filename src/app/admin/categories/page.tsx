
'use client';

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CategoryDialog } from "@/components/admin/category-dialog";
import type { Category } from "@/lib/types";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const categoryPlaceholder = PlaceHolderImages.find(p => p.id === 'category-placeholder');

export default function ManageCategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase.from('categories').select('*');
            if (error) {
                console.error("Error fetching categories:", error);
                toast({ title: 'Error', description: 'Could not fetch categories.', variant: 'destructive'});
            } else {
                setCategories(data);
            }
            setLoading(false);
        };
        fetchCategories();

        const subscription = supabase
            .channel('categories-changes-admin')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, payload => {
                fetchCategories();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [toast]);


    const handleAddCategory = () => {
        setSelectedCategory(null);
        setIsDialogOpen(true);
    };

    const handleEditCategory = (category: Category) => {
        setSelectedCategory(category);
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setSelectedCategory(null);
    };
    
  return (
    <main className="p-4 md:p-8">
       <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Manage Categories</CardTitle>
                <CardDescription>Add, edit, or delete business categories.</CardDescription>
            </div>
            <Button onClick={handleAddCategory}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Category
            </Button>
        </CardHeader>
        <CardContent>
            {loading ? <p>Loading categories...</p> : (
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead className="w-20">Icon</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id}>
                            <TableCell>
                                {category.icon_url ? (
                                    <Image src={category.icon_url} alt={category.name} width={40} height={40} className="rounded-full object-cover" />
                                ) : (
                                    categoryPlaceholder && <Image src={categoryPlaceholder.imageUrl} alt="Category placeholder" width={40} height={40} className="rounded-full object-cover" data-ai-hint={categoryPlaceholder.imageHint} />
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">{category.name}</div>
                            </TableCell>
                            <TableCell>
                                <div className="font-mono text-sm">{category.slug}</div>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Category actions</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEditCategory(category as Category)}>Edit</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive" disabled>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </CardContent>
       </Card>
        <CategoryDialog 
            isOpen={isDialogOpen}
            onClose={handleDialogClose}
            category={selectedCategory}
        />
    </main>
  );
}
