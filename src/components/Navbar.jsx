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
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar({ onToggleSidebar }) {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { logout } = useAuth();

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

  if (!mounted) {
    return null;
  }

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-white/20 dark:border-gray-800 shadow-sm relative z-30">
      <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          {/* Left section */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1 lg:flex-none">
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors flex-shrink-0"
              onClick={onToggleSidebar}
              aria-label="Ouvrir la sidebar"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Brand - Only show on mobile when search is closed */}
            <div
              className={`lg:hidden flex items-center space-x-2 transition-all duration-200 ${
                isSearchOpen ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
              }`}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="text-lg font-bold text-gray-800 dark:text-white hidden sm:block">
                Win2Cop
              </span>
            </div>

            {/* Search bar */}
            <div
              className={`relative transition-all duration-200 ${
                isSearchOpen ? "flex-1" : "hidden md:flex"
              }`}
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full md:w-64 lg:w-80 pl-9 sm:pl-10 pr-10 sm:pr-4 py-2 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 dark:focus:ring-blue-500/30 dark:focus:border-blue-500/50 transition-all duration-200 text-sm sm:text-base dark:text-gray-200 dark:placeholder-gray-500"
              />
              {/* Close search button (mobile only) */}
              <button
                onClick={() => setIsSearchOpen(false)}
                className="md:hidden absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </button>
            </div>

            {/* Mobile search toggle */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`md:hidden p-2 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors ${
                isSearchOpen ? "hidden" : "block"
              }`}
            >
              <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
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
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => {
                  setIsNotificationOpen(!isNotificationOpen);
                  setIsProfileOpen(false);
                }}
                className="relative p-2 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></span>
              </button>

              {/* Notifications dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 z-50 max-h-96 overflow-hidden">
                  <div className="p-3 sm:p-4 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="p-2 sm:p-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 cursor-pointer border-b border-gray-50 dark:border-gray-800">
                      <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200">
                        Nouveau utilisateur inscrit
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Il y a 5 minutes
                      </p>
                    </div>
                    <div className="p-2 sm:p-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 cursor-pointer border-b border-gray-50 dark:border-gray-800">
                      <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200">
                        Mise à jour système
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Il y a 1 heure
                      </p>
                    </div>
                    <div className="p-2 sm:p-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 cursor-pointer">
                      <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200">
                        Nouveau message reçu
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Il y a 2 heures
                      </p>
                    </div>
                  </div>
                  <div className="p-2 sm:p-3 border-t border-gray-100 dark:border-gray-800">
                    <Link
                      href="/notifications"
                      className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
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
                className="flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-2 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-xs sm:text-sm">
                    JD
                  </span>
                </div>
                <div className="hidden lg:block text-left min-w-0">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                    NISHIMAGIZWE Ruben
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    Admin
                  </p>
                </div>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              </button>

              {/* Profile dropdown menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 z-50">
                  <div className="p-2">
                    <Link
                      href="/profile"
                      className="flex items-center space-x-2 p-2 sm:p-3 rounded-lg hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                        Profil
                      </span>
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center space-x-2 p-2 sm:p-3 rounded-lg hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                        Paramètres
                      </span>
                    </Link>
                    <hr className="my-2 border-gray-100 dark:border-gray-800" />
                    <button
                      onClick={logout}
                      className="w-full flex items-center space-x-2 p-2 sm:p-3 rounded-lg hover:bg-red-50/50 dark:hover:bg-red-900/50 transition-colors text-red-600 dark:text-red-400"
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
