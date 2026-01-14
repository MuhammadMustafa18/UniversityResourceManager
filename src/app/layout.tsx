import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Campus Resource Manager",
  description: "Efficiently manage campus labs, halls, and equipment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50`}
      >
        <div className="max-w-6xl mx-auto px-6 py-12">
          <header className="mb-12">
            <h1 className="text-2xl font-bold tracking-tight mb-6">Campus Resource Manager</h1>
            <Navigation />
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
