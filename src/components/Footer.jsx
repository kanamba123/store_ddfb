// components/Footer.jsx
"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-bg-primary)] backdrop-blur-md border-t border-white/20 dark:border-gray-800/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
          
          {/* Left section */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p className="text-xs sm:text-sm  text-center sm:text-left">
              © {new Date().getFullYear()} Win2Cop. Tous droits réservés.
            </p>
            
            <div className="hidden md:flex items-center gap-3 sm:gap-4">
              {["privacy", "terms", "support", "docs"].map((item) => (
                <Link
                  key={item}
                  href={`/${item}`}
                  className="text-xs  hover:text-gray-700 dark:hover:text-gray-300 transition-colors whitespace-nowrap"
                >
                  {item === "docs" ? "Documentation" : item.charAt(0).toUpperCase() + item.slice(1)}
                </Link>
              ))}
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3 sm:gap-4 mt-2 sm:mt-0">
            {/* System status */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs  whitespace-nowrap">
                Système opérationnel
              </span>
            </div>

            {/* Version */}
            <div className="hidden sm:flex">
              <span className="text-xs  dark:text-gray-500 whitespace-nowrap">
                v2.1.0
              </span>
            </div>
          </div>
        </div>

        {/* Mobile links */}
        <div className="md:hidden mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-800/50">
          <div className="flex flex-wrap justify-center gap-2">
            {["privacy", "terms", "support", "docs"].map((item) => (
              <Link
                key={item}
                href={`/${item}`}
                className="text-xs   hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                {item === "docs" ? "Docs" : item.charAt(0).toUpperCase() + item.slice(1)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
