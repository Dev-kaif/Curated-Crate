"use client";

import type React from "react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { signIn } from "next-auth/react"; // Import signIn from next-auth
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageLayout } from "@/components/Layout/page-layout";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null); // State for login errors
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Use the signIn function from NextAuth.js
      const result = await signIn("credentials", {
        redirect: false, // We handle the redirect manually
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        // If NextAuth returns an error, display it
        setError("Invalid email or password. Please try again.");
        setIsLoading(false);
      } else if (result?.ok) {
        // If login is successful, redirect to the homepage
        router.push("/");
        router.refresh(); // Refresh the page to update session state everywhere
      }
    } catch (err) {
      // Handle unexpected errors
      console.error("Login failed:", err);
      setError("An unexpected error occurred. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="py-20 px-6">
        <div className="container mx-auto">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
                Welcome Back
              </h1>
              <p className="text-foreground/70">
                Sign in to your account to continue building your perfect crate
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="p-8 bg-background border-0 shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-destructive/10 text-destructive p-3 rounded-md text-center text-sm">
                      {error}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-foreground font-medium"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="rounded-full border-foreground/20 focus:border-primary"
                      placeholder="Enter your email"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-foreground font-medium"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="rounded-full border-foreground/20 focus:border-primary pr-12"
                        placeholder="Enter your password"
                        required
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1"
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Link
                      href="/forgot-password"
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg font-medium rounded-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-foreground/70">
                    Don't have an account?{" "}
                    <Link
                      href="/signup"
                      className="text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
