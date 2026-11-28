/**
 * Supabase Authentication Modal
 * Provides tabbed Sign In & Sign Up interfaces directly connected to Supabase Auth.
 */
import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, User, Sparkles, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose }) => {
  const { signIn, signUp, signInAsDemo, user, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState('signin'); // 'signin' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (activeTab === 'signup') {
        const result = await signUp(email, password, fullName);
        if (result.success) {
          onClose();
        } else {
          setErrorMsg(result.error);
        }
      } else {
        const result = await signIn(email, password);
        if (result.success) {
          onClose();
        } else {
          setErrorMsg(result.error);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? 'User Account Profile' : 'RecallOS Supabase Authentication'}
      subtitle={
        user
          ? `Logged in as ${user.email}`
          : 'Sign in to sync your knowledge vault and learning radar across all devices'
      }
      maxWidth="max-w-md"
    >
      {user ? (
        // Already authenticated state
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">Authenticated via Supabase</span>
              <Badge variant="success">Active Session</Badge>
            </div>
            <div className="font-semibold text-white text-base">
              {user.user_metadata?.full_name || 'Yaswanth'}
            </div>
            <div className="text-xs text-slate-300 font-mono flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span>{user.email}</span>
            </div>
          </div>

          <Button
            variant="danger"
            className="w-full text-xs"
            onClick={async () => {
              await signOut();
              onClose();
            }}
          >
            Sign Out of RecallOS
          </Button>
        </div>
      ) : (
        // Auth Form Tabs
        <div className="space-y-4">
          {/* 1-Click Demo Profiles (For Viva Evaluation) */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-950 border border-indigo-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                1-Click Demo Access
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Viva &amp; Testing</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  signInAsDemo('Yaswanth', 'Lead Developer');
                  onClose();
                }}
                className="p-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-left transition group"
              >
                <div className="text-[11px] font-bold text-white group-hover:text-indigo-200 truncate">
                  Yaswanth
                </div>
                <div className="text-[9px] text-indigo-300/80 truncate">Lead Dev</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  signInAsDemo('Surendra', 'Co-Developer');
                  onClose();
                }}
                className="p-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-left transition group"
              >
                <div className="text-[11px] font-bold text-white group-hover:text-indigo-200 truncate">
                  Surendra
                </div>
                <div className="text-[9px] text-indigo-300/80 truncate">Collaborator</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  signInAsDemo('Faculty Evaluator', 'Evaluator / Examiner');
                  onClose();
                }}
                className="p-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-left transition group"
              >
                <div className="text-[11px] font-bold text-white group-hover:text-emerald-200 truncate">
                  Faculty
                </div>
                <div className="text-[9px] text-emerald-300/80 truncate">Examiner</div>
              </button>
            </div>

            <div className="pt-1.5 border-t border-indigo-500/20 flex items-center justify-between text-[10px] text-slate-400">
              <span>Demo Pass: <code className="text-indigo-300 font-mono">RecallOS@2026</code></span>
              <button
                type="button"
                onClick={() => {
                  setEmail('yaswanth@recallos.dev');
                  setPassword('RecallOS@2026');
                }}
                className="text-indigo-400 hover:text-indigo-300 underline"
              >
                Auto-fill inputs
              </button>
            </div>
          </div>

          <div className="flex rounded-xl bg-slate-900/80 p-1 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setActiveTab('signin');
                setErrorMsg('');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === 'signin'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setErrorMsg('');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === 'signup'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {activeTab === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Yaswanth"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full text-xs mt-3"
              isLoading={isSubmitting}
              icon={Sparkles}
            >
              {activeTab === 'signup' ? 'Create Supabase Account' : 'Sign In to RecallOS'}
            </Button>
          </form>

          <p className="text-[11px] text-slate-500 text-center pt-2">
            Secured by Supabase Row-Level Security & JWT authentication
          </p>
        </div>
      )}
    </Modal>
  );
};
