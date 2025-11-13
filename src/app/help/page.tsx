'use client';

import { JustdialHeader } from "@/components/justdial/JustdialHeader";
import { JustdialFooter } from "@/components/justdial/JustdialFooter";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, HelpCircle, Phone, Mail, MessageCircle, Shield, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '@/lib/animations';
import { FloatingButtons } from '@/components/justdial/FloatingButtons';
import { Button } from "@/components/ui/button";

const helpTopics = [
  {
    title: "I want to stop receiving calls for searches made on Gnetdial",
    icon: Phone,
    color: "text-blue-500"
  },
  {
    title: "I want to stop receiving calls from Gnetdial sales team",
    icon: Phone,
    color: "text-purple-500"
  },
  {
    title: "My contact number wrongly linked to a Gnetdial listing",
    icon: MessageCircle,
    color: "text-red-500"
  },
  {
    title: "Edit profile information",
    icon: CheckCircle,
    color: "text-green-500"
  },
  {
    title: "Manage Payment Modes",
    icon: Shield,
    color: "text-yellow-500"
  },
  {
    title: "Profile Deactivation",
    icon: Shield,
    color: "text-gray-500"
  },
  {
    title: "Raise a Concern",
    icon: HelpCircle,
    color: "text-accent"
  },
];

const quickActions = [
  { title: 'Call Support', icon: Phone, color: 'bg-green-500' },
  { title: 'Email Us', icon: Mail, color: 'bg-blue-500' },
  { title: 'Live Chat', icon: MessageCircle, color: 'bg-purple-500' },
];

export default function HelpPage() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50"
    >
      <JustdialHeader />
      <FloatingButtons />

      {/* Animated background blobs */}
      <motion.div
        className="fixed top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"
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
        className="fixed bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none"
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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-accent/5 to-background pt-28 pb-16 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <HelpCircle className="h-12 w-12 text-primary" />
              <h1 className="text-5xl font-bold text-gray-800">Help Center</h1>
            </div>
            <p className="text-xl text-gray-600 mb-8">We're here to help you with any questions or concerns</p>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center gap-4 flex-wrap"
            >
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                >
                  <Button className={`${action.color} hover:opacity-90 text-white px-6 py-6 shadow-lg`} size="lg">
                    <action.icon className="h-5 w-5 mr-2" />
                    {action.title}
                  </Button>
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
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </section>

      <main className="flex-grow container mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-gray-800">Security and Privacy</h2>
              </div>
              <div className="space-y-2">
                {helpTopics.map((topic, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  >
                    <Link href="#" passHref>
                      <div className="flex items-center justify-between p-4 rounded-lg cursor-pointer hover:bg-primary/5 transition-all group border border-transparent hover:border-primary/20">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <topic.icon className={`h-5 w-5 ${topic.color}`} />
                          </div>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">{topic.title}</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <Clock className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-800 mb-2">Need Immediate Assistance?</h3>
                <p className="text-gray-600 mb-4">Our support team is available 24/7 to help you</p>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md" size="lg">
                  Contact Support Now
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>

      <JustdialFooter />
    </motion.div>
  );
}
