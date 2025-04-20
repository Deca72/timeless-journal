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
      <head>
        {/* ✅ Load Google Fonts for dropdown options */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Amatic+SC&family=Archivo&family=Crimson+Text&family=Fjalla+One&family=Inconsolata&family=Lobster&family=Merriweather&family=Noto+Sans&family=Noto+Serif&family=Playfair+Display&family=Poppins&family=Raleway&family=Roboto&family=Rubik&family=Source+Serif+Pro&family=Space+Mono&family=Zeyada&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}>
        {children}
        <Analytics /> {/* ✅ Vercel Analytics */}
      </body>
    </html>
  );
}
