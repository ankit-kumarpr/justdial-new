'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronDown, Grip, User, Calendar, Plus, Lightbulb } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { 
    ContactNumbersIcon, StoreAddressIcon, WhatsAppIcon, BusinessCategoriesIcon, HighQualityPhotosIcon, VideoIcon, 
    ProductsWithPriceIcon, GetReviewsIcon, SocialMediaIcon, BusinessWebsiteIcon, YearOfEstablishmentIcon, 
    YearlyTurnoverIcon, NumberOfEmployeesIcon, CompleteKYCIcon 
} from '@/components/justdial/your-dashboard/ActionIcons';
import { JustdialHeader } from '@/components/justdial/JustdialHeader';
import { JustdialFooter } from '@/components/justdial/JustdialFooter';
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem, fadeInUp } from '@/lib/animations';
import './your-dashboard.css';

const profileActions = [
    { text: 'Add 2 or More Contact Numbers', icon: <ContactNumbersIcon />, color: 'bg-yellow-50', href: '/business-dashboard/edit-contact-details' },
    { text: 'Add Complete Store Address', icon: <StoreAddressIcon />, color: 'bg-purple-50', href: '/business-dashboard/edit-business-address' },
    { text: 'Add WhatsApp Number', icon: <WhatsAppIcon />, color: 'bg-green-50', href: '/business-dashboard/edit-contact-details' },
    { text: 'Add 10 or More Business Categories', icon: <BusinessCategoriesIcon />, color: 'bg-red-50', badge: '9 Pending', href: '/business-dashboard/update-business-categories' },
    { text: 'Add 10 or More High Quality Photos', icon: <HighQualityPhotosIcon />, color: 'bg-pink-50', href: '/business-dashboard/photos-videos' },
    { text: 'Add Video', icon: <VideoIcon />, color: 'bg-red-50', href: '/business-dashboard/photos-videos' },
    { text: 'Add Upto 10 Products with Price & Image', icon: <ProductsWithPriceIcon />, color: 'bg-pink-50', href: '/business-dashboard/catalogue' },
    { text: 'Get Upto 20 Reviews', icon: <GetReviewsIcon />, color: 'bg-pink-50', href: '/business-dashboard/get-ratings' },
    { text: 'Add Social Media Channels', icon: <SocialMediaIcon />, color: 'bg-yellow-50', href: '/business-dashboard/social-media' },
    { text: 'Add Business Website', icon: <BusinessWebsiteIcon />, color: 'bg-purple-50', href: '/business-dashboard/update-business-website' },
    { text: 'Add Year of Establishment', icon: <YearOfEstablishmentIcon />, color: 'bg-blue-50', href: '/business-dashboard/year-of-establishment' },
    { text: 'Add Yearly Turnover', icon: <YearlyTurnoverIcon />, color: 'bg-green-50', href: '/business-dashboard/yearly-turnover' },
    { text: 'Add Number of Employees', icon: <NumberOfEmployeesIcon />, color: 'bg-pink-50', href: '/business-dashboard/number-of-employees' },
    { text: 'Complete KYC', icon: <CompleteKYCIcon />, color: 'bg-yellow-50', href: '/admin/kyc' },
];

export default function YourDashboardPage() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen"
      data-testid="your-dashboard-page"
    >
      <JustdialHeader />
      
      {/* Enhanced Hero Section with Animated Background */}
      <section className="relative bg-gradient-to-br from-primary/5 via-accent/5 to-background pt-28 pb-16 overflow-hidden">
        {/* Animated background blobs */}
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-gray-900">Your Business </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">Dashboard</span>
            </motion.h1>
            <motion.p
              className="text-lg text-gray-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Complete your profile to reach more customers
            </motion.p>

            {/* Business Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-block"
            >
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg border border-gray-200">
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-lg">Xncoder</h2>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">Kamal Chowk, Nagpur</p>
                </div>
              </div>
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

      <main className="container mx-auto px-4 -mt-16 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-6 pb-16"
        >
          {/* Profile Score Card - Elevated */}
          <motion.div variants={staggerItem}>
            <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300 hover-lift">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-1 text-gray-900">Business Profile Score</h2>
                    <p className="text-sm text-gray-500">Complete your profile to boost visibility</p>
                  </div>
                  <motion.div
                    className="flex items-center gap-2"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-3xl font-bold text-red-600">16%</span>
                  </motion.div>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '16%' }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                    />
                  </div>
                  <span className="absolute -top-8 left-[16%] -translate-x-1/2 text-xs font-semibold text-red-600">Poor</span>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      Complete the actions below to increase your profile score and reach out to more users on Gnetdial
                    </p>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Photos Card */}
          <motion.div variants={staggerItem}>
            <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2">Photos & Videos</h2>
                <p className="text-sm text-gray-500 mb-4">Showcase your business with high-quality media</p>
                <div className="flex gap-4">
                  <Link href="/business-dashboard/photos-videos">
                    <motion.div
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className="border-2 border-dashed border-gray-300 rounded-xl p-6 w-32 h-32 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-300 group"
                      data-testid="add-photos-button"
                    >
                      <motion.div
                        className="h-10 w-10 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center mb-2 group-hover:border-primary group-hover:bg-primary/10 transition-all"
                        whileHover={{ rotate: 90 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Plus className="h-6 w-6 text-gray-400 group-hover:text-primary transition-colors" />
                      </motion.div>
                      <p className="text-xs text-gray-600 group-hover:text-primary font-medium transition-colors">Add Photos / Videos</p>
                    </motion.div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Items Grid */}
          <motion.div variants={staggerItem}>
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Complete Your Profile</h3>
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {profileActions.map((action, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  whileHover={{ scale: 1.05, y: -8 }}
                  whileTap={{ scale: 0.95 }}
                  data-testid={`action-${index}`}
                >
                  <Link href={action.href || '#'}>
                    <div className={`p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 relative cursor-pointer hover:shadow-lg transition-all duration-300 border border-transparent hover:border-primary/20 group ${action.color}`}>
                      {action.badge && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] px-2 py-1 rounded-full font-semibold shadow-lg"
                        >
                          {action.badge}
                        </motion.div>
                      )}
                      <motion.div
                        className="h-12 w-12 flex items-center justify-center"
                        whileHover={{ rotate: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {action.icon}
                      </motion.div>
                      <p className="text-xs font-semibold text-gray-700 group-hover:text-primary transition-colors">{action.text}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
      
      <JustdialFooter />
    </motion.div>
  );
}
