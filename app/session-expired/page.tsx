'use client';
import React, { useEffect } from 'react';
import { useRouter } from '../../lib/navigation';
import { ICONS } from '../../constants';

export default function SessionExpiredPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear any cached session data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
  }, []);

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 p-4 md:p-8">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 text-center space-y-8">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
          <div className="text-orange-600 text-3xl">⏰</div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Session Expired</h1>
          <p className="text-gray-600 leading-relaxed">
            Your session has expired due to inactivity. For security reasons, please log in again to continue using the system.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 mt-0.5">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-blue-900 mb-1">Security Notice</h3>
              <p className="text-sm text-blue-700">
                Sessions automatically expire after 30 minutes of inactivity to protect your account and data.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleLoginRedirect}
            className="w-full py-4 bg-slate-900 text-white font-semibold rounded-2xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Log In Again
          </button>

          <button
            onClick={() => router.push('/forgot-password')}
            className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-2xl hover:bg-gray-200 transition-colors text-sm"
          >
            Forgot Password?
          </button>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Sessions expire after 30 minutes of inactivity</p>
          <p>• Remember to log out when finished for security</p>
          <p>• Use "Remember Me" to stay logged in longer</p>
        </div>
      </div>
    </div>
  );
}