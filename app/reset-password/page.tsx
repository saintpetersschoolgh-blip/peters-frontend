'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from '../../lib/navigation';
import { ICONS } from '../../constants';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Simulate getting token from URL params
    const urlToken = new URLSearchParams(window.location.search).get('token');
    if (urlToken) {
      setToken(urlToken);
    } else {
      setError('Invalid or expired reset link. Please request a new password reset.');
    }
  }, []);

  const validatePassword = (pwd: string) => {
    if (pwd.length < 8) return 'Password must be at least 8 characters long';
    if (!/[A-Z]/.test(pwd)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(pwd)) return 'Password must contain at least one lowercase letter';
    if (!/\d/.test(pwd)) return 'Password must contain at least one number';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock token validation
      if (!token) {
        throw new Error('Invalid reset token');
      }

      setIsSuccess(true);

      // Redirect to login after success message
      setTimeout(() => {
        router.push('/login');
      }, 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 p-4 md:p-8">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <div className="text-green-600 text-2xl">✓</div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful</h2>
            <p className="text-gray-600">
              Your password has been successfully updated. You can now log in with your new password.
            </p>
          </div>

          <div className="text-sm text-gray-500">
            Redirecting to login page in 3 seconds...
          </div>

          <button
            onClick={() => router.push('/login')}
            className="w-full py-3 bg-slate-900 text-white font-semibold rounded-2xl hover:bg-slate-800 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 p-4 md:p-8">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 text-center space-y-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <div className="text-red-600 text-2xl">⚠</div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
            <p className="text-gray-600">
              This password reset link is invalid or has expired. Please request a new password reset.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push('/forgot-password')}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-colors"
            >
              Request New Reset Link
            </button>
            <button
              onClick={() => router.push('/login')}
              className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 p-4 md:p-8">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-600">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">
              New Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
              <div className="absolute left-4 top-3.5 text-gray-400">
                🔒
              </div>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Password must contain:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>At least 8 characters</li>
                <li>One uppercase letter</li>
                <li>One lowercase letter</li>
                <li>One number</li>
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
              <div className="absolute left-4 top-3.5 text-gray-400">
                🔒
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !password.trim() || !confirmPassword.trim()}
            className="w-full py-4 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => router.push('/login')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}