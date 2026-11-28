import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Cpu,
  FolderLock,
  Network,
  BotMessageSquare,
  Radar,
  HelpCircle,
  Brain,
  Sparkles,
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/tracker', label: 'Smart Tracker', icon: Compass, badge: 'Capture' },
  { path: '/builder', label: 'AI Knowledge Builder', icon: Cpu, badge: 'AI' },
  { path: '/vault', label: 'Knowledge Vault', icon: FolderLock },
  { path: '/graph', label: 'Knowledge Graph', icon: Network, badge: 'Graph' },
  { path: '/brain', label: 'Ask Your Brain', icon: BotMessageSquare, badge: 'RAG' },
  { path: '/radar', label: 'Knowledge Gap Radar', icon: Radar, badge: 'Insights' },
  { path: '/quiz', label: 'Adaptive Quiz & Revision', icon: HelpCircle },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 glass-panel border-r border-slate-800/80 p-4 flex flex-col justify-between shrink-0 h-[calc(100vh-65px)] sticky top-[65px] overflow-y-auto hidden md:flex">
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
            Navigation
          </span>
          <nav className="mt-2 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600/20 text-white border border-indigo-500/40 shadow-sm shadow-indigo-500/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0 text-slate-300" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-indigo-500/20">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Feature Highlights Card */}
        <div className="p-3.5 rounded-xl bg-gradient-to-b from-indigo-950/40 to-slate-950/60 border border-indigo-500/20 text-xs text-slate-300 space-y-2">
          <div className="flex items-center gap-1.5 text-indigo-300 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Learning Intelligence</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            RecallOS tracks what you study, connects concepts, detects knowledge gaps, and schedules adaptive revisions.
          </p>
        </div>
      </div>

      {/* Footer Branding & Team Credits */}
      <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-indigo-400" />
            <span>RecallOS v1.1</span>
          </span>
          <span className="text-emerald-400 font-mono text-[10px]">React 19 + Supabase</span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/40">
          <span className="text-slate-400">Team:</span>
          <span className="text-indigo-300 font-medium">Yaswanth &amp; Surendra</span>
        </div>
      </div>
    </aside>
  );
};
