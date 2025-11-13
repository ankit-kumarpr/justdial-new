'use client';

import { useState } from 'react';
import { JustdialHeader } from '@/components/justdial/JustdialHeader';
import { JustdialFooter } from '@/components/justdial/JustdialFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Megaphone, TrendingUp, BarChart3, Users, Target, Zap } from 'lucide-react';
import { CompetitionTrendChart } from '@/components/justdial/trends/CompetitionTrendChart';
import { CategoryWiseTable } from '@/components/justdial/trends/CategoryWiseTable';
import { CompetitorAdvertising } from '@/components/justdial/trends/CompetitorAdvertising';
import { SuccessStories } from '@/components/justdial/trends/SuccessStories';
import { MostLikedFeatures } from '@/components/justdial/trends/MostLikedFeatures';
import { BusinessProfileInsights } from '@/components/justdial/trends/BusinessProfileInsights';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '@/lib/animations';

export default function TrendsPage() {
  const [activeTab, setActiveTab] = useState<'searches' | 'calls'>('searches');

  const stats = [
    { icon: <TrendingUp className="h-6 w-6" />, label: 'Growth Rate', value: '+24%', color: 'from-green-400 to-green-600' },
    { icon: <Users className="h-6 w-6" />, label: 'Total Searches', value: '12.5K', color: 'from-blue-400 to-blue-600' },
    { icon: <Target className="h-6 w-6" />, label: 'Conversion', value: '18%', color: 'from-purple-400 to-purple-600' },
    { icon: <Zap className="h-6 w-6" />, label: 'Engagement', value: '85%', color: 'from-orange-400 to-orange-600' },
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen"
      data-testid="trends-page"
    >
      <JustdialHeader />
      
      {/* Enhanced Hero Section */}
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
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 mb-6 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20"
            >
              <BarChart3 className="h-5 w-5 text-primary animate-pulse" />
              <span className="text-sm font-medium text-gray-700">Market Intelligence Dashboard</span>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-gray-900">Competition </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">Trends</span>
            </motion.h1>
            
            <motion.p
              className="text-lg text-gray-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Analyze your market and stay ahead of the competition
            </motion.p>

            {/* Stats Cards */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  whileHover={{ scale: 1.05, y: -5 }}
                  data-testid={`stat-${index}`}
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-4">
                      <motion.div
                        className={`h-12 w-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        {stat.icon}
                      </motion.div>
                      <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                      <p className="text-xs text-gray-600">{stat.label}</p>
                    </CardContent>
                  </Card>
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
          className="space-y-6"
        >
          {/* Date Filter Card */}
          <motion.div variants={staggerItem}>
            <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Market Analysis</h2>
                    <p className="text-sm text-gray-600">Competition trend in your area</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 font-medium">Jul 2025 To Sep 2025</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-gradient-to-r from-primary/5 to-accent/5 hover:from-primary/10 hover:to-accent/10 border-primary/20" 
                      asChild
                    >
                      <Link href="/advertise">
                        Select month
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Competition Trend Chart */}
          <motion.div variants={staggerItem} whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
            <div className="shadow-xl hover:shadow-2xl transition-all duration-300 rounded-lg overflow-hidden">
              <CompetitionTrendChart activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
          </motion.div>
          
          {/* Category Table */}
          <motion.div variants={staggerItem} whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
            <div className="shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden">
              <CategoryWiseTable activeTab={activeTab} />
            </div>
          </motion.div>

          {/* Feedback Section */}
          <motion.div 
            variants={staggerItem}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <p className="text-gray-700 font-medium">Was this insight helpful?</p>
                  <div className="flex gap-3">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-white hover:bg-green-50 hover:border-green-500 hover:text-green-600 transition-all"
                        data-testid="feedback-yes"
                      >
                        👍 Yes
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-white hover:bg-red-50 hover:border-red-500 hover:text-red-600 transition-all"
                        data-testid="feedback-no"
                      >
                        👎 No
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Competitor Advertising */}
          <motion.div variants={staggerItem} whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
            <div className="shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden">
              <CompetitorAdvertising />
            </div>
          </motion.div>
          
          {/* Success Stories */}
          <motion.div variants={staggerItem} whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
            <div className="shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden">
              <SuccessStories />
            </div>
          </motion.div>
          
          {/* Most Liked Features */}
          <motion.div variants={staggerItem} whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
            <div className="shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden">
              <MostLikedFeatures />
            </div>
          </motion.div>
          
          {/* Business Insights */}
          <motion.div variants={staggerItem} whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
            <div className="shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden">
              <BusinessProfileInsights />
            </div>
          </motion.div>
          
          <Separator className="my-8" />
          
          {/* CTA Section */}
          <motion.div variants={staggerItem}>
            <Card className="bg-gradient-to-r from-primary via-accent to-primary border-0 shadow-2xl overflow-hidden">
              <CardContent className="p-12 text-center text-white relative">
                <motion.div
                  className="absolute inset-0 opacity-10"
                  animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                  transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
                  style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '50px 50px' }}
                />
                <div className="relative z-10">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Megaphone className="h-16 w-16 mx-auto mb-6" />
                  </motion.div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Boost Your Business?</h2>
                  <p className="text-lg mb-8 text-white/90">Start advertising now and reach more customers in your area</p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      size="lg" 
                      className="bg-white text-primary hover:bg-gray-100 h-14 px-10 rounded-full text-lg font-semibold shadow-xl" 
                      asChild
                      data-testid="advertise-now-button"
                    >
                      <Link href="/advertise">
                        <Megaphone className="mr-2 h-5 w-5" />
                        Advertise Now
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>

      <JustdialFooter />
    </motion.div>
  );
}
