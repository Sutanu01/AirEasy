'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, RoleType, ApiResponse } from '@/types';
import { apiRequest, setAccessToken, getAccessToken } from '@/lib/api-client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  hasRole: (roles: RoleType | RoleType[]) => boolean;
  isAdmin: boolean;
  isAirlineStaff: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to sync user from localStorage and refresh token
  const initializeAuth = useCallback(async () => {
    try {
      const storedUser = localStorage.getItem('aireasy_user');
      const token = getAccessToken();

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      // If we don't have an active token or we want to verify session validity
      if (!token) {
        try {
          const refreshRes = await apiRequest<{ accessToken: string }>('/auth/refresh', {
            method: 'POST',
            skipAuth: true,
          });
          if (refreshRes.data?.accessToken) {
            setAccessToken(refreshRes.data.accessToken);
          }
        } catch (err) {
          // No active session cookie
          setUser(null);
          localStorage.removeItem('aireasy_user');
          setAccessToken(null);
        }
      }
    } catch (e) {
      console.error('Failed to initialize auth', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();

    const handleAuthChange = () => {
      const stored = localStorage.getItem('aireasy_user');
      setUser(stored ? JSON.parse(stored) : null);
    };

    window.addEventListener('aireasy_auth_change', handleAuthChange);
    return () => window.removeEventListener('aireasy_auth_change', handleAuthChange);
  }, [initializeAuth]);

  const login = async (email: string, password: string) => {
    const response = await apiRequest<{
      user: { id: number; email: string };
      accessToken: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    });

    const { user: userData, accessToken } = response.data;
    setAccessToken(accessToken);

    // Decode JWT payload or fetch user roles
    let roles: RoleType[] = ['CUSTOMER'];
    try {
      const payloadPart = accessToken.split('.')[1];
      if (payloadPart) {
        const decoded = JSON.parse(atob(payloadPart));
        if (decoded.roles && Array.isArray(decoded.roles)) {
          roles = decoded.roles as RoleType[];
        }
      }
    } catch (e) {
      console.warn('Failed to parse roles from token', e);
    }

    const fullUser: User = {
      id: userData.id,
      email: userData.email,
      roles,
    };

    setUser(fullUser);
    localStorage.setItem('aireasy_user', JSON.stringify(fullUser));
  };

  const signup = async (email: string, password: string) => {
    await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      skipAuth: true,
    });
    // Immediately log in after signup
    await login(email, password);
  };

  const logout = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch (e) {
      // Ignore network errors during logout
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem('aireasy_user');
    }
  };

  const logoutAll = async () => {
    try {
      await apiRequest('/auth/logout-all', { method: 'POST' });
    } catch (e) {
      // Ignore
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem('aireasy_user');
    }
  };

  const hasRole = (roles: RoleType | RoleType[]): boolean => {
    if (!user || !user.roles) return false;
    const required = Array.isArray(roles) ? roles : [roles];
    return user.roles.some((r) => required.includes(r));
  };

  const isAdmin = hasRole('ADMIN');
  const isAirlineStaff = hasRole(['ADMIN', 'FLIGHT_COMPANY']);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        logoutAll,
        hasRole,
        isAdmin,
        isAirlineStaff,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
