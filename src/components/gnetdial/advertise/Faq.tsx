
'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { faqItems } from "@/lib/gnetdial-data"
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

export function Faq() {
  return (
    <section className="mt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <motion.div
          className="inline-block mb-4"
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <HelpCircle className="w-12 h-12 text-primary mx-auto" />
        </motion.div>
        <h2 className="text-4xl font-bold mb-3 text-gradient-animated">Got a question?</h2>
        <p className="text-gray-600 text-lg">We've got answers to your most common questions</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Accordion 
          type="single" 
          collapsible 
          className="w-full bg-white rounded-3xl p-8 shadow-2xl border-2 border-transparent hover:border-primary/20 transition-all duration-300"
        >
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <AccordionItem value={`item-${index}`} className="border-b-2 border-gray-100">
                <AccordionTrigger className="text-left hover:no-underline text-lg font-semibold hover:text-primary transition-colors py-6">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed pb-6">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </motion.div>
    </section>
  )
}
