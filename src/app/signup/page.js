"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Add Firestore user doc with matching email format for Stripe lookup
      await setDoc(doc(db, "users", user.uid), {
        email: user.email?.toLowerCase().trim(), // makes sure webhook can match this
        name: "",
        isSubscribed: false,
        stripeCustomerId: null,
        subscriptionId: null,
        subscriptionStatus: "none",
        createdAt: serverTimestamp(),
      });

      router.push("/landing");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Sign Up</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSignup}>
      <input
  type="email"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
  className="bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-700 w-64 mb-3"
/>
<br />
<input
  type="password"
  placeholder="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
  className="bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-700 w-64 mb-4"
/>

        <br />
        <button type="submit">Sign Up</button>
      </form>

      {/* Legal Disclaimer */}
      <div style={{ marginTop: "20px", fontSize: "14px", color: "#aaa" }}>
        By signing up, you agree to our{" "}
        <a href="/legal/terms" style={{ color: "#7db4ff", textDecoration: "underline" }}>
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/legal/privacy" style={{ color: "#7db4ff", textDecoration: "underline" }}>
          Privacy Policy
        </a>.
      </div>
    </div>
  );
}
