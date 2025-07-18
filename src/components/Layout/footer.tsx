import Link from "next/link";
import { Instagram, Facebook, Twitter, Linkedin } from "lucide-react"; // Added Twitter and Linkedin icons

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-16 px-6 bg-foreground/5">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4 md:col-span-1">
            <h3 className="text-2xl font-serif font-bold text-foreground">
              Curated Crate
            </h3>
            <p className="text-foreground/70 leading-relaxed text-sm">
              Making gifting personal, meaningful, and effortless. Supporting
              independent artisans one crate at a time.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-foreground/10 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-foreground/10 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-foreground/10 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-foreground/10 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4 md:col-span-1">
            <h4 className="font-bold text-foreground text-lg">
              Shop & Explore
            </h4>
            <div className="space-y-2">
              {[
                { name: "Shop All Products", href: "/shop" },
                { name: "Themed Gift Boxes", href: "/themed" },
                { name: "Build Your Own Crate", href: "/build-your-own" },
                { name: "Gift Cards", href: "/gift-cards" },
                { name: "Wishlist", href: "/wishlist" },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href as string}
                  className="block text-foreground/70 hover:text-primary transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4 md:col-span-1">
            <h4 className="font-bold text-foreground text-lg">
              About & Support
            </h4>
            <div className="space-y-2">
              {[
                { name: "Our Story", href: "/about" },
                { name: "FAQs", href: "/faq" },
                { name: "Contact Us", href: "/contact" },
                { name: "Account", href: "/account/dashboard" },
                { name: "Order Tracking", href: "/account/orders" },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-foreground/70 hover:text-primary transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4 md:col-span-1">
            <h4 className="font-bold text-foreground text-lg">
              Legal & Policies
            </h4>
            <div className="space-y-2">
              {[
                { name: "Privacy Policy", href: "/legal/privacy" },
                { name: "Terms of Service", href: "/legal/terms" },
                { name: "Shipping Policy", href: "/legal/shipping" },
                { name: "Refund Policy", href: "/legal/refund" },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href as string}
                  className="block text-foreground/70 hover:text-primary transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-foreground/20 mt-12 pt-8 text-center">
          <p className="text-foreground/60 text-sm">
            © {currentYear} Curated Crate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
