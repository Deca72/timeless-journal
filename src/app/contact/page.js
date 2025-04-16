"use client";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white text-black p-8">
      {/* ⬅️ Back to Landing Page Link */}
      <div className="w-full max-w-5xl mb-6">
        <Link
          href="/"
          className="text-xl font-semibold text-blue-600 hover:underline"
        >
          ← Timeless Journal
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-4">📬 Contact</h1>
      <p className="text-lg mb-6 max-w-xl text-center">
        Got questions, feedback, or suggestions? We'd love to hear from you!
        Just fill out the form below, and we’ll get back to you as soon as possible.
      </p>

      <form
        action="https://formspree.io/f/your-form-id" // Replace with your actual Formspree form ID
        method="POST"
        className="w-full max-w-md space-y-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
          className="w-full p-3 border border-gray-300 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          required
          className="w-full p-3 border border-gray-300 rounded"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          rows={5}
          required
          className="w-full p-3 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full py-3 bg-black text-white rounded hover:bg-gray-800 transition"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
