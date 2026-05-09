import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { GuestSession } from "@/components/guest-session";

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-league-spartan",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Banjara | Peer-to-Peer Luxury Travel",
  description:
    "Experience peer-to-peer luxury travel. AI-curated group itineraries, verified local experts, and seamless collaboration — all in one platform.",
  keywords: ["luxury travel", "group travel", "AI itinerary", "peer-to-peer", "vacation planning"],
  openGraph: {
    title: "Banjara | Peer-to-Peer Luxury Travel",
    description: "AI-curated luxury group travel experiences.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={leagueSpartan.variable}>
      <body
        className={`${leagueSpartan.className} min-h-screen flex flex-col antialiased bg-[#fdf8f3] text-[#262626]`}
      >
        <GuestSession />
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
