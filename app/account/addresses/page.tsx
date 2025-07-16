"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Plus, Edit, Trash2, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AccountLayout } from "@/components/account-layout"

export default function AddressesPage() {
  const [addresses] = useState([
    {
      id: 1,
      type: "Home",
      name: "Sarah Johnson",
      address: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      isDefault: true,
    },
    {
      id: 2,
      type: "Work",
      name: "Sarah Johnson",
      address: "456 Business Ave",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      isDefault: false,
    },
  ])

  return (
    <AccountLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Saved Addresses</h1>
            <p className="text-foreground/70">Manage your shipping addresses</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Address
          </Button>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {addresses.map((address, index) => (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="bg-background border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-lg text-foreground">{address.type}</h3>
                        {address.isDefault && (
                          <Badge className="bg-primary/10 text-primary border-0 text-xs">Default</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="p-2 hover:bg-foreground/5 rounded-full">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-2 hover:bg-red-50 hover:text-red-600 rounded-full">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-foreground/70 space-y-1">
                    <p className="font-medium text-foreground">{address.name}</p>
                    <p>{address.address}</p>
                    <p>
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                  </div>

                  {!address.isDefault && (
                    <Button variant="outline" size="sm" className="mt-4 rounded-full bg-transparent">
                      Set as Default
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </AccountLayout>
  )
}
