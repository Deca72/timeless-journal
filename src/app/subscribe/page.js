"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase"; // ✅ Make sure this path matches your project

export default function SubscribePage() {
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        setUserEmail(user.email);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubscribe = async () => {
    if (!userEmail) {
      alert("Please log in to subscribe.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }), // ✅ Send email
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // redirect to Stripe Checkout
      } else {
        alert("Failed to redirect to Stripe.");
      }
    } catch (err) {
      console.error("Stripe checkout error:", err);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-10">
      <img
        src="/cover-subscribe.jpg"
        alt="Timeless Journal"
        className="w-64 h-auto mb-6 rounded-lg shadow-lg"
      />
      <h2 className="text-xl italic text-center mb-2">Timeless Journal</h2>
      <p className="italic text-center text-gray-300 mb-4">
        Turn your memories into timeless stories.
      </p>
      <h1 className="text-3xl font-bold mb-2 text-center">Pro Journaler Plan</h1>
      <p className="text-lg text-center mb-4">$4.99/month</p>
      <p className="text-center text-gray-400 max-w-md mb-6">
        Unlock premium features designed for journal lovers and memory keepers:
      </p>
      <ul className="text-left text-green-400 space-y-2 mb-6">
        <li>✅ Unlimited projects</li>
        <li>✅ Up to 200 photo uploads per month</li>
        <li>✅ Priority AI captioning (faster & more accurate)</li>
        <li>✅ Multilingual captions (English, Italian, Spanish, etc.)</li>
        <li>✅ Cancel anytime</li>
      </ul>
      <button
        onClick={handleSubscribe}
        className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-md transition"
        disabled={loading}
      >
        {loading ? "Redirecting..." : "Subscribe with Stripe"}
      </button>
      <p className="text-gray-400 text-sm mt-4">Cancel anytime. No questions asked.</p>
    </div>
  );
}
