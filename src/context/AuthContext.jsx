/**
 * Supabase Authentication Context
 * Manages user authentication state, login, registration, and session persistence.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNotification } from './NotificationContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotification();

  useEffect(() => {
    // 1. Get initial active session from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    }).catch((err) => {
      console.warn('Supabase auth getSession warning:', err);
      setIsLoading(false);
    });

    // 2. Listen for auth changes (sign-in, sign-out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Sign up with Email and Password
  const signUp = async (email, password, fullName = '') => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || 'Yaswanth',
          },
        },
      });

      if (error) throw error;

      addNotification('Account created successfully!', 'success');
      return { success: true, user: data.user };
    } catch (err) {
      addNotification(`Sign up failed: ${err.message}`, 'error');
      return { success: false, error: err.message };
    }
  };

  // Sign in with Email and Password
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      addNotification(`Welcome back, ${data.user.user_metadata?.full_name || data.user.email}!`, 'success');
      return { success: true, user: data.user };
    } catch (err) {
      addNotification(`Sign in failed: ${err.message}`, 'error');
      return { success: false, error: err.message };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      addNotification('Signed out of RecallOS', 'info');
    } catch (err) {
      addNotification(`Sign out error: ${err.message}`, 'error');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signUp,
        signIn,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
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
