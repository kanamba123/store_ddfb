"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  X,
  ChevronRight,
  Home,
  BarChart3,
  FileText,
  ShoppingCart,
} from "lucide-react";
import { FaUsers } from "react-icons/fa";

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
    label: "Utilisateurs",
    href: "/dashboard/users",
    icon: Users,
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
          fixed top-0 left-0 h-screen w-72 sm:w-80 z-50 transform transition-all duration-300 ease-out
          lg:relative lg:h-screen lg:w-full lg:transform-none lg:transition-none
          bg-white/85 dark:bg-gray-900/85 backdrop-blur-xl shadow-2xl border-r border-white/30 dark:border-gray-800/30
          flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100/50 dark:border-gray-800/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Home className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent truncate">
                  Win2Cop
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Dashboard Pro
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Navigation - flex-1 makes this take all available space */}
        <nav className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1 sm:space-y-2">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`group relative flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 shadow-md"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 sm:h-8 bg-gradient-to-b from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 rounded-r-full" />
                )}

                {/* Icon with gradient background */}
                <div
                  className={`relative p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
                    isActive
                      ? `bg-gradient-to-r ${link.darkColor || link.color}`
                      : "bg-gray-100/50 dark:bg-gray-800/50 group-hover:bg-gray-200/50 dark:group-hover:bg-gray-700/50"
                  } transition-all duration-200`}
                >
                  <Icon
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      isActive
                        ? "text-white"
                        : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
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
                      ? "text-blue-500 dark:text-blue-400 translate-x-1"
                      : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-1"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Bottom section - fixed at bottom */}
        <div className="p-3 sm:p-4 flex-shrink-0 border-t border-gray-100/50 dark:border-gray-800/50">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-xl p-3 sm:p-4 border border-blue-200/20 dark:border-blue-800/30">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-xs sm:text-sm">
                  JD
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                  Nishimagizwe Ruben
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  nishimagizwe@win2cop.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
