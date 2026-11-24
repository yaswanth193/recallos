/**
 * Unit VI: Global State Management with Zustand
 * Demonstrates:
 * - Centralized store with slice-based separation of concerns
 * - Immutable state updates
 * - Action dispatchers & selector subscriptions
 * - Clear distinction: Global Client State (Zustand) vs Server State (React Query) vs Local State (useState)
 */
import { create } from 'zustand';
import { MOCK_BRAIN_KNOWLEDGE_BASE } from '../services/mockData';

export const useRecallStore = create((set, get) => ({
  // Filter & Search State
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  selectedPlatform: 'all',
  setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),

  selectedDomain: 'all',
  setSelectedDomain: (domain) => set({ selectedDomain: domain }),

  selectedStatus: 'all',
  setSelectedStatus: (status) => set({ selectedStatus: status }),

  // Graph Inspection State
  activeGraphNode: null,
  setActiveGraphNode: (node) => set({ activeGraphNode: node }),

  // UI Modals & Drawers
  isCaptureModalOpen: false,
  setCaptureModalOpen: (isOpen) => set({ isCaptureModalOpen: isOpen }),

  isDatabaseModalOpen: false,
  setDatabaseModalOpen: (isOpen) => set({ isDatabaseModalOpen: isOpen }),

  isSyllabusModalOpen: false,
  setSyllabusModalOpen: (isOpen) => set({ isSyllabusModalOpen: isOpen }),

  activeSyllabusUnit: 'Unit I',
  setActiveSyllabusUnit: (unit) => set({ activeSyllabusUnit: unit }),

  // Ask Your Brain Chat State
  brainMessages: [
    {
      id: 'msg-0',
      sender: 'assistant',
      text: 'Hello! I am your RecallOS Brain Assistant. Ask me anything about your saved notes, courses, YouTube videos, or concepts, and I will cite the exact sources from your knowledge vault.',
      timestamp: new Date().toISOString(),
      citations: [
        { source: 'RecallOS Knowledge Vault', platform: 'Vault', anchor: 'All Indexed Resources' }
      ]
    }
  ],
  isBrainThinking: false,
  askBrainQuery: (userQuery, scope = 'all') => {
    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userQuery,
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      brainMessages: [...state.brainMessages, userMsg],
      isBrainThinking: true,
    }));

    // Simulate intelligent RAG matching against indexed knowledge
    setTimeout(() => {
      const lower = userQuery.toLowerCase();
      const matched = MOCK_BRAIN_KNOWLEDGE_BASE.find((entry) =>
        entry.keywords.some((kw) => lower.includes(kw))
      );

      const aiResponse = matched
        ? matched.answer
        : `Based on your collected learning resources in "${scope}", here is the synthesized takeaway: When learning ${userQuery}, ensure you connect the low-level execution semantics with practical application patterns. Review your saved notes for full contextual depth.`;

      const aiCitations = matched
        ? matched.citations
        : [
            { source: 'Recent Saved Resources', platform: 'Vault', anchor: 'Top Matching Document' }
          ];

      const assistantMsg = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: aiResponse,
        timestamp: new Date().toISOString(),
        citations: aiCitations,
      };

      set((state) => ({
        brainMessages: [...state.brainMessages, assistantMsg],
        isBrainThinking: false,
      }));
    }, 850);
  },
  clearBrainHistory: () =>
    set({
      brainMessages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: 'Memory refreshed. Ask another question about your learning vault!',
          timestamp: new Date().toISOString(),
          citations: [],
        },
      ],
    }),

  // Protected Route State (Unit V Practical 13)
  isProAuthorized: true,
  toggleProAuthorization: () =>
    set((state) => ({ isProAuthorized: !state.isProAuthorized })),

  // User Profile & Gamified Stats
  userStats: {
    name: 'Yaswanth',
    streakDays: 14,
    totalMinutesLearned: 385,
    todayMinutes: 45,
    conceptsMastered: 18,
    activeGaps: 3,
    level: 'Advanced Scholar',
  },
  incrementLearningTime: (mins) =>
    set((state) => ({
      userStats: {
        ...state.userStats,
        todayMinutes: state.userStats.todayMinutes + mins,
        totalMinutesLearned: state.userStats.totalMinutesLearned + mins,
      },
    })),
}));
