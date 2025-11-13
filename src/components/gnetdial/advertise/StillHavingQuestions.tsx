
'use client';
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

export function StillHavingQuestions() {
  return (
    <motion.section 
      className="mt-16 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 p-10 rounded-3xl shadow-2xl relative overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ backgroundSize: '200% 200%' }}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center space-x-6 flex-1">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Image 
              src="https://picsum.photos/seed/faq-illustration/100/100" 
              alt="Still having questions" 
              width={100} 
              height={100}
              className="rounded-full shadow-xl border-4 border-white"
            />
          </motion.div>
          <div>
            <h3 className="font-bold text-2xl mb-2 text-gradient-animated">Still Having Questions?</h3>
            <p className="text-gray-600">Ask us your question and we will get back to you</p>
          </div>
        </div>
        
        <motion.div 
          className="flex items-center space-x-3 w-full md:w-1/2"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Input 
            placeholder="Enter your question" 
            className="bg-white shadow-lg border-2 border-transparent focus:border-primary transition-all h-12"
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 shadow-lg h-12 px-6">
              <Send className="w-4 h-4 mr-2" />
              Submit
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
