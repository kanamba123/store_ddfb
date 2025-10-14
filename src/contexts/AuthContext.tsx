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
import { API_URL } from "@/config/API";

interface MenuItem {
  id: number;
  key: string;
  label: string;
  route: string;
  icon: string;
  order: string;
  parent_id: number | null;
  is_active: boolean;
  is_deleted: boolean;
  children: MenuItem[];
}

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
  menuItems: MenuItem[];
  loadingMenu: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  // Add new states for menu
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(false);


  // Add fetchMenuItems function
  const fetchMenuItems = useCallback(async (userId: string, userToken: string) => {
    try {
      setLoadingMenu(true);
      const response = await fetch(`${API_URL}/user-menus/sidebar/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          // cache: 'force-cache'
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setLoadingMenu(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        setIsAuthenticated(true);
        // Fetch menu items when restoring session
        fetchMenuItems(parsedUser.id, storedToken);
      }
      setHydrated(true);
    }
  }, [fetchMenuItems]);

  const login = async (newToken: string, newUser: User) => {
    setIsLoggingIn(true);
    localStorage.setItem("authToken", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setIsAuthenticated(true);
    // Fetch menu items after login
    await fetchMenuItems(newUser.id, newToken);
    setIsLoggingIn(false);
  };

  const logout = useCallback(() => {
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setShowWarning(false);
    setMenuItems([]); // Clear menu items on logout
    router.push("/login");
  }, [router]);

  if (!hydrated) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        user,
        login,
        logout,
        showWarning,
        menuItems,
        loadingMenu,
      }}
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