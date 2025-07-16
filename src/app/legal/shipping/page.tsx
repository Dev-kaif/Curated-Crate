"use client"

import { motion } from "framer-motion"
import { PageLayout } from "@/components/Layout/page-layout"

export default function ShippingPolicyPage() {
  return (
    <PageLayout>
      <div className="py-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="prose prose-lg max-w-none"
          >
            <h1 className="text-4xl font-serif font-bold text-foreground mb-8">Shipping Policy</h1>
            <p className="text-foreground/60 mb-8">Last updated: January 1, 2024</p>

            <div className="space-y-8 text-foreground/80">
              <section>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Shipping Options</h2>
                <p className="leading-relaxed mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. We offer the following shipping options:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Standard Shipping (5-7 business days): Free on orders over $50</li>
                  <li>Express Shipping (2-3 business days): $19.99</li>
                  <li>Overnight Shipping (1 business day): $29.99</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Processing Time</h2>
                <p className="leading-relaxed mb-4">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. All
                  orders are processed within 1-2 business days.
                </p>
                <p className="leading-relaxed">
                  Orders placed on weekends or holidays will be processed on the next business day. You will receive a
                  tracking number once your order has shipped.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-4">International Shipping</h2>
                <p className="leading-relaxed mb-4">
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum
                  deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non
                  provident.
                </p>
                <p className="leading-relaxed">
                  International shipping rates and delivery times vary by destination. Additional customs fees may
                  apply.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Damaged or Lost Packages</h2>
                <p className="leading-relaxed">
                  If your package arrives damaged or is lost in transit, please contact us immediately at
                  hello@curatedcrate.com. We will work with the shipping carrier to resolve the issue and ensure you
                  receive your order.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  )
}
