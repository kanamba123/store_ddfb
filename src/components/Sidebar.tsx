"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  AppWindow,
  Key,
  Settings,
  X,
  ChevronDown,
  Home,
  BarChart3,
  FileText,
  ShoppingCart,
  CreditCard,
  Megaphone,
  Users,
  Component,
} from "lucide-react";
import { FaUsers } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { getInitials } from "../utils/getInitials";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useCallback, useMemo, memo } from "react";
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

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Icon mapping with better performance
const iconMap = {
  LayoutDashboard,
  AppWindow,
  Key,
  Settings,
  BarChart3,
  FileText,
  ShoppingCart,
  CreditCard,
  Megaphone,
  Users,
  Component,
  FaUsers,
};

const getIcon = (iconName: string | null, className = "w-5 h-5 flex-shrink-0") => {
  if (!iconName) return null;

  const IconComponent = iconMap[iconName as keyof typeof iconMap];
  return IconComponent ? <IconComponent className={className} /> : null;
};

const Sidebar: React.FC<SidebarProps> = memo(({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { user, token, menuItems, loadingMenu } = useAuth();
  const { t } = useTranslation();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  // const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Memoized menu data processing
  const { activeMenuItems, allRoutes } = useMemo(() => {
    const filteredItems = menuItems
      .filter(item => item.is_active && !item.is_deleted)
      .sort((a, b) => parseInt(a.order) - parseInt(b.order));

    const routes = new Set<string>();

    const extractRoutes = (items: MenuItem[]) => {
      items.forEach(item => {
        if (item.route && item.route !== "#") routes.add(item.route);
        if (item.children) extractRoutes(item.children);
      });
    };

    extractRoutes(filteredItems);

    return {
      activeMenuItems: filteredItems,
      allRoutes: Array.from(routes)
    };
  }, [menuItems]);

  // Auto-expand menus containing current active route
  useEffect(() => {
    const newExpandedMenus: Record<string, boolean> = {};

    activeMenuItems.forEach((menu) => {
      if (menu.children && menu.children.length > 0) {
        const hasActiveChild = menu.children.some(
          child => child.route && pathname.startsWith(child.route)
        );
        if (hasActiveChild) {
          newExpandedMenus[menu.key] = true;
        }
      }
    });

    setExpandedMenus(prev => ({ ...prev, ...newExpandedMenus }));
  }, [pathname, activeMenuItems]);

  // // Fetch menu items
  // useEffect(() => {
  //   if (!user?.id) return;
  //   setMenuItems(menuItems);
  //   // const fetchMenuItems = async () => {
  //   //   if (!user?.id) return;

  //   //   try {
  //   //     setLoading(true);
  //   //     const response = await fetch(
  //   //       `${API_URL}/user-menus/sidebar/${user.id}`,
  //   //       {
  //   //         headers: {
  //   //           Authorization: `Bearer ${token}`,
  //   //           "Content-Type": "application/json",
  //   //         },
  //   //         cache: 'force-cache'
  //   //       }
  //   //     );

  //   //     if (response.ok) {
  //   //       const data = await response.json();
  //   //       setMenuItems(loadingMenu);
  //   //     }
  //   //   } catch (error) {
  //   //     console.error("Error fetching menu items:", error);
  //   //     // Fallback to default items
  //   //     setMenuItems(getDefaultMenuItems());
  //   //   } finally {
  //   //     setLoading(false);
  //   //   }
  //   // };

  //   // fetchMenuItems();
  // }, [user?.id, token]);

  // Memoized active check
  const isActive = useCallback((route: string | null) => {
    if (!route || route === "#") return false;
    return pathname === route;
  }, [pathname]);

  const toggleSubmenu = useCallback((menuKey: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  }, []);

  // Memoized menu item renderer
  const renderMenuItem = useCallback((menu: MenuItem, level = 0) => {
    const hasChildren = menu.children && menu.children.length > 0;
    const isExpanded = expandedMenus[menu.key];
    const isMenuActive = isActive(menu.route);
    const hasActiveChild = hasChildren && menu.children!.some(child => isActive(child.route));

    const baseClasses = `
      flex items-center w-full p-3 rounded-xl transition-all duration-200 group
      ${level > 0 ? "ml-4 pl-8" : ""}
    `;

    const activeClasses = `
      bg-gradient-to-r from-blue-50 to-indigo-50 
      dark:from-blue-900/30 dark:to-indigo-900/30 
      text-[var(--color-primary)] shadow-md
    `;

    const hoverClasses = `
      text-[var(--color-text-secondary)] 
      hover:bg-[var(--color-bg-secondary)] 
      hover:text-[var(--color-text-primary)]
    `;

    if (hasChildren) {
      const activeChildren = menu.children!.filter(child =>
        child.is_active && !child.is_deleted
      );

      if (activeChildren.length === 0) return null;

      return (
        <li key={menu.id} className="relative">
          <button
            onClick={() => toggleSubmenu(menu.key)}
            className={`
              ${baseClasses}
              ${isMenuActive || hasActiveChild ? activeClasses : hoverClasses}
              justify-between
            `}
          >
            <div className="flex items-center min-w-0 flex-1 space-x-3">
              {getIcon(menu.icon)}
              <span className="font-medium flex-1 text-sm sm:text-base truncate text-left">
                {t(menu.label) || menu.key}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transform transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
                }`}
            />
          </button>

          {isExpanded && (
            <ul className="ml-8 mt-1 space-y-1">
              {activeChildren.map((child) => (
                <li key={child.id}>
                  <Link
                    href={child.route}
                    onClick={onClose}
                    className={`
                      block px-3 py-2 rounded-lg text-sm transition-all duration-200
                      ${isActive(child.route)
                        ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium"
                        : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
                      }
                    `}
                  >
                    {t(child.label) || child.key}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    }

    return (
      <li key={menu.id} className="relative">
        <Link
          href={menu.route}
          onClick={onClose}
          className={`
            ${baseClasses}
            ${isMenuActive ? activeClasses : hoverClasses}
            space-x-3
          `}
        >
          {getIcon(menu.icon)}
          <span className="font-medium flex-1 text-sm sm:text-base truncate">
            {t(menu.label, menu.label)}
          </span>
        </Link>
      </li>
    );
  }, [expandedMenus, isActive, toggleSubmenu, onClose, t]);

  if (loadingMenu) {
    return <SidebarSkeleton isOpen={isOpen} onClose={onClose} user={user} />;
  }

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
        onMouseEnter={() => isOpen && onClose} // Optional: auto-close on mouse enter for mobile
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
                  {user?.store?.storeName || "Dashboard"}
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
        <nav className="flex-1 p-2 sm:p-2 overflow-y-auto max-h-full">
          <ul className="space-y-1 sm:space-y-2">
            {/* Dashboard Home Link */}

            <li className="relative">
              <Link
                href="/dashboard/welcome"
                onClick={onClose}
                className={`
                  flex items-center space-x-3 px-3 sm:px-4 py-2 rounded-xl transition-all duration-200
                  ${isActive("/dashbaord/welcome")
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-[var(--color-primary)] shadow-md"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]"
                  }
                `}
              >
                <Home className="w-5 h-5" />
                <span className="font-medium flex-1 text-sm sm:text-base truncate">
                  Welcome
                </span>
              </Link>
            </li>

            {/* Dynamic Menu Items */}
            {activeMenuItems.map((menu) => renderMenuItem(menu))}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-2 sm:p-2 flex-shrink-0 border-t border-[var(--color-border)]/50">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-1 sm:p-1 border border-[var(--color-border)]/30">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-xs sm:text-sm">
                  {getInitials(user?.name || "U") || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-[var(--color-text-primary)] truncate">
                  {user?.name || "User"}
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
});

Sidebar.displayName = "Sidebar";

export default Sidebar;

// Optimized skeleton loader
const SidebarSkeleton = memo(({ isOpen, onClose, user }: any) => (
  <>
    <div
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300 lg:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      onClick={onClose}
    />

    <aside
      className={`
        fixed top-0 left-0 h-full w-72 sm:w-80 z-50 transform transition-all duration-300 ease-out
        lg:relative lg:h-full lg:w-full lg:transform-none lg:transition-none
        bg-[var(--color-bg-primary)]/95 backdrop-blur-xl shadow-2xl border-r border-[var(--color-border)]/30
        flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      <div className="animate-pulse">
        {/* Header skeleton */}
        <div className="p-4 border-b border-gray-200/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300/20 rounded-xl"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-300/20 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300/20 rounded w-1/2"></div>
            </div>
          </div>
        </div>

        {/* Navigation skeleton */}
        <div className="p-4 space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-5 h-5 bg-gray-300/20 rounded"></div>
              <div className="h-4 bg-gray-300/20 rounded flex-1"></div>
            </div>
          ))}
        </div>

        {/* User section skeleton */}
        <div className="p-4 border-t border-gray-200/30 mt-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300/20 rounded-full"></div>
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-gray-300/20 rounded w-full"></div>
              <div className="h-3 bg-gray-300/20 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </>
));

SidebarSkeleton.displayName = "SidebarSkeleton";