import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (token: string, userData: User) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

import { AuthService } from '../services/auth.service';
import { WorkspaceService } from '../services/workspace.service';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('commondesk_token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await AuthService.me();
        setUser((res as any).user);
        
        // Also fetch workspaces to ensure we have an active one
        if (!localStorage.getItem('commondesk_workspace')) {
          const workspaces = await WorkspaceService.getWorkspaces();
          if (Array.isArray(workspaces) && workspaces.length > 0) {
            localStorage.setItem('commondesk_workspace', workspaces[0].id);
          }
        }
      } catch (err) {
        localStorage.removeItem('commondesk_token');
        localStorage.removeItem('commondesk_workspace');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (token: string, userData: User) => {
    setUser(userData);
    localStorage.setItem('commondesk_token', token);
    
    // Fetch and set default workspace
    try {
      const workspaces = await WorkspaceService.getWorkspaces();
      if (Array.isArray(workspaces) && workspaces.length > 0) {
        localStorage.setItem('commondesk_workspace', workspaces[0].id);
      }
    } catch(e) {
      console.error("Failed to load workspaces during login");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('commondesk_token');
    localStorage.removeItem('commondesk_workspace');
  };

  const updateUser = (data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
