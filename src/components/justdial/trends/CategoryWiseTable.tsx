
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { trendsCategoryData } from '@/lib/justdial-data';
import { ChevronUp } from 'lucide-react';
import Link from 'next/link';

type CategoryWiseTableProps = {
  activeTab: 'searches' | 'calls';
};

export function CategoryWiseTable({ activeTab }: CategoryWiseTableProps) {
  const data = trendsCategoryData[activeTab];
  
  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-base font-semibold">{data.title}</CardTitle>
        <ChevronUp className="h-5 w-5 text-gray-500 cursor-pointer" />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[200px]">IT Solution Providers</TableHead>
              {data.months.map(month => <TableHead key={month}>{month}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">IT Solution Providers</TableCell>
              {data.values.map((value, index) => <TableCell key={index}>{value}</TableCell>)}
            </TableRow>
          </TableBody>
        </Table>
        <div className="text-right mt-4">
            <Link href="/advertise" className="text-accent text-sm font-medium hover:underline">Advertise Now</Link>
        </div>
      </CardContent>
    </Card>
  );
}
