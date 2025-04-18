import { Geist, Geist_Mono } from "next/font/google";
import "../app/globals.css";
import { Analytics } from '@vercel/analytics/react';

// Load fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata for your app
export const metadata = {
  title: "Timeless Journal – AI-Powered Photo Diary",
  description: "Capture moments and turn them into timeless stories using AI-powered journaling.",
};

// App layout
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}>
        {children}
        <Analytics /> {/* ✅ Vercel Analytics */}
      </body>
    </html>
  );
}
