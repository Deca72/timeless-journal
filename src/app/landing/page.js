"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "src/app/lib/firebase";
import Navbar from "src/app/components/Navbar";



export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      setError("Login failed. Check your credentials.");
    }
  };

  return (
    
    
    <div className="bg-white text-black min-h-screen overflow-y-auto w-full max-w-[100vw] overflow-x-hidden">
      {user && <Navbar />}

      {/* Hero Section */}
      <div className="relative h-[50vh] w-full">
        <img
          src="/unseen-studio-s9CC2SKySJM-unsplash.jpg" // Replace with your HD hero image path
          alt="Hero"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center px-4">
  <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg mb-4">
    Write Your Story, Timelessly
  </h1>
  <p className="text-lg md:text-xl text-white max-w-3xl">
    Capture moments. Reflect with style. Let AI help you write beautiful, personalized captions based on your photos, date, and location.
  </p>
</div>

      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center p-8 bg-white text-black">

        

        {/* Feature Highlights Section */}
<div className="border border-black rounded-lg p-8 max-w-6xl w-full text-center bg-white shadow-md mb-10">
  <h2 className="text-3xl font-bold mb-6">Key Features</h2>
  <div className="grid md:grid-cols-3 gap-6">
    <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
      <div className="text-3xl mb-1">🧠</div>
      <h3 className="text-xl font-semibold mb-1">Smart Captions</h3>
      <p>AI analyzes your photo, date & location to write journal-style entries.</p>
    </div>
    <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
      <div className="text-3xl mb-1">🖋️</div>
      <h3 className="text-xl font-semibold mb-1">Choose Your Style</h3>
      <p>Customize tone, genre, and writing style from Shakespeare to Murakami.</p>
    </div>
    <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
      <div className="text-3xl mb-1">📚</div>
      <h3 className="text-xl font-semibold mb-1">Historical Context</h3>
      <p>Get journal entries enriched with events from that day in history.</p>
    </div>
  </div>
</div>



        {/* How It Works Section */}
<div className="border border-black rounded-lg p-8 max-w-6xl w-full text-center bg-white shadow-md">
  <h2 className="text-3xl font-bold mb-6"> How It Works</h2>
  <div className="grid md:grid-cols-5 gap-4">
    
    <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
      <div className="text-3xl mb-1">📸</div>
      <h3 className="text-lg font-semibold mb-1">1. Select a Photo</h3>
      <p>Upload a photo from your device to begin your journal entry.</p>
    </div>

    <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
      <div className="text-3xl mb-1">⚙️</div>
      <h3 className="text-lg font-semibold mb-1">2. Choose Settings</h3>
      <p>Pick your writing style, word count, and tone for personalized results.</p>
    </div>

    <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
      <div className="text-3xl mb-1">📍</div>
      <h3 className="text-lg font-semibold mb-1">3. Add Date & Location</h3>
      <p>Set the scene so AI can add historical or cultural context.</p>
    </div>

    <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
      <div className="text-3xl mb-1">✨</div>
      <h3 className="text-lg font-semibold mb-1">4. Upload Photo</h3>
      <p>Watch the magic! Your image gets a unique journal-style caption.</p>
    </div>

    <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
      <div className="text-3xl mb-1">💾</div>
      <h3 className="text-lg font-semibold mb-1">5. Download or Share</h3>
      <p>Save your entry, and share it.</p>
    </div>
    
  </div>
</div>


        <section className="py-16 bg-white" id="pricing">
  <div className="max-w-6xl mx-auto border border-black rounded-lg shadow-md p-10 bg-white">
    <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">Choose Your Plan</h2>

    <div className="flex flex-col md:flex-row justify-center gap-8">

      {/* Free Plan */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-sm w-full md:w-1/2">
        <h3 className="text-xl font-bold mb-2 text-gray-800">Free Plan</h3>
        <p className="text-gray-600 mb-4">Perfect for testing things out.</p>
        <ul className="text-sm text-gray-700 space-y-2">
          <li>📸 <strong>5 photo uploads</strong> per month</li>
          <li>✅ All core features included</li>
          <li>🔒 No credit card required</li>
        </ul>
      </div>

      {/* Pro Plan */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-sm w-full md:w-1/2">
        <h3 className="text-xl font-bold mb-2 text-blue-700">Pro – $4.99/month</h3>
        <p className="text-blue-700 mb-4">For active journalers and creative explorers.</p>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>📸 <strong>200 photo uploads</strong> per month</li>
          <li>✅ All core features included</li>
          <li>🔓 Cancel anytime</li>
        </ul>
      </div>

    </div>
  </div>
</section>





        {/* Login or Sign Up */}
        {showLogin ? (
  <form
    onSubmit={handleLogin}
    className="mt-10 bg-gray-100 text-black p-5 rounded-lg shadow-lg w-full max-w-md text-left"
  >
    <h2 className="text-xl font-bold mb-3">Login</h2>
    {error && <p className="text-red-500 mb-2">{error}</p>}

    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full p-2 mb-3 rounded border border-gray-300 bg-white"
      required
    />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full p-2 mb-1 rounded border border-gray-300 bg-white"
      required
    />

    {/* 🔗 Forgot Password Link */}
    <div className="text-right mb-3">
      <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
        Forgot password?
      </a>
    </div>

    <button
      type="submit"
      className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded font-semibold"
    >
      Log In
    </button>

    <button
      type="button"
      onClick={() => setShowLogin(false)}
      className="w-full mt-3 text-sm text-blue-600 hover:underline"
    >
      Cancel
    </button>
  </form>
) : (
  <div className="mt-10 flex gap-4">
    <a
      href="/subscribe"
      className="px-6 py-2 bg-white text-black border border-black rounded text-base font-semibold hover:bg-gray-100 transition"
    >
      Subscribe
    </a>
    <button
      onClick={() => setShowLogin(true)}
      className="px-6 py-2 bg-white text-black border border-black rounded text-base font-semibold hover:bg-gray-100 transition"
    >
      Login
    </button>
    <a
      href="/signup"
      className="px-6 py-2 bg-white text-black border border-black rounded text-base font-semibold hover:bg-gray-100 transition"
    >
      Sign Up
    </a>
  </div>
)}


        {/* Footer */}
        <div className="mt-6 text-sm text-gray-500 text-center">
  <a href="/legal/terms" className="hover:underline">Terms of Service</a>
  <span className="mx-2">•</span>
  <a href="/legal/privacy" className="hover:underline">Privacy Policy</a>
  <span className="mx-2">•</span>
  <a href="/about" className="hover:underline">About Me</a>
  <span className="mx-2">•</span>
  <a href="/contact" className="hover:underline">Contact</a>
</div>

      </div>
    </div>
  );
}
