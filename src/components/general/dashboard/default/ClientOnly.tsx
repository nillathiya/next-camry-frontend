"use client";
import { useEffect, useState } from "react";

export default function ClientOnly({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    window.dispatchEvent(new Event("resize"));
  }, []);

  if (!isMounted) return null;

  return <>{children}</>;
}
