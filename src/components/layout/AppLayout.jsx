/**
 * Unit II: App Layout Component
 * Semantic structure: <header>, <aside>, <main>, <footer>
 * Component composition with <Outlet /> for React Router nested routes
 */
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { SyllabusComplianceModal } from '../syllabus/SyllabusComplianceModal';
import { ResourceCaptureModal } from '../../features/tracker/ResourceCaptureModal';
import { DatabaseStatusModal } from '../database/DatabaseStatusModal';
import { AuthModal } from '../../features/auth/AuthModal';
import { useRecallStore } from '../../store/useRecallStore';
import {
  LayoutDashboard,
  Compass,
  FolderLock,
  Network,
  BotMessageSquare,
  HelpCircle,
  Radar,
} from 'lucide-react';

export const AppLayout = () => {
  const { isDatabaseModalOpen, setDatabaseModalOpen, isAuthModalOpen, setAuthModalOpen } = useRecallStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#080C15] text-slate-100">
      <Header />

      <div className="flex-1 flex max-w-[1720px] w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24 md:pb-8 max-w-full">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Unit II: Responsive Breakpoints) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-slate-800/80 px-2 py-2 flex items-center justify-around"
      >
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-medium p-1.5 rounded-lg ${
              isActive ? 'text-indigo-400' : 'text-slate-400'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Overview</span>
        </NavLink>
        <NavLink
          to="/tracker"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-medium p-1.5 rounded-lg ${
              isActive ? 'text-indigo-400' : 'text-slate-400'
            }`
          }
        >
          <Compass className="w-5 h-5" />
          <span>Tracker</span>
        </NavLink>
        <NavLink
          to="/vault"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-medium p-1.5 rounded-lg ${
              isActive ? 'text-indigo-400' : 'text-slate-400'
            }`
          }
        >
          <FolderLock className="w-5 h-5" />
          <span>Vault</span>
        </NavLink>
        <NavLink
          to="/graph"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-medium p-1.5 rounded-lg ${
              isActive ? 'text-indigo-400' : 'text-slate-400'
            }`
          }
        >
          <Network className="w-5 h-5" />
          <span>Graph</span>
        </NavLink>
        <NavLink
          to="/brain"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-medium p-1.5 rounded-lg ${
              isActive ? 'text-indigo-400' : 'text-slate-400'
            }`
          }
        >
          <BotMessageSquare className="w-5 h-5" />
          <span>Brain</span>
        </NavLink>
        <NavLink
          to="/radar"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-medium p-1.5 rounded-lg ${
              isActive ? 'text-indigo-400' : 'text-slate-400'
            }`
          }
        >
          <Radar className="w-5 h-5" />
          <span>Radar</span>
        </NavLink>
        <NavLink
          to="/quiz"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[10px] font-medium p-1.5 rounded-lg ${
              isActive ? 'text-indigo-400' : 'text-slate-400'
            }`
          }
        >
          <HelpCircle className="w-5 h-5" />
          <span>Quiz</span>
        </NavLink>
      </nav>

      {/* Global Modals */}
      <ResourceCaptureModal />
      <SyllabusComplianceModal />
      <DatabaseStatusModal isOpen={isDatabaseModalOpen} onClose={() => setDatabaseModalOpen(false)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
};
