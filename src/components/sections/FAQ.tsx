import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How does multi-tenant isolation work?",
    answer: "Each organization's data is logically separated at the database level using Tenant IDs. All API requests are strictly scoped, meaning it is mathematically impossible for one organization to access another's data."
  },
  {
    question: "Can we self-host CommonDesk?",
    answer: "Yes, CommonDesk includes options for self-hosting on your own AWS, GCP, or Azure infrastructure. We provide Terraform scripts and Docker images for deployment."
  },
  {
    question: "What compliance standards do you meet?",
    answer: "CommonDesk is SOC 2 Type II compliant, GDPR ready, and HIPAA compliant. We undergo regular third-party penetration testing and maintain comprehensive audit logs."
  },
  {
    question: "Is there a limit on team members?",
    answer: "There are no hard limits. Our architecture is designed to scale horizontally. Whether you have 10 or 10,000 employees, the platform remains blazing fast."
  }
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 relative max-w-4xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 tracking-tight">
          Frequently asked questions
        </h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div 
            key={i} 
            className="glass-card rounded-2xl border border-surface-border overflow-hidden transition-colors hover:border-surface-border"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <span className="font-semibold text-lg text-text-primary">{faq.question}</span>
              <motion.div
                animate={{ rotate: openIndex === i ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center text-text-muted shrink-0 ml-4"
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-6 pb-6 text-text-secondary leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};
