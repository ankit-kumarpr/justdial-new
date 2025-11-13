
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Users, Mail, Eye, Database, AlertCircle, FileText, CheckCircle } from "lucide-react";
import { motion } from 'framer-motion';
import { pageTransition, staggerContainer, staggerItem } from '@/lib/animations';

const policyIcons = [
  { icon: <Shield className="h-6 w-6" />, title: 'Data Protection', color: 'from-blue-400 to-blue-600' },
  { icon: <Lock className="h-6 w-6" />, title: 'Secure Storage', color: 'from-green-400 to-green-600' },
  { icon: <Eye className="h-6 w-6" />, title: 'Transparency', color: 'from-purple-400 to-purple-600' },
  { icon: <CheckCircle className="h-6 w-6" />, title: 'Compliance', color: 'from-orange-400 to-orange-600' },
];

export default function PolicyClientPage({ content }: { content: string }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen"
      data-testid="policy-page"
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
              <Shield className="h-10 w-10 text-white" />
            </motion.div>

            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-gray-900">Privacy </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 animate-gradient">Policy</span>
            </motion.h1>
            
            <motion.p
              className="text-xl text-gray-600 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Your privacy is our priority
            </motion.p>

            <motion.p
              className="text-sm text-gray-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Last Updated: July 31, 2024
            </motion.p>

            {/* Policy Icons */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-8"
            >
              {policyIcons.map((item, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  whileHover={{ scale: 1.05, y: -5 }}
                  data-testid={`policy-icon-${index}`}
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
                      <CardTitle className="text-2xl">Privacy Policy</CardTitle>
                  </CardHeader>
                  <CardContent className="prose max-w-none prose-sm sm:prose-base">
                      <div dangerouslySetInnerHTML={{ __html: content || "<p>Failed to load policy content. Please try again later.</p>" }} />
                  </CardContent>
              </Card>
            </motion.div>
          )}
          
          {/* Commitment Card */}
          <motion.div variants={staggerItem} whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
            <Card className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <motion.div
                    className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Shield className="h-6 w-6" />
                  </motion.div>
                  Our Commitment to Your Privacy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">Gnetdial is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services. We encourage you to read this policy carefully to understand our practices regarding your information and how we will treat it.</p>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Information Collection Card */}
          <motion.div variants={staggerItem} whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
            <Card className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <motion.div
                    className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white shadow-lg"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Users className="h-6 w-6" />
                  </motion.div>
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-600">
                <p className="leading-relaxed">We may collect personal information from you in a variety of ways, including, but not limited to, when you visit our site, register on the site, place an order, subscribe to the newsletter, and in connection with other activities, services, features or resources we make available.</p>
                <div className="space-y-3">
                  <motion.div 
                    className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Database className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-gray-900">Personal Identification Information:</strong>
                      <p>Name, email address, mailing address, phone number.</p>
                    </div>
                  </motion.div>
                  <motion.div 
                    className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FileText className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-gray-900">Non-personal Identification Information:</strong>
                      <p>Browser name, type of computer, and technical information about your means of connection to our site.</p>
                    </div>
                  </motion.div>
                  <motion.div 
                    className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Eye className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-gray-900">Usage Data:</strong>
                      <p>Information about how you use our website, products, and services.</p>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* How We Use Information Card */}
          <motion.div variants={staggerItem} whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
            <Card className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <motion.div
                    className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Lock className="h-6 w-6" />
                  </motion.div>
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                <p className="leading-relaxed mb-4">We use the information we collect for various purposes, including to:</p>
                <div className="space-y-2">
                  {[
                    'Provide, operate, and maintain our services.',
                    'Improve, personalize, and expand our services.',
                    'Understand and analyze how you use our services.',
                    'Develop new products, services, features, and functionality.',
                    'Communicate with you for customer service and marketing purposes.'
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Card */}
          <motion.div variants={staggerItem} whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
            <Card className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <motion.div
                    className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-lg"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Mail className="h-6 w-6" />
                  </motion.div>
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                <p className="leading-relaxed">If you have any questions about this Privacy Policy, please contact us at{' '}
                  <a href="mailto:policy@gnetdial.com" className="text-primary hover:underline font-semibold">
                    policy@gnetdial.com
                  </a>
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Important Notice */}
          <motion.div variants={staggerItem}>
            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="h-6 w-6 text-amber-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-amber-900 mb-2">Important Notice</h3>
                    <p className="text-amber-800 text-sm leading-relaxed">
                      By using our services, you acknowledge that you have read and understood this Privacy Policy and agree to its terms. We reserve the right to update this policy at any time, and we will notify you of any changes by posting the new policy on this page.
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
