"use client";

import Link from "next/link";

export default function LegalHeader() {
  return (
    <div className="w-full bg-gray-900 text-white px-6 py-4 shadow-md">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <span className="text-lg font-semibold hover:underline">
            ← Back to Timeless Journal
          </span>
        </Link>
      </div>
    </div>
  );
}
