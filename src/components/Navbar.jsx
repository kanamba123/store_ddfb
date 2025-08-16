// components/Navbar.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  ChevronDown,
  X,
  Moon,
  Sun,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getInitials } from "../utils/getInitials";
import { useTheme } from "@/contexts/ThemeContext";

export default function Navbar({ onToggleSidebar }) {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useAuth();

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) return null;

  return (
    <nav className="bg-[var(--color-bg-primary)]/80 dark:bg-[var(--color-bg-dark)]/80 backdrop-blur-xl border-b border-[var(--color-border)] shadow-sm relative z-30">
      <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-1">
        <div className="flex justify-between items-center">
          {/* Left section */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1 lg:flex-none">
            {/* Sidebar toggle (mobile) */}
            <button
              className="lg:hidden p-2 rounded-xl 
              hover:bg-[var(--color-bg-secondary)]/50 
              dark:hover:bg-[var(--color-bg-alt)]/50 
              transition-colors flex-shrink-0"
              onClick={onToggleSidebar}
              aria-label="Ouvrir la sidebar"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-text-secondary)] dark:text-[var(--color-text-light)]" />
            </button>

            {/* Brand (mobile only) */}
            <div
              className={`lg:hidden flex items-center space-x-2 transition-all duration-200 ${
                isSearchOpen ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
              }`}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="text-lg font-bold text-[var(--color-text-primary)] dark:text-[var(--color-text-light)] hidden sm:block">
                {user?.store?.storeName}
              </span>
            </div>

            {/* Search bar */}
            <div
              className={`relative transition-all duration-200 ${
                isSearchOpen ? "flex-1" : "hidden md:flex"
              }`}
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary)]" />
              </div>
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full md:w-64 lg:w-80 pl-9 sm:pl-10 pr-10 sm:pr-4 py-2 
                  bg-[var(--color-bg-secondary)]/50 dark:bg-[var(--color-bg-alt)]/50
                  border border-[var(--color-border)] rounded-xl 
                  focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)]/30 
                  focus:border-[var(--color-primary-light)]/40 
                  transition-all duration-200 text-sm sm:text-base 
                  text-[var(--color-text-primary)] dark:text-[var(--color-text-light)] 
                  placeholder-[var(--color-text-secondary)] dark:placeholder-[var(--color-text-secondary)]"
              />
              {/* Close search (mobile) */}
              <button
                onClick={() => setIsSearchOpen(false)}
                className="md:hidden absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="w-4 h-4 text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary)]" />
              </button>
            </div>

            {/* Search toggle (mobile) */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`md:hidden p-2 rounded-xl hover:bg-[var(--color-bg-secondary)]/50 dark:hover:bg-[var(--color-bg-alt)]/50 transition-colors ${
                isSearchOpen ? "hidden" : "block"
              }`}
            >
              <Search className="w-5 h-5 text-[var(--color-text-secondary)] dark:text-[var(--color-text-light)]" />
            </button>
          </div>

          {/* Right section */}
          <div
            className={`flex items-center space-x-2 sm:space-x-3 ${
              isSearchOpen ? "hidden md:flex" : "flex"
            }`}
          >
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-[var(--color-bg-secondary)]/50 dark:hover:bg-[var(--color-bg-alt)]/50 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-[var(--color-text-secondary)] dark:text-[var(--color-text-light)]" />
              ) : (
                <Moon className="w-5 h-5 text-[var(--color-text-secondary)] dark:text-[var(--color-text-light)]" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => {
                  setIsNotificationOpen(!isNotificationOpen);
                  setIsProfileOpen(false);
                }}
                className="relative p-2 rounded-xl hover:bg-[var(--color-bg-secondary)]/50 dark:hover:bg-[var(--color-bg-alt)]/50 transition-colors"
              >
                <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--color-text-secondary)] dark:text-[var(--color-text-light)]" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[var(--color-danger)] rounded-full"></span>
              </button>

              {/* Notifications dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[var(--color-bg-primary)]/90 dark:bg-[var(--color-bg-dark)]/90 backdrop-blur-xl rounded-xl shadow-2xl border border-[var(--color-border)] z-50 max-h-96 overflow-hidden">
                  <div className="p-3 sm:p-4 border-b border-[var(--color-border)]">
                    <h3 className="font-semibold text-[var(--color-text-primary)] dark:text-[var(--color-text-light)] text-sm sm:text-base">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="p-2 sm:p-3 hover:bg-[var(--color-bg-secondary)]/50 dark:hover:bg-[var(--color-bg-alt)]/50 cursor-pointer border-b border-[var(--color-border)]/50">
                      <p className="text-xs sm:text-sm font-medium text-[var(--color-text-primary)] dark:text-[var(--color-text-light)]">
                        Nouveau utilisateur inscrit
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary)] mt-1">
                        Il y a 5 minutes
                      </p>
                    </div>
                    <div className="p-2 sm:p-3 hover:bg-[var(--color-bg-secondary)]/50 dark:hover:bg-[var(--color-bg-alt)]/50 cursor-pointer border-b border-[var(--color-border)]/50">
                      <p className="text-xs sm:text-sm font-medium text-[var(--color-text-primary)] dark:text-[var(--color-text-light)]">
                        Mise à jour système
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary)] mt-1">
                        Il y a 1 heure
                      </p>
                    </div>
                  </div>
                  <div className="p-2 sm:p-3 border-t border-[var(--color-border)]">
                    <Link
                      href="/notifications"
                      className="text-xs sm:text-sm text-[var(--color-primary-dark)] hover:text-[var(--color-primary-light)] font-medium"
                    >
                      Voir toutes les notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationOpen(false);
                }}
                className="flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-2 rounded-xl hover:bg-[var(--color-bg-secondary)]/50 dark:hover:bg-[var(--color-bg-alt)]/50 transition-colors"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-xs sm:text-sm">
                    {getInitials(user?.fullName) || "W"}
                  </span>
                </div>
                <div className="hidden lg:block text-left min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text-primary)] dark:text-[var(--color-text-light)] truncate">
                    {user?.fullName}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary)] truncate">
                    Admin
                  </p>
                </div>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary)] flex-shrink-0" />
              </button>

              {/* Profile dropdown menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-[var(--color-bg-primary)]/90 dark:bg-[var(--color-bg-dark)]/90 backdrop-blur-xl rounded-xl shadow-2xl border border-[var(--color-border)] z-50">
                  <div className="p-2">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center space-x-2 p-2 sm:p-3 rounded-lg hover:bg-[var(--color-bg-secondary)]/50 dark:hover:bg-[var(--color-bg-alt)]/50 transition-colors"
                    >
                      <User className="w-4 h-4 text-[var(--color-text-secondary)] dark:text-[var(--color-text-light)]" />
                      <span className="text-xs sm:text-sm text-[var(--color-text-primary)] dark:text-[var(--color-text-light)]">
                        Profil
                      </span>
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center space-x-2 p-2 sm:p-3 rounded-lg hover:bg-[var(--color-bg-secondary)]/50 dark:hover:bg-[var(--color-bg-alt)]/50 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-[var(--color-text-secondary)] dark:text-[var(--color-text-light)]" />
                      <span className="text-xs sm:text-sm text-[var(--color-text-primary)] dark:text-[var(--color-text-light)]">
                        Paramètres
                      </span>
                    </Link>
                    <hr className="my-2 border-[var(--color-border)]" />
                    <button
                      onClick={logout}
                      className="w-full flex items-center space-x-2 p-2 sm:p-3 rounded-lg hover:bg-[var(--color-danger)]/10 dark:hover:bg-red-900/30 transition-colors text-[var(--color-danger)]"
                    >
                      <LogOut className="w-4 h-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">Déconnexion</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
