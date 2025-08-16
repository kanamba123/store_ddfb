"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  X,
  ChevronRight,
  Home,
  BarChart3,
  FileText,
  ShoppingCart,
} from "lucide-react";
import { FaUsers } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { getInitials } from "../utils/getInitials";

const sidebarLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    color: "from-blue-500 to-cyan-500",
    darkColor: "from-blue-600 to-cyan-600",
  },
  {
    label: "Produits",
    href: "/dashboard/products",
    icon: ShoppingCart,
    color: "from-orange-400 to-yellow-400",
    darkColor: "from-orange-500 to-yellow-500",
  },
  {
    label: "Sales",
    href: "/dashboard/sales",
    icon: FaUsers,
    color: "from-purple-500 to-pink-500",
    darkColor: "from-purple-600 to-pink-600",
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    color: "from-green-500 to-emerald-500",
    darkColor: "from-green-600 to-emerald-600",
  },
  {
    label: "Commandes",
    href: "/dashboard/orders",
    icon: ShoppingCart,
    color: "from-yellow-500 to-orange-500",
    darkColor: "from-yellow-600 to-orange-600",
  },
  {
    label: "Rapports",
    href: "/dashboard/reports",
    icon: FileText,
    color: "from-indigo-500 to-purple-500",
    darkColor: "from-indigo-600 to-purple-600",
  },
  {
    label: "Paramètres",
    href: "/dashboard/settings",
    icon: Settings,
    color: "from-red-500 to-pink-500",
    darkColor: "from-red-600 to-pink-600",
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 sm:w-80 z-50 transform transition-all duration-300 ease-out
          lg:relative lg:h-full lg:w-full lg:transform-none lg:transition-none
          bg-[var(--color-bg-primary)]/95 backdrop-blur-xl shadow-2xl border-r border-[var(--color-border)]/30
          flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="p-2 sm:py-2 sm:px-4 border-b border-[var(--color-border)]/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Home className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] truncate">
                  {user?.store?.storeName}
                </h2>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Dashboard Pro
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-text-secondary)]" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 sm:p-2 space-y-1 sm:space-y-2">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`group relative flex items-center space-x-3 px-3 sm:px-4 py-1 sm:py-0 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-[var(--color-primary)] shadow-md"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 sm:h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full" />
                )}

                {/* Icon with gradient background */}
                <div
                  className={`relative p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
                    isActive
                      ? `bg-gradient-to-r ${link.darkColor || link.color}`
                      : "bg-[var(--color-bg-secondary)] group-hover:bg-[var(--color-bg-alt)]"
                  } transition-all duration-200`}
                >
                  <Icon
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      isActive
                        ? "text-white"
                        : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]"
                    }`}
                  />
                </div>

                <span className="font-medium flex-1 text-sm sm:text-base truncate">
                  {link.label}
                </span>

                {/* Arrow indicator */}
                <ChevronRight
                  className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-200 flex-shrink-0 ${
                    isActive
                      ? "text-[var(--color-primary)] translate-x-1"
                      : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] group-hover:translate-x-1"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-2 sm:p-2 flex-shrink-0 border-t border-[var(--color-border)]/50">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-1 sm:p-1 border border-[var(--color-border)]/30">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-xs sm:text-sm">
                  {getInitials(user?.fullName) || "W"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-[var(--color-text-primary)] truncate">
                  {user?.fullName}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)] truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
