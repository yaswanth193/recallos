/**
 * Supabase Cloud Database Client for RecallOS
 * Provides PostgreSQL cloud persistence for:
 * - learning resources
 * - knowledge concepts & mastery telemetry
 * - adaptive quiz banks
 * With resilient failover to local persistent store.
 */
import { createClient } from '@supabase/supabase-js';

// Default Supabase configuration (preconfigured with live project)
const DEFAULT_URL = import.meta.env.VITE_SUPABASE_URL || 'https://yqhkhvgmpjrwuotyfauv.supabase.co';
const DEFAULT_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_NrbmEAlxUFLkHxMgWHSyXQ_UnXQiafU';

// Check if user set custom credentials in browser storage
const getActiveConfig = () => {
  try {
    const custom = localStorage.getItem('recallos_custom_supabase');
    if (custom) {
      const parsed = JSON.parse(custom);
      if (parsed.url && parsed.anonKey) {
        return { url: parsed.url, anonKey: parsed.anonKey, isCustom: true };
      }
    }
  } catch (err) {
    console.warn('Could not read custom Supabase config:', err);
  }
  return { url: DEFAULT_URL, anonKey: DEFAULT_ANON_KEY, isCustom: false };
};

const activeConfig = getActiveConfig();

export const supabase = createClient(activeConfig.url, activeConfig.anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const getSupabaseConfig = () => getActiveConfig();

export const saveCustomSupabaseConfig = (url, anonKey) => {
  localStorage.setItem(
    'recallos_custom_supabase',
    JSON.stringify({ url, anonKey })
  );
};

export const clearCustomSupabaseConfig = () => {
  localStorage.removeItem('recallos_custom_supabase');
};

/**
 * Health check to verify live Supabase cloud connection
 */
export const checkSupabaseConnection = async () => {
  try {
    const config = getActiveConfig();
    if (!config.url || config.url.includes('dummy') || config.url.includes('local')) {
      return { connected: false, reason: 'Using resilient offline/local database layer' };
    }
    const { data, error } = await supabase.from('resources').select('id').limit(1);
    if (error) {
      return { connected: false, reason: error.message };
    }
    return { connected: true, data };
  } catch (err) {
    return { connected: false, reason: err.message };
  }
};
