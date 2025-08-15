
'use client';

import { useState } from 'react';
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] lg:grid-cols-[280px_1fr] lg:grid-rows-[auto_1fr_auto] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navbar - Spans full width on mobile, right column on desktop */}
      <div className="lg:col-span-2 lg:col-start-1 relative z-20">
        <Navbar onToggleSidebar={toggleSidebar} />
      </div>

      {/* Sidebar - Hidden on mobile (overlay), fixed column on desktop */}
      <div className="hidden lg:block lg:row-start-2 lg:row-end-4 mt-2 mb-2">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className="lg:hidden">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      </div>

      {/* Main Content - Full width on mobile, right column on desktop */}
      <main className="lg:col-start-2 lg:row-start-2 overflow-hidden">
        <div className="h-full p-2">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30 h-full  overflow-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Footer - Spans full width on mobile, right column on desktop */}
      <div className="lg:col-start-2 lg:row-start-3 m-2">
        <Footer />
      </div>
    </div>
  );
}