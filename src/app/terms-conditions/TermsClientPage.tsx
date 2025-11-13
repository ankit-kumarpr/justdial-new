
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gavel, FileText, UserCheck, Users, Handshake, AlertCircle } from "lucide-react";
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '@/lib/animations';

const termsIcons = [
  { icon: <FileText className="h-6 w-6" />, title: 'Service Usage', color: 'from-blue-400 to-blue-600' },
  { icon: <UserCheck className="h-6 w-6" />, title: 'User Obligations', color: 'from-green-400 to-green-600' },
  { icon: <Users className="h-6 w-6" />, title: 'Third-Party Content', color: 'from-purple-400 to-purple-600' },
  { icon: <Handshake className="h-6 w-6" />, title: 'Dispute Resolution', color: 'from-orange-400 to-orange-600' },
];

export default function TermsClientPage({ content }: { content: string }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen"
      data-testid="terms-page"
    >
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 pt-28 pb-16 overflow-hidden">
        {/* Animated background blobs */}
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl"
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
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl"
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl"
            >
              <Gavel className="h-10 w-10 text-white" />
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-gray-900">Terms of </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-gradient">Use</span>
            </motion.h1>
            
            <motion.p
              className="text-xl text-gray-600 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Our agreement with you
            </motion.p>

            <motion.p
              className="text-sm text-gray-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Last Updated: July 31, 2024
            </motion.p>
            
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-8"
            >
              {termsIcons.map((item, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-200">
                    <motion.div
                      className={`h-12 w-12 mx-auto mb-2 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {item.icon}
                    </motion.div>
                    <p className="text-xs font-semibold text-gray-700">{item.title}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative wave divider */}
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

      <main className="container mx-auto px-4 -mt-16 relative z-10 pb-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto space-y-6"
        >
          {content && (
            <motion.div variants={staggerItem} whileHover={{ y: -5 }} transition={{ duration: 0.3 }} className="mt-8">
              <Card className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300 bg-white">
                  <CardHeader>
                      <CardTitle className="text-2xl">Terms & Conditions</CardTitle>
                  </CardHeader>
                  <CardContent className="prose max-w-none prose-sm sm:prose-base">
                      <div dangerouslySetInnerHTML={{ __html: content || "<p>Failed to load terms and conditions. Please try again later.</p>" }} />
                  </CardContent>
              </Card>
            </motion.div>
          )}
          
          <motion.div variants={staggerItem} whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="h-6 w-6 text-amber-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-amber-900 mb-2">Please Read Carefully</h3>
                    <p className="text-amber-800 text-sm leading-relaxed">
                      By accessing or using our services, you agree to be bound by these terms. If you do not agree to all the terms and conditions, then you may not access the service.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </motion.div>
  );
}
