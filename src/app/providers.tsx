"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { RedirectProvider } from "@/contexts/RedirectProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "next-themes";


export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
            <RedirectProvider>
                {children}
            </RedirectProvider>
      </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
