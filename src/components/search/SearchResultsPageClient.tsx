
'use client';

import { BusinessCard } from "@/components/business/business-card";
import { SearchX } from "lucide-react";
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '@/lib/animations';
import type { Business } from '@/lib/types';

type SearchResultsPageClientProps = {
  initialResults: Business[];
  initialError: string | null;
  query: string;
  city: string;
};

export function SearchResultsPageClient({ 
  initialResults, 
  initialError, 
  query,
  city 
}: SearchResultsPageClientProps) {

  return (
    <>
      <section className="relative bg-gradient-to-br from-primary/5 via-accent/5 to-background pt-28 pb-16 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-gradient-animated">
              {query ? `Search Results for "${query}"` : 'Explore Businesses'}
            </h1>
            <p className="text-lg text-muted-foreground">
              {initialResults.length > 0
                ? `Found ${initialResults.length} ${initialResults.length === 1 ? 'result' : 'results'} in ${city || 'your area'}`
                : `No results found for "${query}" in ${city || 'your area'}`
              }
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            className="relative block w-full h-12"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="#ffffff"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </svg>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {initialError ? (
             <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center text-center py-24 bg-card rounded-2xl shadow-lg border border-border/50 backdrop-blur-sm"
              >
                 <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <SearchX className="h-24 w-24 text-destructive mb-6" />
                </motion.div>
                <h2 className="text-3xl font-semibold text-foreground mb-3">
                  An Error Occurred
                </h2>
                <p className="text-destructive max-w-md text-lg">
                  {initialError}
                </p>
            </motion.div>
        ) : initialResults.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {initialResults.map((business, index) => (
              <motion.div
                key={business._id || index}
                variants={staggerItem}
                className="hover-lift"
                data-testid={`business-card-${index}`}
              >
                <BusinessCard business={business} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center text-center py-24 bg-card rounded-2xl shadow-lg border border-border/50 backdrop-blur-sm"
            data-testid="no-results-container"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <SearchX className="h-24 w-24 text-muted-foreground mb-6" />
            </motion.div>
            <h2 className="text-3xl font-semibold text-foreground mb-3">
              No Vendors Found
            </h2>
            <p className="text-muted-foreground max-w-md text-lg">
              We couldn&apos;t find any vendors matching your search for &quot;{query}&quot; within a 15km radius of {city}.
              <br />Try a different search term or check for typos.
            </p>
          </motion.div>
        )}
      </main>
    </>
  );
}
