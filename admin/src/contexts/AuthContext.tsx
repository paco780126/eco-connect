import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../utils/api';

interface User {
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('admin-token');
      const storedUser = localStorage.getItem('admin-user');
      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role === 'admin') {
            setToken(storedToken);
            setUser(parsedUser);
        } else {
            localStorage.clear();
        }
      }
    } catch (error) {
      console.error("Failed to load admin user from local storage", error);
      localStorage.clear();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const data = await authFetch('/login', {
        method: 'POST',
        body: credentials,
    });

    if (!data || !data.user || data.user.role !== 'admin') {
      throw new Error('관리자 계정이 아니거나 서버 응답이 올바르지 않습니다.');
    }

    localStorage.setItem('admin-token', data.token);
    localStorage.setItem('admin-user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('admin-token');
    localStorage.removeItem('admin-user');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const value = { user, token, login, logout, isLoading };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};