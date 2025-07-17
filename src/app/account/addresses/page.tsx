"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, MapPin, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AccountLayout } from "@/components/account-layout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useSession } from "next-auth/react";
import axios from "axios";
import { IAddress, IUser } from "@/types";

// Address Form Modal Component
const AddressModal = ({
  isOpen,
  setIsOpen,
  onSave,
  initialData,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (address: IAddress) => void;
  initialData?: IAddress | null;
}) => {
  const [address, setAddress] = useState<Partial<IAddress>>({});

  useEffect(() => {
    setAddress(initialData || { country: "India", isDefault: false });
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAddress((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    onSave(address as IAddress);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Address" : "Add New Address"}
          </DialogTitle>
          <DialogDescription>
            Enter your shipping address details.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="street">Street</Label>
              <Input
                id="street"
                value={address.street || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apartment">Apartment (Optional)</Label>
              <Input
                id="apartment"
                value={address.apartment || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={address.city || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={address.state || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={address.zipCode || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={address.country || ""}
                onChange={handleChange}
                disabled
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isDefault"
              checked={address.isDefault}
              onCheckedChange={(checked) =>
                setAddress((prev) => ({ ...prev, isDefault: checked }))
              }
            />
            <Label htmlFor="isDefault">Set as default address</Label>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Save Address</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<IAddress | null>(null);
  const { data: session } = useSession();

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/api/users/me");
      if (data.success) {
        setAddresses(data.data.addresses || []);
      }
    } catch (err) {
      setError("Failed to load addresses.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchAddresses();
    }
  }, [session]);

  const handleSaveAddress = async (addressToSave: IAddress) => {
    let updatedAddresses;
    if (addressToSave._id) {
      // Editing existing address
      updatedAddresses = addresses.map((addr) =>
        addr._id === addressToSave._id ? addressToSave : addr
      );
    } else {
      // Adding new address
      updatedAddresses = [...addresses, addressToSave];
    }

    // Ensure only one default address
    if (addressToSave.isDefault) {
      updatedAddresses = updatedAddresses.map((addr) => ({
        ...addr,
        isDefault: addr._id === addressToSave._id,
      }));
    }

    try {
      const { data } = await axios.put("/api/users/me", {
        addresses: updatedAddresses,
      });
      if (data.success) {
        setAddresses(data.data.addresses);
        setIsModalOpen(false);
        setEditingAddress(null);
      } else {
        throw new Error(data.message || "Failed to save address");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    const updatedAddresses = addresses.filter((addr) => addr._id !== addressId);
    try {
      const { data } = await axios.put("/api/users/me", {
        addresses: updatedAddresses,
      });
      if (data.success) {
        setAddresses(data.data.addresses);
      } else {
        throw new Error(data.message || "Failed to delete address");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleSetDefault = async (addressId: string) => {
    const updatedAddresses = addresses.map((addr) => ({
      ...addr,
      isDefault: addr._id === addressId,
    }));
    try {
      const { data } = await axios.put("/api/users/me", {
        addresses: updatedAddresses,
      });
      if (data.success) {
        setAddresses(data.data.addresses);
      } else {
        throw new Error(data.message || "Failed to set default address");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const openAddModal = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const openEditModal = (address: IAddress) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

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
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
              Saved Addresses
            </h1>
            <p className="text-foreground/70">Manage your shipping addresses</p>
          </div>
          <Button
            onClick={openAddModal}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Address
          </Button>
        </motion.div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {isLoading ? (
            [...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))
          ) : addresses.length > 0 ? (
            addresses.map((address, index) => (
              <motion.div
                key={address._id as string}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-background border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-serif font-bold text-lg text-foreground">
                            {address.label || "Address"}
                          </h3>
                          {address.isDefault && (
                            <Badge className="bg-primary/10 text-primary border-0 text-xs">
                              Default
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => openEditModal(address)}
                          variant="ghost"
                          size="sm"
                          className="p-2 hover:bg-foreground/5 rounded-full"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-2 hover:bg-red-50 hover:text-red-600 rounded-full"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete this address.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteAddress(address._id as string)
                                }
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <div className="text-foreground/70 space-y-1 flex-grow">
                      <p>
                        {address.street}
                        {address.apartment ? `, ${address.apartment}` : ""}
                      </p>
                      <p>
                        {address.city}, {address.state} {address.zipCode}
                      </p>
                      <p>{address.country}</p>
                    </div>
                    {!address.isDefault && (
                      <Button
                        onClick={() => handleSetDefault(address._id as string)}
                        variant="outline"
                        size="sm"
                        className="mt-4 rounded-full bg-transparent"
                      >
                        Set as Default
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="md:col-span-2 text-center py-12">
              <p className="text-foreground/60">You have no saved addresses.</p>
            </div>
          )}
        </div>
      </div>
      <AddressModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onSave={handleSaveAddress}
        initialData={editingAddress}
      />
    </AccountLayout>
  );
}
