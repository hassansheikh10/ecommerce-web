"use client";

import { useEffect, useState } from "react";
import Loader from "./Loader";
import { usePathname } from "next/navigation";

export default function AppWithLoader({ children }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); // Route change start
    const timer = setTimeout(() => setLoading(false), 400); // Hide after short delay
    return () => clearTimeout(timer);
  }, [pathname]);

  return loading ? <Loader text="Please wait..." /> : children;
}
