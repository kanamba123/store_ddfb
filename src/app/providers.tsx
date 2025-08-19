"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { RedirectProvider } from "@/contexts/RedirectProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
      <ThemeProvider>
      <AuthProvider>
            <RedirectProvider>
                {children}
            </RedirectProvider>
      </AuthProvider>
      
      </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
