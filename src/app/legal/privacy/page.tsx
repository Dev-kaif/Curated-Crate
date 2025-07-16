"use client"

import { motion } from "framer-motion"
import { PageLayout } from "@/components/Layout/page-layout"

export default function PrivacyPolicyPage() {
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
            <h1 className="text-4xl font-serif font-bold text-foreground mb-8">Privacy Policy</h1>
            <p className="text-foreground/60 mb-8">Last updated: January 1, 2024</p>

            <div className="space-y-8 text-foreground/80">
              <section>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Information We Collect</h2>
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
                <h2 className="text-2xl font-serif font-bold text-foreground mb-4">How We Use Your Information</h2>
                <p className="leading-relaxed mb-4">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                  totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta
                  sunt explicabo.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Nemo enim ipsam voluptatem quia voluptas sit aspernatur</li>
                  <li>Aut odit aut fugit, sed quia consequuntur magni dolores</li>
                  <li>Eos qui ratione voluptatem sequi nesciunt</li>
                  <li>Neque porro quisquam est, qui dolorem ipsum</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Data Security</h2>
                <p className="leading-relaxed mb-4">
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum
                  deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non
                  provident.
                </p>
                <p className="leading-relaxed">
                  Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum
                  quidem rerum facilis est et expedita distinctio.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Contact Information</h2>
                <p className="leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-foreground/5 rounded-lg">
                  <p className="font-medium">Curated Crate</p>
                  <p>123 Artisan Way</p>
                  <p>San Francisco, CA 94102</p>
                  <p>Email: privacy@curatedcrate.com</p>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  )
}
