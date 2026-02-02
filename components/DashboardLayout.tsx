'use client';
import React, { useState, useEffect } from 'react';
import { usePathname } from '../lib/navigation';
import Sidebar from './Sidebar';
import Header from './Header';

/**
 * Dashboard Layout Component
 * Provides consistent layout for all dashboard pages with sidebar and header
 */
export default function DashboardLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  // Handle mounting
  useEffect(() => {
    setIsMounted(true);

    // Persist collapse state
    try {
      const savedCollapse = localStorage.getItem('sidebarCollapsed') === 'true';
      setIsCollapsed(savedCollapse);
    } catch {
      // ignore storage errors (e.g. blocked storage)
      setIsCollapsed(false);
    }
  }, []);

  // Handle closing mobile sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    try {
      localStorage.setItem('sidebarCollapsed', String(newState));
    } catch {
      // ignore
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-x-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
      />

      <main
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <Header onMenuToggle={() => setIsSidebarOpen(true)} />
        <div className="flex-1 relative">
          <div className="w-full px-2 py-0">
            {children}
          </div>
        </div>

        <footer className="mt-auto px-6 py-6 text-center text-slate-400 text-xs font-medium border-t border-slate-200 bg-white">
          <p>&copy; {new Date().getFullYear()} St. Peter's International school. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}