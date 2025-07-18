"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export const FAQSection = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "How does Curated Crate work?",
      answer:
        "Simply browse our collection, add items to your custom crate, and we'll beautifully package and ship it to your recipient.",
    },
    {
      question: "What types of products do you offer?",
      answer:
        "We offer handcrafted items including candles, gourmet foods, wellness products, stationery, and home goods from independent artisans.",
    },
    {
      question: "How much does shipping cost?",
      answer:
        "We offer free standard shipping on orders over $50. For orders under $50, standard shipping is $9.99.",
    },
    {
      question: "Can I customize my gift box?",
      answer:
        "Yes! You can build your own custom crate by selecting individual items from our collection and add a personalized note.",
    },
    {
      question: "Do you offer gift wrapping?",
      answer:
        "All our crates come beautifully packaged in our signature eco-friendly boxes with tissue paper and ribbon at no extra cost.",
    },
  ];

  return (
    <section className="py-20 px-6 bg-foreground/5">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-foreground/70">
            Everything you need to know about creating your perfect crate
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-background border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-foreground/5 transition-colors"
                  >
                    <h3 className="font-serif font-bold text-lg text-foreground pr-4">
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: openItems.includes(index) ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
                    </motion.div>
                  </button>

                  <motion.div
                    initial={false}
                    animate={{
                      height: openItems.includes(index) ? "auto" : 0,
                      opacity: openItems.includes(index) ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <p className="text-foreground/70 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-foreground/70 mb-4">Still have questions?</p>
          <Link href="/faq">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full">
              View All FAQs
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
