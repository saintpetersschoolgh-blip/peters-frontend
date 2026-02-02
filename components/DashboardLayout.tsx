'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [sidebarWidth, setSidebarWidth] = useState(256); // Default 256px (w-64)
  const [isResizing, setIsResizing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);

  // Handle mounting
  useEffect(() => {
    setIsMounted(true);

    // Load saved sidebar state
    try {
      const savedCollapse = localStorage.getItem('sidebarCollapsed') === 'true';
      setIsCollapsed(savedCollapse);
      
      const savedWidth = localStorage.getItem('sidebarWidth');
      if (savedWidth) {
        const width = parseInt(savedWidth, 10);
        if (width >= 200 && width <= 500) {
          setSidebarWidth(width);
        }
      }
    } catch {
      // ignore storage errors
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

  // Handle resize
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!sidebarRef.current) return;
      
      const rect = sidebarRef.current.getBoundingClientRect();
      const newWidth = e.clientX - rect.left;
      
      // Constrain width between 200px and 500px
      const constrainedWidth = Math.max(200, Math.min(500, newWidth));
      setSidebarWidth(constrainedWidth);
      
      // Save to localStorage
      try {
        localStorage.setItem('sidebarWidth', String(constrainedWidth));
      } catch {
        // ignore
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  if (!isMounted) return null;

  const effectiveWidth = isCollapsed ? 80 : sidebarWidth;

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-x-hidden">
      <div
        ref={sidebarRef}
        className="relative"
        style={{ width: 0, minWidth: 0, maxWidth: 0 }}
      >
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleCollapse}
          width={effectiveWidth}
        />
        
        {/* Resize Handle */}
        {!isCollapsed && (
          <div
            ref={resizeHandleRef}
            onMouseDown={handleMouseDown}
            className={`fixed top-0 h-full cursor-col-resize bg-transparent hover:bg-blue-500 transition-colors z-50 ${
              isResizing ? 'bg-blue-500' : ''
            }`}
            style={{ 
              userSelect: 'none', 
              left: `${effectiveWidth}px`, 
              width: '4px',
              marginLeft: '-2px'
            }}
            title="Drag to resize sidebar"
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-2 h-12 bg-slate-400 rounded-full opacity-0 hover:opacity-100 transition-opacity" />
          </div>
        )}
      </div>

      <main
        className="flex-1 flex flex-col min-w-0 transition-all duration-300"
        style={{ marginLeft: `${effectiveWidth}px`, width: `calc(100% - ${effectiveWidth}px)` }}
      >
        <Header onMenuToggle={() => setIsSidebarOpen(true)} />
        <div className="flex-1 relative overflow-x-hidden" style={{ padding: '0 12px' }}>
          {children}
        </div>

        <footer className="mt-auto py-6 text-center text-slate-400 text-xs font-medium border-t border-slate-200 bg-white">
          <p>&copy; {new Date().getFullYear()} St. Peter's International school. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}