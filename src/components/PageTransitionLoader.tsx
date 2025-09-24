// app/components/PageTransitionLoader.tsx
"use client";

import { useEffect, useState } from "react";
import NProgress from "nprogress";
import { usePathname, useSearchParams } from "next/navigation";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false });

export default function PageTransitionLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
      NProgress.start();
    };
    const handleStop = () => {
      setIsLoading(false);
      NProgress.done();
    };

    // Listen to route changes
    handleStart(); // Initial load
    handleStop(); // Initial load complete

    // Listen to route changes after initial load
    const timeout = setTimeout(handleStop, 100); // Small delay to ensure smooth transition

    return () => clearTimeout(timeout);
  }, [pathname, searchParams]);

  return null;
}
