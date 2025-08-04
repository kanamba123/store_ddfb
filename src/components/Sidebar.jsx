// components/Sidebar.jsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Settings,
  X,
  ChevronRight,
  Home,
  BarChart3,
  FileText,
  ShoppingCart
} from 'lucide-react';
import { FaUsers } from 'react-icons/fa';

const sidebarLinks = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    color: 'from-blue-500 to-cyan-500'
  }, {
    label: 'Produits',
    href: '/dashboard/products',
    icon: ShoppingCart, // Ou un autre icône pertinent
    color: 'from-orange-400 to-yellow-400'
  },
 {
    label: 'Sales',
    href: '/dashboard/sales',
    icon: FaUsers,
    color: 'from-purple-500 to-pink-500',
  },
  {
    label: 'Utilisateurs',
    href: '/dashboard/users',
    icon: Users,
    color: 'from-purple-500 to-pink-500'
  },
  {
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    color: 'from-green-500 to-emerald-500'
  },
  {
    label: 'Commandes',
    href: '/dashboard/orders',
    icon: ShoppingCart,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    label: 'Rapports',
    href: '/dashboard/reports',
    icon: FileText,
    color: 'from-indigo-500 to-purple-500'
  },
  {
    label: 'Paramètres',
    href: '/dashboard/settings',
    icon: Settings,
    color: 'from-red-500 to-pink-500'
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 sm:w-80 z-50 transform transition-all duration-300 ease-out
          lg:static lg:w-full lg:h-auto lg:transform-none lg:transition-none
          bg-white/85 backdrop-blur-xl shadow-2xl border-r border-white/30
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Home className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent truncate">
                  Win2Cop
                </h2>
                <p className="text-xs text-gray-500">Dashboard Pro</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-gray-100/50 transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`group relative flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 ${isActive
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-md'
                    : 'text-gray-600 hover:bg-gray-50/50 hover:text-gray-800'
                  }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 sm:h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full" />
                )}

                {/* Icon with gradient background */}
                <div className={`relative p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${isActive
                    ? `bg-gradient-to-r ${link.color}`
                    : 'bg-gray-100/50 group-hover:bg-gray-200/50'
                  } transition-all duration-200`}>
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                    }`} />
                </div>

                <span className="font-medium flex-1 text-sm sm:text-base truncate">{link.label}</span>

                {/* Arrow indicator */}
                <ChevronRight className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-200 flex-shrink-0 ${isActive
                    ? 'text-blue-500 translate-x-1'
                    : 'text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1'
                  }`} />
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-3 sm:p-4 flex-shrink-0">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-3 sm:p-4 border border-blue-200/20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-xs sm:text-sm">JD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">Nishimagizwe Ruben</p>
                <p className="text-xs text-gray-500 truncate">nishimagizwe@win2cop.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}