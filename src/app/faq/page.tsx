"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { PageLayout } from "@/components/Layout/page-layout"

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const faqs = [
    {
      question: "How does Curated Crate work?",
      answer:
        "Simply browse our collection of artisanal goods, add items to your custom crate, and we'll beautifully package and ship it to your recipient. You can also choose from our pre-designed themed boxes for specific occasions.",
    },
    {
      question: "What types of products do you offer?",
      answer:
        "We offer a carefully curated selection of handcrafted items including candles, gourmet foods, wellness products, stationery, and home goods. All products are sourced from independent artisans and small businesses.",
    },
    {
      question: "How much does shipping cost?",
      answer:
        "We offer free standard shipping on orders over $50. For orders under $50, standard shipping is $9.99. We also offer express shipping ($19.99) and overnight shipping ($29.99) options.",
    },
    {
      question: "Can I customize my gift box?",
      answer:
        "You can build your own custom crate by selecting individual items from our collection. You can also add a personalized note and choose from different box sizes and packaging options.",
    },
    {
      question: "Do you offer gift wrapping?",
      answer:
        "Yes! All our crates come beautifully packaged in our signature eco-friendly boxes with tissue paper and a ribbon. You can also add a personalized gift message at no extra cost.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We want you to love your crate! If you're not completely satisfied, you can return unopened items within 30 days for a full refund. Personalized items and perishable goods cannot be returned.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "Standard shipping typically takes 5-7 business days. Express shipping takes 2-3 business days, and overnight shipping delivers the next business day. You'll receive tracking information once your order ships.",
    },
    {
      question: "Can I send a crate directly to someone else?",
      answer:
        "Yes! During checkout, you can enter a different shipping address for the recipient. You can also include a personalized gift message that will be included with the package.",
    },
    {
      question: "Do you offer corporate or bulk orders?",
      answer:
        "Yes, we offer special pricing for corporate gifts and bulk orders. Please contact our team at hello@curatedcrate.com for more information about volume discounts and custom corporate packages.",
    },
    {
      question: "Are your products eco-friendly?",
      answer:
        "We prioritize sustainability by working with artisans who use eco-friendly materials and practices. Our packaging is recyclable and biodegradable, and we offset the carbon footprint of all shipments.",
    },
  ]

  return (
    <PageLayout>
      <div className="py-12 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Find answers to common questions about our products, shipping, and services
            </p>
          </motion.div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-background border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-foreground/5 transition-colors"
                    >
                      <h3 className="font-serif font-bold text-lg text-foreground pr-4">{faq.question}</h3>
                      {openItems.includes(index) ? (
                        <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
                      )}
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
                        <p className="text-foreground/70 leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center mt-16"
          >
            <Card className="bg-primary/5 border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Still have questions?</h2>
                <p className="text-foreground/70 mb-6">
                  Our customer service team is here to help you find the perfect gift
                </p>
                <a href="/contact">
                  <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full font-medium transition-colors">
                    Contact Us
                  </button>
                </a>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  )
}
