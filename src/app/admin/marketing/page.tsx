"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Copy, Calendar, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";
import { IDiscount } from "@/backend/models/Discount";

const getStatus = (discount: IDiscount): "Active" | "Expired" | "Inactive" => {
  if (!discount.isActive) return "Inactive";
  if (discount.expiryDate && new Date(discount.expiryDate) < new Date())
    return "Expired";
  return "Active";
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800 border-green-200";
    case "Expired":
      return "bg-red-100 text-red-800 border-red-200";
    case "Inactive":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function MarketingManagement() {
  const [discounts, setDiscounts] = useState<IDiscount[]>([]);
  const [stats, setStats] = useState({
    activeCodes: 0,
    totalUses: 0,
    savingsGiven: 0,
    conversionRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newDiscount, setNewDiscount] = useState({
    code: "",
    type: "percentage",
    value: "",
    description: "",
    maxUses: "",
    expiryDate: "",
    isActive: true,
  });

  const fetchDiscounts = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/api/admin/discounts");
      if (data.success) {
        setDiscounts(data.data);
        setStats(data.stats);
      } else {
        throw new Error(data.message || "Failed to fetch discounts");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setNewDiscount((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        ...newDiscount,
        value: parseFloat(newDiscount.value),
        maxUses: newDiscount.maxUses
          ? parseInt(newDiscount.maxUses, 10)
          : undefined,
      };
      const { data } = await axios.post("/api/admin/discounts", payload);
      if (!data.success) {
        throw new Error(data.message || "Failed to create discount");
      }
      setIsCreateModalOpen(false);
      fetchDiscounts(); // Refresh data
      setNewDiscount({
        code: "",
        type: "percentage",
        value: "",
        description: "",
        maxUses: "",
        expiryDate: "",
        isActive: true,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDiscount = async (discountId: string) => {
    try {
      await axios.delete(`/api/admin/discounts/${discountId}`);
      fetchDiscounts(); // Refresh data
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete discount");
    }
  };

  const copyDiscountCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <AdminLayout title="Marketing & Promotions">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Discount Codes</h2>
            <p className="text-sm text-gray-600">
              Create and manage promotional discount codes
            </p>
          </div>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Discount Code
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Discount Code</DialogTitle>
                <DialogDescription>
                  Set up a new promotional discount code for your customers.
                </DialogDescription>
              </DialogHeader>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleCreateDiscount} className="space-y-4">
                <div>
                  <Label htmlFor="code">Code Name</Label>
                  <Input
                    id="code"
                    value={newDiscount.code}
                    onChange={(e) =>
                      handleInputChange("code", e.target.value.toUpperCase())
                    }
                    placeholder="e.g., SUMMER10"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Discount Type</Label>
                  <Select
                    value={newDiscount.type}
                    onValueChange={(value) => handleInputChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="free-shipping">
                        Free Shipping
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="value">Value</Label>
                  <Input
                    id="value"
                    type="number"
                    value={newDiscount.value}
                    onChange={(e) => handleInputChange("value", e.target.value)}
                    placeholder={
                      newDiscount.type === "percentage" ? "10" : "25.00"
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newDiscount.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Brief description of the discount"
                  />
                </div>
                <div>
                  <Label htmlFor="maxUses">Max Uses (Optional)</Label>
                  <Input
                    id="maxUses"
                    type="number"
                    value={newDiscount.maxUses}
                    onChange={(e) =>
                      handleInputChange("maxUses", e.target.value)
                    }
                    placeholder="Leave empty for unlimited"
                  />
                </div>
                <div>
                  <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={newDiscount.expiryDate}
                    onChange={(e) =>
                      handleInputChange("expiryDate", e.target.value)
                    }
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Discount"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Codes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeCodes}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Uses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUses}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Savings Given
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.savingsGiven.toFixed(2)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.conversionRate.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? [...Array(4)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={7}>
                        <Skeleton className="h-10 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                : discounts.map((discount) => {
                    const status = getStatus(discount);
                    return (
                      <TableRow key={discount._id as string}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                              {discount.code}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyDiscountCode(discount.code)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {discount.description}
                          </div>
                        </TableCell>
                        <TableCell>{discount.type}</TableCell>
                        <TableCell className="font-medium">
                          {discount.type === "percentage"
                            ? `${discount.value}%`
                            : discount.type === "fixed"
                              ? `$${discount.value.toFixed(2)}`
                              : "Free"}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {discount.uses} / {discount.maxUses || "∞"}
                          </div>
                          {discount.maxUses && (
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full"
                                style={{
                                  width: `${(discount.uses / discount.maxUses) * 100}%`,
                                }}
                              />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {discount.expiryDate ? (
                            <div className="flex items-center text-sm">
                              <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                              {new Date(
                                discount.expiryDate
                              ).toLocaleDateString()}
                            </div>
                          ) : (
                            "No expiry"
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(status)} border`}>
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete the discount
                                    code.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteDiscount(
                                        discount._id as string
                                      )
                                    }
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
