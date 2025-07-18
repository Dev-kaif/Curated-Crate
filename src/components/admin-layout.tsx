"use client";

import type React from "react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Gift,
  TrendingUp,
  FileText,
  Megaphone,
  Menu,
  LogOut,
} from "lucide-react";
import LoadingPage from "./Layout/Landing";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Themed Boxes", href: "/admin/themed-boxes", icon: Gift },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Marketing", href: "/admin/marketing", icon: Megaphone },
  { name: "Analytics", href: "/admin/analytics", icon: TrendingUp },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated" || session?.user?.role !== "admin") {
      router.push("/admin/login");
    }
  }, [session, status, router]);

  const handleLogout = () => {
    signOut({ callbackUrl: "/admin/login" });
  };

  // While session is loading or if user is not an authenticated admin, show a loader or nothing
  if (status === "loading" || !session || session.user.role !== "admin") {
    return <LoadingPage />;
  }

  const Sidebar = ({ className = "" }: { className?: string }) => (
    <div className={`flex flex-col h-full bg-white border-r ${className}`}>
      <div className="p-6 border-b text-center">
        <h2 className="text-xl font-bold text-gray-900">
          <div className="flex gap-1 items-center">
            <img
              src="/logo.png"
              alt="Curated Crate Logo"
              className="h-8 w-auto"
            />
            <span> Curated Crate</span>
          </div>
        </h2>
        <span className="text-sm text-gray-500">Admin Panel</span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-gray-600 hover:text-gray-900"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Welcome, {session.user.name}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
