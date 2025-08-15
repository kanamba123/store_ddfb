"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

// Durées en millisecondes
const INACTIVITY_TIMEOUT = 2 * 60 * 1000; // 2 minutes
const WARNING_TIMEOUT = 45 * 1000;        // avertir 45 sec avant

interface Store {
  id: string;
  storeName: string;
  storeType: string;
  storeAddress: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  store: Store;
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => Promise<void>;
  logout: () => void;
  showWarning: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydratation initiale (Next.js côté client)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
      setHydrated(true);
    }
  }, []);

  // LOGIN
  const login = async (newToken: string, newUser: User) => {
    localStorage.setItem("authToken", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("login-event", Date.now().toString());

    setToken(newToken);
    setUser(newUser);
    setIsAuthenticated(true);
  };

  // LOGOUT
  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.setItem("logout-event", Date.now().toString());

    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setShowWarning(false);

    router.push("/login");
  }, [router]);

  // TIMER d'inactivité
  const startInactivityTimer = useCallback(() => {
    let inactivityTimer: ReturnType<typeof setTimeout>;
    let warningTimer: ReturnType<typeof setTimeout>;

    const resetTimers = () => {
      clearTimeout(warningTimer);
      clearTimeout(inactivityTimer);
      setShowWarning(false);

      // Avertissement avant logout
      warningTimer = setTimeout(
        () => setShowWarning(true),
        INACTIVITY_TIMEOUT - WARNING_TIMEOUT
      );

      // Déconnexion auto
      inactivityTimer = setTimeout(logout, INACTIVITY_TIMEOUT);
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    resetTimers();
    events.forEach((e) => window.addEventListener(e, resetTimers));

    return () => {
      clearTimeout(warningTimer);
      clearTimeout(inactivityTimer);
      events.forEach((e) => window.removeEventListener(e, resetTimers));
    };
  }, [logout]);

  // Démarrage du timer si connecté
  useEffect(() => {
    if (isAuthenticated) {
      return startInactivityTimer();
    }
  }, [isAuthenticated, startInactivityTimer]);

  // Vérification du token côté client
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) return;
      try {
        const res = await fetch("/api/verify-token", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
      } catch {
        logout();
      }
    };
    verifyToken();
  }, [token, logout]);

  // Synchronisation multi-onglets
  useEffect(() => {
    const onStorageChange = (e: StorageEvent) => {
      if (e.key === "logout-event") logout();
      if (e.key === "login-event") window.location.reload();
    };
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, [logout]);

  if (!hydrated) return null;

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, token, user, login, logout, showWarning }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
