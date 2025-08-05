"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { RedirectProvider } from "@/contexts/RedirectProvider";
import { AuthProvider } from "@/contexts/AuthContext";


export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
            <RedirectProvider>
                {children}
            </RedirectProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
