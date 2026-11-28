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
    // 0. Check for persisted demo session
    try {
      const storedDemo = localStorage.getItem('recallos_demo_auth');
      if (storedDemo) {
        const parsed = JSON.parse(storedDemo);
        setUser(parsed);
        setSession({ user: parsed, access_token: 'demo-jwt-token' });
        setIsLoading(false);
      }
    } catch (e) {
      console.warn('Demo auth parse error:', e);
    }

    // 1. Get initial active session from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setUser(session?.user ?? null);
      }
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

  // 1-Click Demo Sign-in for Viva / Presentation & Testing
  const signInAsDemo = (profileName = 'Yaswanth', role = 'Lead Developer') => {
    const isSurendra = profileName.toLowerCase().includes('surendra');
    const isFaculty = profileName.toLowerCase().includes('faculty') || profileName.toLowerCase().includes('evaluator');

    const demoUser = {
      id: isSurendra ? 'usr-surendra-02' : isFaculty ? 'usr-faculty-01' : 'usr-yaswanth-01',
      email: isSurendra
        ? 'surendra@recallos.dev'
        : isFaculty
        ? 'evaluator@lpu.in'
        : 'yaswanth@recallos.dev',
      user_metadata: {
        full_name: profileName,
        role: role,
      },
      aud: 'authenticated',
      role: 'authenticated',
    };

    localStorage.setItem('recallos_demo_auth', JSON.stringify(demoUser));
    setUser(demoUser);
    setSession({ user: demoUser, access_token: 'demo-jwt-token' });
    addNotification(`Signed in as ${profileName} (${role})`, 'success');
    return { success: true, user: demoUser };
  };

  // Sign out
  const signOut = async () => {
    try {
      localStorage.removeItem('recallos_demo_auth');
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
        signInAsDemo,
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
