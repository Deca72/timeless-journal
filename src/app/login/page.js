"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/dashboard"); // Redirect to dashboard after login
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
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
                <button type="submit">Login</button>
            </form><div className="mt-6 text-sm text-gray-400 text-center">
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

