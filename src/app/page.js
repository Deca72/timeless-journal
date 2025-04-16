"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push("/landing");  // Automatically redirect to the landing page
  }, [router]);

  return null;
}
