import type React from "react";
import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/contexts/store-context";
import Session from "@/components/Layout/Session";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Curated Crate - The Perfect Gift, Perfectly Personal",
  description: "Build unique gift boxes with curated artisanal goods",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/logo.png" type="image/x-icon" />
      </head>
      <body className={`${playfair.variable} ${inter.variable} font-sans`}>
        <Session>
          <StoreProvider>{children}</StoreProvider>
        </Session>
      </body>
    </html>
  );
}
