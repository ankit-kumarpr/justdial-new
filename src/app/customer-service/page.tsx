
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Headphones } from "lucide-react";
import { motion } from 'framer-motion';
import { pageTransition } from '@/lib/animations';
import { CreateTicketDialog } from '@/components/customer-service/CreateTicketDialog';
import { TicketList } from '@/components/customer-service/TicketList';

export default function CustomerServicePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(Date.now());

  const handleTicketCreation = () => {
    setRefreshKey(Date.now()); // Update key to trigger re-fetch in TicketList
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50"
    >
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-20 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
              <Headphones className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-lg text-gray-800">Support Center</h1>
              <p className="text-sm text-gray-500">Manage your support tickets</p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Ticket
            </Button>
          </motion.div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <TicketList key={refreshKey} />
      </main>

      <CreateTicketDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={handleTicketCreation}
      />
    </motion.div>
  );
}
