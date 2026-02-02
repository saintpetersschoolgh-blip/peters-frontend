/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useMemo, useState } from 'react';
import { useRouter, Link } from '../lib/navigation';
import { useAuth } from '../lib/auth-context';
import { formatUserRole, UserRole } from '../types';

const DEFAULT_PASSWORD = 'admin123';

function getDefaultRouteForRole(role: UserRole): string {
  switch (role) {
    case UserRole.ADMIN:
      return '/admin';
    case UserRole.HEAD_MASTER:
      return '/head-master';
    case UserRole.TEACHER:
      return '/teacher';
    case UserRole.STUDENT:
      return '/student';
    case UserRole.PARENT:
      return '/parent';
    default:
      return '/';
  }
}

export default function Login() {
  const router = useRouter();
  const { login, isAuthenticated, user } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextPath = useMemo(() => {
    // If we’re already authenticated, head to the right dashboard.
    if (isAuthenticated && user) return getDefaultRouteForRole(user.role);
    return null;
  }, [isAuthenticated, user]);

  React.useEffect(() => {
    if (nextPath) router.push(nextPath);
  }, [nextPath, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login({ username: username.trim(), password });

      // Optional: remember-me behavior (kept for future; session timeout still applies).
      localStorage.setItem('rememberMe', String(rememberMe));

      // Route to the correct dashboard based on role.
      const role = (localStorage.getItem('userRole') as UserRole | null) ?? null;
      if (role) {
        router.push(getDefaultRouteForRole(role));
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 p-4 md:p-8">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 space-y-8">
        <div className="text-center space-y-3">
          <img
            src="/logo.png"
            alt="St. Peter's International school Logo"
            className="h-16 w-auto mx-auto object-contain"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sign in</h1>
            <p className="text-gray-600 text-sm mt-1">
              Demo password for all accounts is <span className="font-semibold">admin123</span>.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin001, teacher001, student001..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
              autoComplete="username"
              required
            />
            <p className="text-xs text-gray-500">
              Role is inferred from the username (admin / head-master / teacher / student / parent).
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={DEFAULT_PASSWORD}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-700 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Remember me
            </label>
            <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-800">
              Forgot password?
            </Link>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Demo accounts</h3>
          <ul className="text-sm text-slate-700 space-y-1">
            <li>
              <span className="font-medium">Admin</span>: <code className="px-1 py-0.5 bg-white rounded">admin001</code>
            </li>
            <li>
              <span className="font-medium">Head-Master</span>:{' '}
              <code className="px-1 py-0.5 bg-white rounded">head-master001</code>
            </li>
            <li>
              <span className="font-medium">Teacher</span>: <code className="px-1 py-0.5 bg-white rounded">teacher001</code>
            </li>
            <li>
              <span className="font-medium">Student</span>: <code className="px-1 py-0.5 bg-white rounded">student001</code>
            </li>
            <li>
              <span className="font-medium">Parent</span>: <code className="px-1 py-0.5 bg-white rounded">parent001</code>
            </li>
          </ul>
          <p className="text-xs text-slate-500 mt-3">
            Password for all: <code className="px-1 py-0.5 bg-white rounded">{DEFAULT_PASSWORD}</code>
          </p>
        </div>
      </div>
    </div>
  );
}

