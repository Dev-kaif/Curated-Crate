"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  X,
  ArrowLeft,
  Save,
  Upload,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useDebounce } from "@/hooks/use-debounce";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { IProduct } from "@/backend/models/Product";
import { IThemedBox } from "@/backend/models/ThemedBox";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
} from "@/backend/lib/config";

export default function EditThemedBox() {
  const router = useRouter();
  const params = useParams();
  const { id: boxId } = params;

  const [boxData, setBoxData] = useState<Partial<IThemedBox>>({});
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [availableProducts, setAvailableProducts] = useState<IProduct[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<IProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  useEffect(() => {
    if (!boxId) return;

    const fetchBoxData = async () => {
      setIsFetching(true);
      try {
        const [{ data: productsData }, { data: themedBoxData }] =
          await Promise.all([
            axios.get("/api/admin/products"),
            axios.get(`/api/themed-boxes/${boxId}`),
          ]);

        if (productsData.success) {
          setAvailableProducts(productsData.data);
        } else {
          throw new Error("Failed to fetch available products.");
        }

        setBoxData(themedBoxData);
        setSelectedProducts(themedBoxData.products || []);
        setImagePreview(themedBoxData.image);
      } catch (err: any) {
        setError(
          err.response?.data?.message || err.message || "An error occurred."
        );
      } finally {
        setIsFetching(false);
      }
    };

    fetchBoxData();
  }, [boxId]);

  useEffect(() => {
    const { name, description, price } = boxData;
    const isValid =
      name &&
      name.trim() !== "" &&
      description &&
      description.trim() !== "" &&
      price &&
      price.toString().trim() !== "" &&
      imagePreview !== null && // Check if there's an image preview (either existing or new)
      selectedProducts.length > 0; // Ensure at least one product is selected
    setIsFormValid(isValid as boolean);
  }, [boxData, imagePreview, selectedProducts]);

  const handleInputChange = (
    field: string,
    value: string | boolean | number
  ) => {
    setBoxData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addProduct = (product: IProduct) => {
    if (!selectedProducts.find((p) => p._id === product._id)) {
      setSelectedProducts((prev) => [...prev, product]);
    }
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p._id !== productId));
  };

  const filteredProducts = availableProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const totalValue = selectedProducts.reduce(
    (sum, product) => sum + product.price,
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let imageUrl = boxData.image;

      // 1. If a new image was selected, upload it to Cloudinary
      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );
        imageUrl = res.data.secure_url;
      }

      // 2. Prepare themed box data for update
      const finalBoxData = {
        ...boxData,
        price: parseFloat(boxData.price as unknown as string),
        image: imageUrl,
        products: selectedProducts.map((p) => p._id),
      };

      // 3. Update the themed box via API
      const { data } = await axios.put(
        `/api/admin/themed-boxes/${boxId}`,
        finalBoxData
      );
      if (!data.success) {
        throw new Error(data.message || "Failed to update themed box");
      }

      setSuccess("Themed box updated successfully! Redirecting...");
      setTimeout(() => router.push("/admin/themed-boxes"), 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "An error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <AdminLayout title="Edit Themed Box">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-10 w-1/3" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-56" />
            </div>
            <div className="lg:col-span-2">
              <Skeleton className="h-[700px]" />
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Edit Themed Box">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/themed-boxes">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h2 className="text-lg font-semibold">Edit Themed Box</h2>
              <p className="text-sm text-gray-600">Updating: {boxData.name}</p>
            </div>
          </div>
          <Button
            type="submit"
            form="edit-themed-box-form"
            disabled={isLoading || !isFormValid}
          >
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
          id="edit-themed-box-form"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Box Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Box Name</Label>
                    <Input
                      id="name"
                      value={boxData.name || ""}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={boxData.description || ""}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Box Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={boxData.price || ""}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isActive">Box Status</Label>
                    <Switch
                      id="isActive"
                      checked={boxData.isActive}
                      onCheckedChange={(checked) =>
                        handleInputChange("isActive", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Box Image</CardTitle>
                </CardHeader>
                <CardContent>
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Themed box preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImage(null);
                          setImagePreview(null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <label
                        htmlFor="image"
                        className="cursor-pointer mt-2 block text-sm font-medium text-gray-900"
                      >
                        Upload an image
                      </label>
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[700px]">
                <Card className="flex flex-col">
                  <CardHeader>
                    <CardTitle>Available Products</CardTitle>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-auto">
                    {isFetching ? (
                      <Skeleton className="h-full w-full" />
                    ) : (
                      <div className="space-y-2">
                        {filteredProducts.map((product) => (
                          <div
                            key={product._id as string}
                            className="flex items-center justify-between p-2 border rounded-lg"
                          >
                            <div className="flex items-center space-x-2">
                              <img
                                src={product.images?.[0]}
                                alt={product.name}
                                className="w-10 h-10 rounded object-cover"
                              />
                              <div>
                                <div className="font-medium text-sm">
                                  {product.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {product.category}
                                </div>
                              </div>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => addProduct(product)}
                              disabled={selectedProducts.some(
                                (p) => p._id === product._id
                              )}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="flex flex-col">
                  <CardHeader>
                    <CardTitle>
                      Selected Products ({selectedProducts.length})
                    </CardTitle>
                    <div className="text-sm text-gray-600">
                      Total Value: <strong>${totalValue.toFixed(2)}</strong>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-auto">
                    {selectedProducts.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <p>No products selected.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {selectedProducts.map((product) => (
                          <div
                            key={product._id as string}
                            className="flex items-center justify-between p-2 border rounded-lg bg-blue-50"
                          >
                            <div className="flex items-center space-x-2">
                              <img
                                src={product.images?.[0]}
                                alt={product.name}
                                className="w-10 h-10 rounded object-cover"
                              />
                              <div>
                                <div className="font-medium text-sm">
                                  {product.name}
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {product.category}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                removeProduct(product._id as string)
                              }
                              className="text-red-600"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
