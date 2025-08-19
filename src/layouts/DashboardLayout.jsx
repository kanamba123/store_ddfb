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
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] lg:grid-cols-[280px_1fr] lg:grid-rows-[auto_1fr_auto] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      {/* Navbar */}
      
      <div className="lg:col-span-2 lg:col-start-1 relative z-20">
        <Navbar onToggleSidebar={toggleSidebar} />
      </div>

      {/* Sidebar - Desktop */}
      <div className="hidden lg:block lg:row-start-2 lg:row-end-4 mt-2 mb-2">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      </div>

      {/* Sidebar - Mobile */}
      
      <div className="lg:hidden">
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      </div>

      {/* Main Content */}
      <main className="lg:col-start-2 lg:row-start-2 overflow-hidden">
        <div className="h-full p-2">
          <div
            className="h-full overflow-auto rounded-2xl custom-scrollbar"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              boxShadow: `0 2px 6px var(--color-shadow-light)`,
              color: "var(--color-text-primary)",
            }}
          >
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="lg:col-start-2 lg:row-start-3 m-2">
        <Footer />
      </div>
    </div>
  );
}
