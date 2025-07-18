"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/contexts/store-context";
import { SearchOverlay } from "./search-overlay";

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const { state } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Build a Box", href: "/shop" },
    { name: "Themed Boxes", href: "/themed" },
    { name: "Our Story", href: "/about" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ];

  const cartCount = state.cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const wishlistCount = state.wishlist.length;

  const handleSearchClick = () => {
    setIsSearchOverlayOpen(true);
    // Optional: Disable body scroll when overlay is open
    document.body.style.overflow = "hidden";
  };

  const handleCloseSearchOverlay = () => {
    setIsSearchOverlayOpen(false);
    // Re-enable body scroll
    document.body.style.overflow = "";
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "backdrop-blur-lg bg-background/80 border-b border-foreground/10"
            : "backdrop-blur-sm bg-background/60"
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Link
                className="text-2xl font-serif font-bold text-foreground hover:text-primary transition-colors flex gap-3 items-center"
                href="/"
              >
                <img
                  src="/logo.png"
                  alt="Curated Crate Logo"
                  className="h-8 w-auto"
                />
                <span> Curated Crate</span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className={`text-foreground hover:text-primary transition-colors duration-200 font-medium ${
                      pathname === link.href ? "text-primary" : ""
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Action Icons */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                onClick={handleSearchClick} // Call the new handler
                className="p-2 hover:bg-foreground/5 rounded-full transition-colors"
              >
                <Search className="w-5 h-5 text-foreground" />
              </motion.button>

              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => router.push("/wishlist")}
                className="p-2 hover:bg-foreground/5 rounded-full transition-colors relative"
              >
                <Heart className="w-5 h-5 text-foreground" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-primary">
                    {wishlistCount}
                  </Badge>
                )}
              </motion.button>

              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                onClick={() => router.push("/cart")}
                className="p-2 hover:bg-foreground/5 rounded-full transition-colors relative"
              >
                <ShoppingBag className="w-5 h-5 text-foreground" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-primary">
                    {cartCount}
                  </Badge>
                )}
              </motion.button>

              {/* === AUTH BUTTONS (DESKTOP) === */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="hidden md:flex items-center space-x-2"
              >
                {status === "loading" ? (
                  <div className="h-10 w-24 rounded-full bg-foreground/10 animate-pulse" />
                ) : session ? (
                  <Link href="/account/dashboard">
                    <Button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium">Profile</span>
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="ghost" className="rounded-full">
                        Log In
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button className="bg-primary text-primary-foreground rounded-full hover:bg-primary/90">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </motion.div>

              {/* Mobile Menu Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="md:hidden p-2 hover:bg-foreground/5 rounded-full transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background/95 backdrop-blur-lg border-t border-foreground/10"
            >
              <div className="container mx-auto px-6 py-4 space-y-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className="block text-foreground hover:text-primary transition-colors py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                {/* === AUTH BUTTONS (MOBILE) === */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="pt-4 mt-4 border-t border-foreground/10"
                >
                  {status === "loading" ? (
                    <div className="h-10 w-full rounded-full bg-foreground/10 animate-pulse" />
                  ) : session ? (
                    <div className="space-y-2">
                      <Link
                        href="/account/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button className="w-full justify-start">
                          <User className="w-4 h-4 mr-2" /> Profile
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          signOut();
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        href="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button className="w-full">Log In</Button>
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button variant="ghost" className="w-full">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <AnimatePresence>
        {isSearchOverlayOpen && (
          <SearchOverlay
            isOpen={isSearchOverlayOpen}
            onClose={handleCloseSearchOverlay}
          />
        )}
      </AnimatePresence>
    </>
  );
};
