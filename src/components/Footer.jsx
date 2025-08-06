// components/Footer.jsx
"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-t border-white/20 dark:border-gray-800/20">
      <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 gap-2">
          {/* Left section */}
          <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-4 lg:space-x-6">
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
              © {new Date().getFullYear()} Win2Cop. Tous droits réservés.
            </p>
            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
              <Link
                href="/privacy"
                className="text-xs text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors whitespace-nowrap"
              >
                Confidentialité
              </Link>
              <Link
                href="/terms"
                className="text-xs text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors whitespace-nowrap"
              >
                Conditions
              </Link>
              <Link
                href="/support"
                className="text-xs text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors whitespace-nowrap"
              >
                Support
              </Link>
              <Link
                href="/docs"
                className="text-xs text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors whitespace-nowrap"
              >
                Documentation
              </Link>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* System status */}
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                Système opérationnel
              </span>
            </div>

            {/* Version */}
            <div className="hidden sm:flex items-center">
              <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                v2.1.0
              </span>
            </div>
          </div>
        </div>

        {/* Mobile links */}
        <div className="md:hidden mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-800/50">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link
              href="/privacy"
              className="text-xs text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Confidentialité
            </Link>
            <Link
              href="/terms"
              className="text-xs text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Conditions
            </Link>
            <Link
              href="/support"
              className="text-xs text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Support
            </Link>
            <Link
              href="/docs"
              className="text-xs text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Docs
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
