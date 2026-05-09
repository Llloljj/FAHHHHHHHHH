import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const leagueSpartan = League_Spartan({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] });

export const metadata: Metadata = {
  title: "Voyage | Super Travel",
  description: "A luxury-focused, collaborative group travel app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${leagueSpartan.className} min-h-screen flex flex-col antialiased bg-background text-foreground`}>
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
