import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: any;
  setUser: (user: any) => void;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initialize from localStorage (MSG91 Session - "Forever")
    const localUser = localStorage.getItem('digydukaan_user');
    if (localUser) {
      try {
        setUser(JSON.parse(localUser));
      } catch (e) {
        console.error("Failed to parse local user", e);
      }
    }

    // 2. Synchronization with Supabase (Admin/Legacy)
    const checkSupabaseSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && !localStorage.getItem('digydukaan_user')) {
        setUser(session.user);
      }
      setLoading(false);
    };

    checkSupabaseSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!localStorage.getItem('digydukaan_user')) {
        setUser(session?.user ?? null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSetUser = (userData: any) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('digydukaan_user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('digydukaan_user');
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('digydukaan_user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, setUser: handleSetUser, logout, loading }}>
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
