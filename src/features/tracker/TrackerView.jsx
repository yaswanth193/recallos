/**
 * Module 1: Smart Learning Tracker View
 * Captures learning activity from selected educational websites (YouTube, Medium, LeetCode, Coursera, etc.)
 * Demonstrates:
 * - Extension activity simulation
 * - Platform filters & duration tracking
 * - React Query data fetching & state management
 */
import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useRecallStore } from '../../store/useRecallStore';
import { apiService } from '../../services/apiService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotification } from '../../context/NotificationContext';
import {
  Compass,
  PlusCircle,
  ExternalLink,
  Clock,
  Laptop,
  CheckCircle2,
  Video,
  BookOpen,
  Code2,
  FileText,
  Sparkles,
  Zap,
  Camera,
  Download,
  RefreshCw,
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';

const SUPPORTED_PLATFORMS = [
  { name: 'YouTube', icon: Video, color: 'text-red-400', desc: 'Tutorials & conference talks' },
  { name: 'LeetCode', icon: Code2, color: 'text-amber-400', desc: 'DSA & algorithm problems' },
  { name: 'Medium / Dev.to', icon: BookOpen, color: 'text-emerald-400', desc: 'Deep dive engineering blogs' },
  { name: 'MDN Web Docs', icon: FileText, color: 'text-cyan-400', desc: 'RFC specifications & web APIs' },
];

export const TrackerView = () => {
  const { setCaptureModalOpen, incrementLearningTime } = useRecallStore();
  const { addNotification } = useNotification();
  const queryClient = useQueryClient();

  const [simulatingPlatform, setSimulatingPlatform] = useState(null);
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);

  // Unit V: React Query for fetching resources with live auto-refresh
  const { data: resources = [], isLoading, isFetching, refetch } = useQuery({
    queryKey: ['resources'],
    queryFn: apiService.getResources,
    refetchInterval: 3000, // Live poll Supabase every 3 seconds
  });

  // Listen for real-time Chrome Extension sync events
  React.useEffect(() => {
    const handleSync = () => {
      refetch();
      addNotification('⚡ Chrome Extension synced new resource to Knowledge Vault!', 'success');
    };
    window.addEventListener('recallos-sync-event', handleSync);
    return () => window.removeEventListener('recallos-sync-event', handleSync);
  }, [refetch, addNotification]);

  const simulateExtensionCapture = async (platform) => {
    setSimulatingPlatform(platform);
    try {
      const mockItems = {
        YouTube: {
          title: 'React 19 Hooks & Compiler: What You Need to Know',
          url: 'https://youtube.com/watch?v=react19-overview',
          platform: 'YouTube',
          domain: 'Frontend',
          tags: ['react19', 'compiler', 'hooks', 'optimization'],
          timeSpentMins: 45,
          summary: 'Overview of the React Compiler eliminating useMemo boilerplate and introducing useActionState.',
          extractedConcepts: ['React Compiler', 'Auto Memoization', 'Action States'],
        },
        LeetCode: {
          title: 'LeetCode 206: Reverse Linked List in O(N) Time and O(1) Space',
          url: 'https://leetcode.com/problems/reverse-linked-list/',
          platform: 'LeetCode',
          domain: 'Data Structures',
          tags: ['dsa', 'linked-list', 'in-place', 'pointers'],
          timeSpentMins: 35,
          summary: 'Iterative 3-pointer technique using prev, curr, and next to invert pointers without recursion overhead.',
          extractedConcepts: ['Pointers Reversal', 'Iterative Traversal', 'Constant Space'],
        },
        'Medium / Dev.to': {
          title: 'Deep Dive into React Reconciliation & Virtual DOM Diffing',
          url: 'https://medium.com/@dev/react-reconciliation-explained',
          platform: 'Medium',
          domain: 'Frontend',
          tags: ['react', 'virtual-dom', 'diffing', 'reconciliation'],
          timeSpentMins: 40,
          summary: 'Detailed explanation of key-based identification and element tree comparison algorithms.',
          extractedConcepts: ['Diffing Algorithm', 'Keys in Lists', 'Component Tree'],
        },
        'MDN Web Docs': {
          title: 'Web Fetch API, AbortController & Signal Cancellation',
          url: 'https://developer.mozilla.org/en-US/docs/Web/API/AbortController',
          platform: 'MDN Docs',
          domain: 'Frontend',
          tags: ['fetch', 'abortcontroller', 'signals', 'async'],
          timeSpentMins: 25,
          summary: 'How to cancel ongoing HTTP requests inside useEffect cleanups to prevent state updates on unmounted components.',
          extractedConcepts: ['AbortController', 'Signal Pattern', 'Cleanup in useEffect'],
        },
      };

      const payload = mockItems[platform] || mockItems['YouTube'];
      await apiService.createResource(payload);
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      incrementLearningTime(payload.timeSpentMins);
      addNotification(`Smart Tracker captured active session from ${platform}!`, 'success');
    } catch (err) {
      addNotification('Capture failed: ' + err.message, 'error');
    } finally {
      setSimulatingPlatform(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Compass className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">Smart Learning Tracker</h2>
          </div>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Automatically tracks and centralizes your scattered digital learning activities across YouTube tutorials,
            MDN specifications, LeetCode challenges, and tech articles into one unified intelligence feed.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              refetch();
              addNotification('Synced with Supabase Cloud!', 'info');
            }}
            title="Refresh resources from Supabase cloud database"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isFetching ? 'animate-spin' : ''}`} />
            <span>Sync Cloud</span>
          </button>
          <Button
            variant="emerald"
            icon={Camera}
            onClick={() => setIsExtensionModalOpen(true)}
            className="self-start md:self-auto text-xs"
          >
            Chrome Screen Extension
          </Button>
          <Button
            variant="primary"
            icon={PlusCircle}
            onClick={() => setCaptureModalOpen(true)}
            className="self-start md:self-auto text-xs"
          >
            Capture Custom URL
          </Button>
        </div>
      </div>

      {/* Chrome Screen Extension Banner */}
      <div className="glass-panel p-5 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">RecallOS Chrome Extension (Screen & Tab Capture)</h3>
              <Badge variant="success">Manifest V3</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Instantly capture visible screens, YouTube lecture frames, and code solutions directly into your Knowledge Vault.
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={Download}
          onClick={() => setIsExtensionModalOpen(true)}
          className="text-xs shrink-0 border-indigo-500/40 text-indigo-300 hover:text-white"
        >
          View Extension Setup (15s)
        </Button>
      </div>

      {/* Extension Simulator & Connected Platforms */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Laptop className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              Browser Extension Simulation & Active Source Triggers
            </h3>
          </div>
          <span className="text-xs text-slate-400">Click any source to simulate instant tab capture</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SUPPORTED_PLATFORMS.map((plat) => {
            const Icon = plat.icon;
            const isCapturing = simulatingPlatform === plat.name;
            return (
              <Card key={plat.name} className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-6 h-6 ${plat.color}`} />
                    <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Sync Active
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">{plat.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{plat.desc}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full text-xs"
                    icon={Zap}
                    isLoading={isCapturing}
                    onClick={() => simulateExtensionCapture(plat.name)}
                  >
                    Simulate Capture
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Captured Activity Stream */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            Recent Learning Stream ({resources.length} Recorded Activities)
          </h3>
          <span className="text-xs text-slate-400 font-mono">Unit V: React Query Sync</span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400">Loading learning tracker feed...</div>
        ) : (
          <div className="space-y-3">
            {resources.map((item) => (
              <Card key={item.id} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge platform={item.platform}>{item.platform}</Badge>
                    <Badge variant="primary">{item.domain}</Badge>
                    <span className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {item.timeSpentMins} mins
                    </span>
                  </div>

                  <h4 className="text-base font-semibold text-white hover:text-indigo-300 transition">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5">
                      <span>{item.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 inline" />
                    </a>
                  </h4>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{item.summary}</p>

                  {/* Extracted Concepts */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] text-slate-500 font-medium">Extracted Concepts:</span>
                    {item.extractedConcepts?.map((c, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-indigo-300 border border-slate-700/60"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400">Mastery Rating</span>
                    <div className="text-base font-bold font-mono text-emerald-400">{item.masteryScore}%</div>
                  </div>
                  <Badge variant={item.status === 'Needs Revision' ? 'danger' : 'success'}>
                    {item.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Extension Setup Modal */}
      <Modal
        isOpen={isExtensionModalOpen}
        onClose={() => setIsExtensionModalOpen(false)}
        title="RecallOS Screen & Tab Capture Extension"
        subtitle="Load the official Chrome Extension to capture educational screens & tabs directly"
        maxWidth="max-w-xl"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Extension Directory on your Machine:
            </h4>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-300 break-all select-all">
              C:\Users\ravur\.gemini\antigravity\scratch\recallos\extension
            </div>
            <p className="text-[11px] text-slate-400">
              Contains <code className="text-slate-200">manifest.json</code>, <code className="text-slate-200">background.js</code>, and <code className="text-slate-200">popup.html</code>.
            </p>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              How to Install in Chrome (3 Steps):
            </h4>
            <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside">
              <li className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                Open Google Chrome and go to <code className="text-emerald-400 font-mono">chrome://extensions/</code>
              </li>
              <li className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                Enable <strong className="text-white">"Developer mode"</strong> in the top-right corner.
              </li>
              <li className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                Click <strong className="text-white">"Load unpacked"</strong> and select the <code className="text-indigo-400 font-mono">extension</code> folder above!
              </li>
            </ol>
          </div>

          <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-300">
            📸 Once installed, click the RecallOS extension icon on any YouTube video, LeetCode problem, or article to capture the screen snapshot and save directly to your vault!
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="primary" size="sm" onClick={() => setIsExtensionModalOpen(false)}>
              Got It!
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
