import Link from "next/link"
import { Instagram, Facebook } from "lucide-react"

export const Footer = () => {
  return (
    <footer className="py-16 px-6 bg-foreground/10">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-foreground">Curated Crate</h3>
            <p className="text-foreground/70 leading-relaxed">
              Making gifting personal, meaningful, and effortless. Supporting independent artisans one crate at a time.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-foreground">Quick Links</h4>
            <div className="space-y-2">
              {[
                { name: "Shop", href: "/shop" },
                { name: "About Us", href: "/about" },
                { name: "FAQ", href: "/faq" },
                { name: "Contact", href: "/contact" },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-foreground/70 hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-foreground">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-2 bg-foreground/10 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-foreground/10 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-foreground/20 mt-12 pt-8 text-center">
          <p className="text-foreground/60">© {new Date().getFullYear()} Curated Crate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
