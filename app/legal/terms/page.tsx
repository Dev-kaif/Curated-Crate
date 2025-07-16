"use client"

import { motion } from "framer-motion"
import { PageLayout } from "@/components/Layout/page-layout"

export default function TermsOfServicePage() {
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
            <h1 className="text-4xl font-serif font-bold text-foreground mb-8">Terms of Service</h1>
            <p className="text-foreground/60 mb-8">Last updated: January 1, 2024</p>

            <div className="space-y-8 text-foreground/80">
              <section>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Acceptance of Terms</h2>
                <p className="leading-relaxed mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat.
                </p>
                <p className="leading-relaxed">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                  laborum.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Use of Service</h2>
                <p className="leading-relaxed mb-4">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                  totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta
                  sunt explicabo.
                </p>
                <p className="leading-relaxed">
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur
                  magni dolores eos qui ratione voluptatem sequi nesciunt.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Orders and Payment</h2>
                <p className="leading-relaxed mb-4">
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum
                  deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non
                  provident.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All orders are subject to acceptance and availability</li>
                  <li>Prices are subject to change without notice</li>
                  <li>Payment must be received before shipment</li>
                  <li>We reserve the right to cancel orders at any time</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Limitation of Liability</h2>
                <p className="leading-relaxed">
                  Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime
                  placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  )
}
