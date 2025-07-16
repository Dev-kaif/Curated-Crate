"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useState } from "react"
import { Check, Lock, CreditCard, Truck, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckoutLayout } from "@/components/checkout-layout"
import { useStore } from "@/contexts/store-context"
import { useRouter } from "next/navigation"

const ProgressBar = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { number: 1, name: "Shipping", icon: Truck },
    { number: 2, name: "Payment", icon: CreditCard },
    { number: 3, name: "Review", icon: FileText },
  ]

  return (
    <div className="flex items-center justify-center mb-12">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                currentStep >= step.number
                  ? "bg-primary text-primary-foreground"
                  : "bg-foreground/10 text-foreground/50"
              }`}
            >
              {currentStep > step.number ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
            </div>
            <span
              className={`ml-3 font-medium ${currentStep >= step.number ? "text-foreground" : "text-foreground/50"}`}
            >
              {step.name}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-16 h-0.5 mx-6 transition-all ${
                currentStep > step.number ? "bg-primary" : "bg-foreground/20"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

const OrderSummary = () => {
  const { state } = useStore()
  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <Card className="p-6 bg-background border-0 shadow-lg sticky top-6">
      <h2 className="font-serif font-bold text-xl text-foreground mb-6">Order Summary</h2>

      <div className="space-y-4 mb-6">
        {state.cart.map((item) => (
          <div key={item.id} className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg overflow-hidden flex-shrink-0">
              <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-grow">
              <h4 className="font-medium text-sm">{item.name}</h4>
              <p className="text-xs text-foreground/60">Qty: {item.quantity}</p>
            </div>
            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="space-y-3 border-t border-foreground/20 pt-4">
        <div className="flex justify-between">
          <span className="text-foreground/70">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground/70">Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground/70">Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t border-foreground/20 pt-3">
          <span>Total</span>
          <span className="text-primary">${total.toFixed(2)}</span>
        </div>
      </div>
    </Card>
  )
}

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [shippingData, setShippingData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  })
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  })
  const router = useRouter()

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentStep(2)
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentStep(3)
  }

  const handleFinalSubmit = () => {
    // Process order
    router.push("/order/success")
  }

  return (
    <CheckoutLayout>
      <div className="py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <ProgressBar currentStep={currentStep} />
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Step 1: Shipping */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="p-8 bg-background border-0 shadow-lg">
                    <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Shipping Information</h2>
                    <form onSubmit={handleShippingSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={shippingData.firstName}
                            onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })}
                            className="rounded-full border-foreground/20 focus:border-primary"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={shippingData.lastName}
                            onChange={(e) => setShippingData({ ...shippingData, lastName: e.target.value })}
                            className="rounded-full border-foreground/20 focus:border-primary"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={shippingData.email}
                          onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                          className="rounded-full border-foreground/20 focus:border-primary"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Street Address</Label>
                        <Input
                          id="address"
                          value={shippingData.address}
                          onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                          className="rounded-full border-foreground/20 focus:border-primary"
                          required
                        />
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={shippingData.city}
                            onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                            className="rounded-full border-foreground/20 focus:border-primary"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Select
                            value={shippingData.state}
                            onValueChange={(value) => setShippingData({ ...shippingData, state: value })}
                          >
                            <SelectTrigger className="rounded-full border-foreground/20 focus:border-primary">
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="CA">California</SelectItem>
                              <SelectItem value="NY">New York</SelectItem>
                              <SelectItem value="TX">Texas</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">ZIP Code</Label>
                          <Input
                            id="zipCode"
                            value={shippingData.zipCode}
                            onChange={(e) => setShippingData({ ...shippingData, zipCode: e.target.value })}
                            className="rounded-full border-foreground/20 focus:border-primary"
                            required
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-full"
                      >
                        Continue to Payment
                      </Button>
                    </form>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="p-8 bg-background border-0 shadow-lg">
                    <div className="flex items-center mb-6">
                      <Lock className="w-5 h-5 text-primary mr-2" />
                      <h2 className="text-2xl font-serif font-bold text-foreground">Secure Payment</h2>
                    </div>

                    <form onSubmit={handlePaymentSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={paymentData.cardNumber}
                          onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                          className="rounded-full border-foreground/20 focus:border-primary"
                          required
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={paymentData.expiryDate}
                            onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                            className="rounded-full border-foreground/20 focus:border-primary"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={paymentData.cvv}
                            onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                            className="rounded-full border-foreground/20 focus:border-primary"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="nameOnCard">Name on Card</Label>
                        <Input
                          id="nameOnCard"
                          value={paymentData.nameOnCard}
                          onChange={(e) => setPaymentData({ ...paymentData, nameOnCard: e.target.value })}
                          className="rounded-full border-foreground/20 focus:border-primary"
                          required
                        />
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-foreground/70">
                        <Lock className="w-4 h-4" />
                        <span>Your payment information is encrypted and secure</span>
                      </div>

                      <div className="flex space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentStep(1)}
                          className="flex-1 py-3 rounded-full bg-transparent"
                        >
                          Back to Shipping
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-full"
                        >
                          Review Order
                        </Button>
                      </div>
                    </form>
                  </Card>
                </motion.div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="p-8 bg-background border-0 shadow-lg">
                    <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Review Your Order</h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-bold text-foreground mb-2">Shipping Address</h3>
                        <p className="text-foreground/70">
                          {shippingData.firstName} {shippingData.lastName}
                          <br />
                          {shippingData.address}
                          <br />
                          {shippingData.city}, {shippingData.state} {shippingData.zipCode}
                        </p>
                      </div>

                      <div>
                        <h3 className="font-bold text-foreground mb-2">Payment Method</h3>
                        <p className="text-foreground/70">
                          **** **** **** {paymentData.cardNumber.slice(-4)}
                          <br />
                          {paymentData.nameOnCard}
                        </p>
                      </div>

                      <div className="flex space-x-4">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentStep(2)}
                          className="flex-1 py-3 rounded-full bg-transparent"
                        >
                          Back to Payment
                        </Button>
                        <Button
                          onClick={handleFinalSubmit}
                          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-full"
                        >
                          Place Order
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <OrderSummary />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </CheckoutLayout>
  )
}
