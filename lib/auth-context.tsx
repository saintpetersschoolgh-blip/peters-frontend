'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthState, AuthContextType, User, UserRole, LoginCredentials } from '../types';
import { apiClient } from './api-client';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiry

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check for existing session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        let token: string | null = null;
        let userData: string | null = null;
        let lastActivity: string | null = null;

        try {
          token = localStorage.getItem('authToken');
          userData = localStorage.getItem('userData');
          lastActivity = localStorage.getItem('lastActivity');
        } catch {
          token = null;
          userData = null;
          lastActivity = null;
        }

        if (token && userData && lastActivity) {
          const timeSinceActivity = Date.now() - parseInt(lastActivity);

          // Check if session has expired
          if (timeSinceActivity > SESSION_TIMEOUT) {
            await logout();
            return;
          }

          const user: User = JSON.parse(userData);

          // Check if user is active
          if (user.status !== 'ACTIVE') {
            await logout();
            return;
          }

          // Check if token needs refresh
          if (timeSinceActivity > (SESSION_TIMEOUT - TOKEN_REFRESH_THRESHOLD)) {
            try {
              await refreshToken();
            } catch {
              await logout();
              return;
            }
          }

          setAuthState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        await logout();
      }
    };

    initializeAuth();

    // Set up activity tracking
    const updateActivity = () => {
      if (authState.isAuthenticated) {
        try {
          localStorage.setItem('lastActivity', Date.now().toString());
        } catch {
          // ignore
        }
      }
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    // Check session expiry periodically
    const sessionCheck = setInterval(() => {
      let lastActivity: string | null = null;
      try {
        lastActivity = localStorage.getItem('lastActivity');
      } catch {
        lastActivity = null;
      }
      if (lastActivity) {
        const timeSinceActivity = Date.now() - parseInt(lastActivity);
        if (timeSinceActivity > SESSION_TIMEOUT) {
          logout();
        }
      }
    }, 60000); // Check every minute

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
      clearInterval(sessionCheck);
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!credentials.username || !credentials.password) {
        throw new Error('Username and password are required');
      }

      // Demo authentication rule: same password for all accounts
      if (credentials.password !== 'admin123') {
        throw new Error('Invalid username or password');
      }

      // Create mock user based on username pattern
      let mockUser: User;
      let mockRole: UserRole;

      const uname = credentials.username.toLowerCase();

      if (
        uname.includes('head-master') ||
        uname.includes('headmaster') ||
        uname.includes('head_master')
      ) {
        mockRole = UserRole.HEAD_MASTER;
        mockUser = {
          id: '5',
          username: credentials.username,
          email: 'headmaster@school.com',
          role: mockRole,
          status: 'ACTIVE',
          firstName: 'Head',
          lastName: 'Master',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } else if (uname.includes('admin')) {
        mockRole = UserRole.ADMIN;
        mockUser = {
          id: '1',
          username: credentials.username,
          email: 'admin@school.com',
          role: mockRole,
          status: 'ACTIVE',
          firstName: 'Admin',
          lastName: 'User',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } else if (uname.includes('teacher')) {
        mockRole = UserRole.TEACHER;
        mockUser = {
          id: '2',
          username: credentials.username,
          email: 'teacher@school.com',
          role: mockRole,
          status: 'ACTIVE',
          firstName: 'Teacher',
          lastName: 'User',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } else if (uname.includes('student')) {
        mockRole = UserRole.STUDENT;
        mockUser = {
          id: '3',
          username: credentials.username,
          email: 'student@school.com',
          role: mockRole,
          status: 'ACTIVE',
          firstName: 'Student',
          lastName: 'User',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } else if (uname.includes('parent')) {
        mockRole = UserRole.PARENT;
        mockUser = {
          id: '4',
          username: credentials.username,
          email: 'parent@school.com',
          role: mockRole,
          status: 'ACTIVE',
          firstName: 'Parent',
          lastName: 'User',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } else {
        // Default to admin for demo purposes
        mockRole = UserRole.ADMIN;
        mockUser = {
          id: '1',
          username: credentials.username,
          email: `${credentials.username}@school.com`,
          role: mockRole,
          status: 'ACTIVE',
          firstName: credentials.username,
          lastName: 'User',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      const mockToken = `mock-jwt-token-${Date.now()}`;

      // Store in localStorage
      try {
        localStorage.setItem('authToken', mockToken);
        localStorage.setItem('userData', JSON.stringify(mockUser));
        localStorage.setItem('lastActivity', Date.now().toString());
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', mockUser.role);
      } catch {
        // ignore storage errors
      }

      setAuthState({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Call logout endpoint if token exists
      if (authState.token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authState.token}`,
          },
        }).catch(() => {}); // Ignore logout endpoint errors
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('lastActivity');
      } catch {
        // ignore
      }

      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });

      // Redirect to login
      try {
        window.location.hash = '#/login';
      } catch {
        // ignore
      }
    }
  }, [authState.token]);

  const refreshToken = useCallback(async () => {
    try {
      if (!authState.token) throw new Error('No token to refresh');

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authState.token}`,
        },
      });

      if (!response.ok) throw new Error('Token refresh failed');

      const { token } = await response.json();
      localStorage.setItem('authToken', token);

      setAuthState(prev => ({
        ...prev,
        token,
      }));
    } catch (error) {
      console.error('Token refresh failed:', error);
      await logout();
      throw error;
    }
  }, [authState.token, logout]);

  const hasRole = useCallback((role: UserRole): boolean => {
    return authState.user?.role === role;
  }, [authState.user]);

  const hasAnyRole = useCallback((roles: UserRole[]): boolean => {
    return authState.user ? roles.includes(authState.user.role) : false;
  }, [authState.user]);

  const canAccess = useCallback((requiredRoles: UserRole[]): boolean => {
    if (!authState.isAuthenticated || !authState.user) return false;
    return requiredRoles.includes(authState.user.role);
  }, [authState.isAuthenticated, authState.user]);

  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    refreshToken,
    hasRole,
    hasAnyRole,
    canAccess,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};