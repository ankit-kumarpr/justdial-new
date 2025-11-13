'use client';

import { JustdialHeader } from '@/components/justdial/JustdialHeader';
import { JustdialFooter } from '@/components/justdial/JustdialFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MessageCircle, HelpCircle, CheckCircle, Clock, Search } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '@/lib/animations';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

const stats = [
  { label: 'Total Questions', value: '0', icon: <MessageCircle className="h-6 w-6" />, color: 'from-blue-400 to-blue-600' },
  { label: 'Unanswered', value: '0', icon: <Clock className="h-6 w-6" />, color: 'from-orange-400 to-orange-600' },
  { label: 'Answered', value: '0', icon: <CheckCircle className="h-6 w-6" />, color: 'from-green-400 to-green-600' },
  { label: 'Response Rate', value: '0%', icon: <HelpCircle className="h-6 w-6" />, color: 'from-purple-400 to-purple-600' },
];

export default function QuestionsPage() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen"
      data-testid="questions-page"
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
              <MessageCircle className="h-5 w-5 text-primary animate-pulse" />
              <span className="text-sm font-medium text-gray-700">Customer Engagement Hub</span>
            </motion.div>

            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-gray-900">Questions & </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">Answers</span>
            </motion.h1>
            
            <motion.p
              className="text-lg text-gray-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Manage customer inquiries and build trust
            </motion.p>

            {/* Business Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-block"
            >
              <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg border border-gray-200">
                <h2 className="font-semibold text-lg">Xncoder</h2>
                <p className="text-sm text-gray-500">Kamal Chowk, Nagpur</p>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8"
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
        >
          <motion.div variants={staggerItem}>
            <Card className="bg-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6">
                <Tabs defaultValue="all" className="w-full">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <TabsList className="bg-gray-100">
                      <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
                      <TabsTrigger value="unanswered" data-testid="tab-unanswered">Unanswered (0)</TabsTrigger>
                      <TabsTrigger value="answered" data-testid="tab-answered">Answered (0)</TabsTrigger>
                    </TabsList>
                    <div className="relative w-full md:w-64">
                      <input
                        type="text"
                        placeholder="Search questions..."
                        className="w-full h-10 pl-10 pr-4 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        data-testid="search-questions"
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <TabsContent value="all">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-center py-20"
                    >
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Image 
                          src={findImage('no-data-illustration')}
                          alt="No data to show"
                          width={200}
                          height={200}
                          className="mx-auto mb-6 opacity-80"
                        />
                      </motion.div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No Questions Yet</h3>
                      <p className="text-gray-500 mb-6">Your customers haven't asked any questions yet</p>
                      <Button className="bg-gradient-to-r from-primary to-accent" data-testid="encourage-button">
                        Encourage Customer Engagement
                      </Button>
                    </motion.div>
                  </TabsContent>
                  
                  <TabsContent value="unanswered">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-center py-20"
                    >
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Image 
                          src={findImage('no-data-illustration')}
                          alt="No unanswered questions"
                          width={200}
                          height={200}
                          className="mx-auto mb-6 opacity-80"
                        />
                      </motion.div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
                      <p className="text-gray-500">No unanswered questions at the moment</p>
                    </motion.div>
                  </TabsContent>
                  
                  <TabsContent value="answered">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-center py-20"
                    >
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Image 
                          src={findImage('no-data-illustration')}
                          alt="No answered questions"
                          width={200}
                          height={200}
                          className="mx-auto mb-6 opacity-80"
                        />
                      </motion.div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No Answered Questions</h3>
                      <p className="text-gray-500">Start answering customer questions to build trust</p>
                    </motion.div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
      
      <JustdialFooter />
    </motion.div>
  );
}
