"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      setError("❌ Login failed. Check your credentials.");
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Please enter your email to reset your password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("📩 Password reset email sent! Check your inbox.");
      setError("");
    } catch (err) {
      setError("❌ Failed to send password reset email.");
      setMessage("");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-600 w-64 mb-2"
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-600 w-64 mb-4"
        />
        <br />
        <button type="submit" className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
          Login
        </button>
      </form>

      {/* 🔐 Forgot Password Link */}
      <p className="mt-4 text-sm text-blue-500 cursor-pointer hover:underline" onClick={handlePasswordReset}>
        Forgot password?
      </p>

      <div className="mt-6 text-sm text-gray-400 text-center">
        By continuing, you agree to our{" "}
        <a href="/legal/terms" className="text-blue-400 hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/legal/privacy" className="text-blue-400 hover:underline">
          Privacy Policy
        </a>.
      </div>
    </div>
  );
}
