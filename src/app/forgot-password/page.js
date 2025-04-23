"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("✅ Password reset email sent! Check your inbox.");
    } catch (err) {
      setError("❌ " + err.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "60px" }}>
      <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>

      {message && <p className="text-green-600 mb-3">{message}</p>}
      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form onSubmit={handleReset} className="space-y-4 max-w-md mx-auto">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded text-black placeholder-gray-500"
/>
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-black rounded"
        >
          Send Reset Email
        </button>
      </form>

      <button
        onClick={() => router.push("/")}
        className="mt-4 text-sm text-blue-600 hover:underline"
      >
        ⬅️ Back to Home
      </button>
    </div>
  );
}
