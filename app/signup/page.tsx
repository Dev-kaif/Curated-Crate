"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { PageLayout } from "@/components/Layout/page-layout"
import Link from "next/link"

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle signup logic here
    console.log("Signup attempt:", formData)
  }

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
              <h1 className="text-3xl font-serif font-bold text-foreground mb-4">Create Your Account</h1>
              <p className="text-foreground/70">Join our community and start building beautiful gift crates</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="p-8 bg-background border-0 shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-foreground font-medium">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="rounded-full border-foreground/20 focus:border-primary"
                        placeholder="First name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-foreground font-medium">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="rounded-full border-foreground/20 focus:border-primary"
                        placeholder="Last name"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="rounded-full border-foreground/20 focus:border-primary"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="rounded-full border-foreground/20 focus:border-primary pr-12"
                        placeholder="Create a password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-foreground font-medium">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="rounded-full border-foreground/20 focus:border-primary pr-12"
                        placeholder="Confirm your password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
                    />
                    <Label htmlFor="terms" className="text-sm text-foreground/70">
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary hover:text-primary/80">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-primary hover:text-primary/80">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    disabled={!formData.agreeToTerms}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg font-medium rounded-full disabled:opacity-50"
                  >
                    Create Account
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-foreground/70">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                      Sign in
                    </Link>
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
