"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  // Optional: auto-redirect after 6 seconds
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     router.push("/dashboard");
  //   }, 6000);
  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4">🎉 You're Subscribed!</h1>
        <p className="text-lg text-gray-300 mb-6">
          Welcome to the <strong>Pro Journaler Plan</strong>. You now have access to all premium features.
        </p>

        <ul className="list-disc list-inside text-left mb-8 space-y-2 text-gray-200">
          <li>📁 <strong>Unlimited projects</strong></li>
          <li>📸 <strong>Up to 200 photo uploads per month</strong></li>
          <li>⚡ <strong>Priority AI captioning</strong> (faster & more accurate)</li>
          <li>📆 <strong>Export to calendar, postcards, and photo books</strong></li>
          <li>🌍 <strong>Multilingual caption translations</strong></li>
          <li>🔓 <strong>Cancel anytime</strong> directly from your profile</li>
        </ul>

        <div className="space-y-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-green-500 hover:bg-green-600 py-3 px-4 rounded-lg font-semibold transition"
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => router.push("/landing")}
            className="w-full bg-gray-700 hover:bg-gray-600 py-3 px-4 rounded-lg font-medium text-gray-200 transition"
          >
            Back to Landing Page
          </button>
        </div>
      </div>
    </div>
  );
}
