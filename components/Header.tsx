
/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Link, useRouter } from '../lib/navigation';
import { ICONS } from '../constants';
import { useAuth } from '../lib/auth-context';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (menuRef.current.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('theme-dark', theme === 'dark');
  }, [theme]);

  const initials =
    user ? `${(user.firstName || user.username || 'U')[0]}${(user.lastName || ' ')[0]}`.toUpperCase() : 'U';

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Open Menu"
        >
          {ICONS.Menu()}
        </button>

        <div className="hidden md:flex items-center gap-3 flex-1 max-w-lg">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {ICONS.Search()}
            </span>
            <input 
              type="text" 
              placeholder="Search records, students, or staff..."
              className="input pl-10 w-full"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3" ref={menuRef}>
        <button
          type="button"
          onClick={() => router.push('/notifications/send')}
          className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          aria-label="Notifications"
        >
          {ICONS.Bell()}
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* Profile dropdown */}
        {isAuthenticated && user ? (
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span className="hidden md:inline">Dark</span>
              <input
                type="checkbox"
                checked={theme === 'dark'}
                onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="sr-only"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              />
              <span
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ring-1 ${
                  theme === 'dark'
                    ? 'bg-slate-600 ring-slate-400'
                    : 'bg-slate-200 ring-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                    theme === 'dark' ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </span>
              <span className="hidden md:inline">Light</span>
            </label>

            <div className="relative">
              <button
                type="button"
                onClick={() => setOpen(v => !v)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 transition-colors"
                aria-haspopup="menu"
                aria-expanded={open}
              >
                <div className="h-9 w-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-semibold overflow-hidden">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="h-9 w-9 object-cover" />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-semibold text-slate-900 leading-tight">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-xs text-slate-500 leading-tight">@{user.username}</div>
                </div>
                <span className="hidden md:block text-slate-400">{ICONS.ChevronDown()}</span>
              </button>

              {open && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 shadow-lg rounded-xl overflow-hidden z-50"
                >
                  <button
                    role="menuitem"
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                    onClick={() => {
                      setOpen(false);
                      router.push('/account');
                    }}
                  >
                    {ICONS.User()}
                    Profile
                  </button>
                  <button
                    role="menuitem"
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50"
                    onClick={() => {
                      setOpen(false);
                      router.push('/settings');
                    }}
                  >
                    {ICONS.Settings()}
                    Settings
                  </button>
                  <div className="h-px bg-slate-200" />
                  <button
                    role="menuitem"
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                    onClick={() => {
                      setOpen(false);
                      logout();
                    }}
                  >
                    {ICONS.Logout()}
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span className="hidden md:inline">Dark</span>
            <input
              type="checkbox"
              checked={theme === 'dark'}
              onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="sr-only"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            />
            <span
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ring-1 ${
                theme === 'dark'
                  ? 'bg-slate-600 ring-slate-400'
                  : 'bg-slate-200 ring-slate-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                  theme === 'dark' ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </span>
            <span className="hidden md:inline">Light</span>
          </label>
        )}
      </div>
    </header>
  );
};

export default Header;
