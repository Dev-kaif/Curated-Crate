"use client";

import type React from "react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Eye, EyeOff, AlertCircle, Edit, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AccountLayout } from "@/components/account-layout";
import { IUser } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [initialProfileData, setInitialProfileData] = useState<Partial<IUser>>(
    {}
  );
  const [profileData, setProfileData] = useState<Partial<IUser>>({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session) return;
      setIsLoading(true);
      try {
        const { data } = await axios.get("/api/users/me");
        if (data.success) {
          const fetchedData = data.data;
          setProfileData(fetchedData);
          setInitialProfileData(fetchedData); // Store initial data for cancellation
        }
      } catch (error) {
        setProfileError("Failed to load your profile data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [session]);

  // Validate form whenever profileData changes while in edit mode
  useEffect(() => {
    if (isEditMode) {
      const { firstName, lastName, phone } = profileData;
      const isValid =
        firstName?.trim() !== "" &&
        lastName?.trim() !== "" &&
        phone?.trim() !== "" &&
        phone?.trim().length === 13; // +91 and 10 digits
      setIsFormValid(isValid);
    } else {
      setIsFormValid(false);
    }
  }, [profileData, isEditMode]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (id === "phone") {
      const digits = value.replace(/\D/g, "");
      let formatted = "+91";
      if (digits.length > 2) {
        formatted += digits.substring(2, 12); // Limit to 10 digits after +91
      }
      setProfileData((prev) => ({ ...prev, [id]: formatted }));
    } else {
      setProfileData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [id]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsUpdatingProfile(true);
    setProfileError(null);
    setProfileSuccess(null);
    try {
      const { email, ...submissionData } = profileData;
      const { data } = await axios.put("/api/users/me", submissionData);
      if (data.success) {
        setProfileSuccess("Profile updated successfully!");
        setInitialProfileData(data.data); // Update initial state to new saved state
        setIsEditMode(false); // Exit edit mode
        await update({ name: data.data.name });
      } else {
        throw new Error(data.message || "Failed to update profile.");
      }
    } catch (err: any) {
      setProfileError(err.response?.data?.message || err.message);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    setProfileData(initialProfileData); // Revert changes
    setIsEditMode(false);
    setProfileError(null);
    setProfileSuccess(null);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    setIsUpdatingPassword(true);
    setPasswordError(null);
    setPasswordSuccess(null);
    try {
      const { data } = await axios.put("/api/users/me", {
        password: passwordData.newPassword,
      });
      if (data.success) {
        setPasswordSuccess("Password changed successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        throw new Error(data.message || "Failed to change password.");
      }
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || err.message);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <AccountLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            My Profile
          </h1>
          <p className="text-foreground/70">
            Manage your account information and preferences
          </p>
        </motion.div>

        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="bg-background border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-serif font-bold text-foreground">
                  Personal Information
                </h2>
                {!isEditMode && (
                  <Button variant="outline" onClick={() => setIsEditMode(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>

              {isLoading ? (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Skeleton className="h-10 w-full rounded-full" />
                    <Skeleton className="h-10 w-full rounded-full" />
                  </div>
                  <Skeleton className="h-10 w-full rounded-full" />
                  <Skeleton className="h-10 w-full rounded-full" />
                </div>
              ) : (
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {profileError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{profileError}</AlertDescription>
                    </Alert>
                  )}
                  {profileSuccess && (
                    <Alert
                      variant="default"
                      className="border-green-500 text-green-700"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Success</AlertTitle>
                      <AlertDescription>{profileSuccess}</AlertDescription>
                    </Alert>
                  )}
                  <fieldset disabled={!isEditMode}>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profileData.firstName || ""}
                          onChange={handleProfileChange}
                          className="rounded-full border-foreground/20 focus:border-primary disabled:opacity-75"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profileData.lastName || ""}
                          onChange={handleProfileChange}
                          className="rounded-full border-foreground/20 focus:border-primary disabled:opacity-75"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 mt-6">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email || ""}
                        className="rounded-full border-foreground/20 focus:border-primary"
                        disabled
                      />
                    </div>
                    <div className="space-y-2 mt-6">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Input
                          id="phone"
                          value={profileData.phone || "+91"}
                          onChange={handleProfileChange}
                          className="rounded-full border-foreground/20 focus:border-primary disabled:opacity-75"
                        />
                      </div>
                    </div>
                  </fieldset>
                  {isEditMode && (
                    <div className="flex space-x-4 pt-4">
                      <Button
                        type="submit"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full"
                        disabled={isUpdatingProfile || !isFormValid}
                      >
                        {isUpdatingProfile ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleCancelEdit}
                        className="px-8 py-3 rounded-full"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Change Password */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-background border-0 shadow-lg">
            <CardContent className="p-6">
              <h2 className="text-xl font-serif font-bold text-foreground mb-6">
                Change Password
              </h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                {passwordError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{passwordError}</AlertDescription>
                  </Alert>
                )}
                {passwordSuccess && (
                  <Alert
                    variant="default"
                    className="border-green-500 text-green-700"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{passwordSuccess}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="rounded-full border-foreground/20 focus:border-primary pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="rounded-full border-foreground/20 focus:border-primary pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="rounded-full border-foreground/20 focus:border-primary"
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full"
                  disabled={isUpdatingPassword}
                >
                  {isUpdatingPassword ? "Changing..." : "Change Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AccountLayout>
  );
}
