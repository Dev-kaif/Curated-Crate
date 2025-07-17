"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Save, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
} from "@/backend/lib/config";

interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number; // For sales
  images: string[];
  category: "Gourmet" | "Wellness" | "Stationery" | "Home Goods" | "Apparel";
  stock: number;
  dimensions?: string; // e.g., "5in x 3in x 2in"
  weight?: number; // in grams
  materials?: string[];
  isActive: boolean;
}

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const { id: productId } = params;

  const [productData, setProductData] = useState<Partial<IProduct>>({});
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      setIsFetching(true);
      try {
        const { data } = await axios.get(`/api/products/${productId}`);
        if (data.success) {
          setProductData(data.data);
          setExistingImageUrls(data.data.images || []);
          setImagePreviews(data.data.images || []);
        } else {
          throw new Error(data.message || "Failed to fetch product data.");
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message || err.message || "An error occurred."
        );
      } finally {
        setIsFetching(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleInputChange = (
    field: string,
    value: string | boolean | number
  ) => {
    setProductData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number, isNew: boolean) => {
    if (isNew) {
      const newImageIndex = index - existingImageUrls.length;
      setNewImages((prev) => prev.filter((_, i) => i !== newImageIndex));
    } else {
      setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
    }
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // 1. Upload any new images to Cloudinary
      const newImageUrls: string[] = [];
      for (const image of newImages) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );
        newImageUrls.push(res.data.secure_url);
      }

      // 2. Prepare product data for API
      const finalProductData = {
        ...productData,
        price: parseFloat(productData.price as unknown as string),
        compareAtPrice: productData.compareAtPrice
          ? parseFloat(productData.compareAtPrice as unknown as string)
          : undefined,
        stock: parseInt(productData.stock as unknown as string, 10),
        images: [...existingImageUrls, ...newImageUrls],
      };

      // 3. Send data to your backend to update the product
      const { data } = await axios.put(
        `/api/products/${productId}`,
        finalProductData
      );

      if (!data.success) {
        throw new Error(data.message || "Failed to update product");
      }

      setSuccess("Product updated successfully! Redirecting...");
      setTimeout(() => router.push("/admin/products"), 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "An error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <AdminLayout title="Edit Product">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-10 w-1/3" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-48" />
              <Skeleton className="h-64" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48" />
              <Skeleton className="h-40" />
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Product">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/products">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
            </Link>
            <div>
              <h2 className="text-lg font-semibold">Edit Product</h2>
              <p className="text-sm text-gray-600">
                Update the details for: {productData.name}
              </p>
            </div>
          </div>
          <Button type="submit" form="edit-product-form" disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="border-green-500 text-green-700">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <form
          id="edit-product-form"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Product Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={productData.name || ""}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={productData.description || ""}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      rows={4}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Product Images */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label htmlFor="images" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Upload new images
                          </span>
                        </label>
                        <input
                          id="images"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <img
                              src={preview}
                              alt={`Product preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                removeImage(
                                  index,
                                  index >= existingImageUrls.length
                                )
                              }
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              disabled={isLoading}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Inventory</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={productData.price || ""}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="compareAtPrice">
                      Compare At Price (Optional)
                    </Label>
                    <Input
                      id="compareAtPrice"
                      type="number"
                      step="0.01"
                      value={productData.compareAtPrice || ""}
                      onChange={(e) =>
                        handleInputChange("compareAtPrice", e.target.value)
                      }
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={productData.stock || ""}
                      onChange={(e) =>
                        handleInputChange("stock", e.target.value)
                      }
                      required
                      disabled={isLoading}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Organization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={productData.category}
                      onValueChange={(value) =>
                        handleInputChange("category", value)
                      }
                      required
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gourmet">Gourmet</SelectItem>
                        <SelectItem value="Wellness">Wellness</SelectItem>
                        <SelectItem value="Stationery">Stationery</SelectItem>
                        <SelectItem value="Home Goods">Home Goods</SelectItem>
                        <SelectItem value="Apparel">Apparel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isActive">Product Status</Label>
                    <Switch
                      id="isActive"
                      checked={productData.isActive}
                      onCheckedChange={(checked) =>
                        handleInputChange("isActive", checked)
                      }
                      disabled={isLoading}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
