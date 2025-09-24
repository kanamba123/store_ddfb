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
  CreditCard,
  Megaphone,
  Users,
} from "lucide-react";
import { FaUsers } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { getInitials } from "../utils/getInitials";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useTranslation();

  // ✅ en JSX pas besoin de <string | null>
  const [openMenu, setOpenMenu] = useState(null);

  // ✅ enlever ": string"
  const toggleMenu = (key) => {
    setOpenMenu(openMenu === key ? null : key);
  };

  const sidebarLinks = [
    {
      label: t("sidebar.dashboard"),
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: t("sidebar.products"),
      icon: ShoppingCart,
      children: [
        { label: t("sidebar.productsList"), href: "/dashboard/products" },
        { label: t("sidebar.productsCategories"), href: "/dashboard/products/categories" },
        { label: t("sidebar.productsInventory"), href: "/dashboard/products/inventory" },
        { label: t("sidebar.productsVariants"), href: "/dashboard/products/variants" },
        { label: t("sidebar.productsReviews"), href: "/dashboard/products/reviews" },
        { label: t("sidebar.productsAttributes"), href: "/dashboard/products/attributes" }
      ],
    }
    ,
    {
      label: t("sidebar.sales"),
      icon: FaUsers,
      children: [
        { label: "Commandes", href: "/dashboard/sales" },
        { label: "Clients", href: "/dashboard/sales/customers" },
      ],
    },
    {
      label: t("sidebar.analytics"),
      href: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      label: t("sidebar.hr"),
      icon: Users,
      children: [
        { label: t("sidebar.hrEmployees"), href: "/dashboard/hr/employees" },
        { label: t("sidebar.hrLeave"), href: "/dashboard/hr/leave" },
        { label: t("sidebar.hrRecruitment"), href: "/dashboard/hr/recruitment" },
        { label: t("sidebar.hrPayroll"), href: "/dashboard/hr/payroll" },
        { label: t("sidebar.hrAttendance"), href: "/dashboard/hr/attendance" },
        { label: t("sidebar.hrTraining"), href: "/dashboard/hr/training" },
        { label: t("sidebar.hrEvaluations"), href: "/dashboard/hr/evaluations" },
        { label: t("sidebar.hrContracts"), href: "/dashboard/hr/contracts" },
      ],
    }
    ,
    {
      label: t("sidebar.orders"),
      href: "/dashboard/orders",
      icon: ShoppingCart,
    },
    {
      label: t("sidebar.payments"),
      href: "/dashboard/payments",
      icon: CreditCard,
    },
    {
      label: t("sidebar.promotions"),
      href: "/dashboard/promotions",
      icon: Megaphone,
    },
    {
      label: t("sidebar.reports"),
      href: "/dashboard/reports",
      icon: FileText,
    },
    {
      label: t("sidebar.settings"),
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300 lg:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
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
                  {t('sidebar.dashboardPro', 'Dashboard Pro')}
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
        <nav className="flex-1 p-2 sm:p-2 space-y-1 sm:space-y-2 overflow-y-auto max-h-full">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            // ✅ gestion des sous-items
            if (link.children) {
              const isOpenMenu = openMenu === link.label;
              return (
                <div key={link.label}>
                  <button
                    onClick={() => toggleMenu(link.label)}
                    className="w-full flex items-center text-left space-x-3 px-3 sm:px-4 py-2 rounded-xl transition-all duration-200 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium flex-1 text-sm sm:text-base truncate">
                      {link.label}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 transform transition-transform ${isOpenMenu ? "rotate-90" : ""
                        }`}
                    />
                  </button>
                  {isOpenMenu && (
                    <div className="ml-8 mt-1 space-y-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className={`block px-3 py-1.5 rounded-lg text-sm ${pathname === child.href
                            ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium"
                            : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
                            }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`group relative flex items-center space-x-3 px-3 sm:px-4 py-2 rounded-xl transition-all duration-200 ${isActive
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-[var(--color-primary)] shadow-md"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]"
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium flex-1 text-sm sm:text-base truncate">
                  {link.label}
                </span>
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
