"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { RedirectProvider } from "@/contexts/RedirectProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import AuthExpiredPanel from "@/components/AuthExpiredPanel";


export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [isAuthExpired, setIsAuthExpired] = useState(false);

  useEffect(() => {
    const handleAuthExpired = () => setIsAuthExpired(true);
    window.addEventListener("auth:expired", handleAuthExpired);
    return () => window.removeEventListener("auth:expired", handleAuthExpired);
  }, []);


  const handleClosePanel = () => setIsAuthExpired(false);
  const handleLoginRedirect = () => {
    setIsAuthExpired(false);
    window.location.href = "/login"; // redirige vers login
  };

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
        <AuthExpiredPanel
          isOpen={isAuthExpired}
          onClose={handleClosePanel}
          onLoginRedirect={handleLoginRedirect}
        />
      </LanguageProvider>
    </QueryClientProvider>
  );
}
