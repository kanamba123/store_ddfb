"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { RedirectProvider } from "@/contexts/RedirectProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import AuthExpiredPanel from "@/components/AuthExpiredPanel";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [isAuthExpired, setIsAuthExpired] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleAuthExpired = () => setIsAuthExpired(true);
    window.addEventListener("auth:expired", handleAuthExpired);
    return () => window.removeEventListener("auth:expired", handleAuthExpired);
  }, []);


  const handleClosePanel = () => setIsAuthExpired(false);
  const handleLoginRedirect = () => {
    setIsAuthExpired(false);
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    router.push("/login");
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
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          draggable
          pauseOnHover
          theme="colored"
        />
      </LanguageProvider>
    </QueryClientProvider>
  );
}
