/**
 * Module 3: Personal Knowledge Vault
 * Centralized, searchable repository of all learning resources, notes, and concepts.
 * Demonstrates:
 * - Unit I: Array methods (filter, map) & immutability
 * - Unit III: Derived state with useMemo & debounce search with useDebounce
 * - Unit V: React Query data fetching, caching, and mutation
 */
import React, { useState, useMemo } from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { SearchInput } from '../../components/common/SearchInput';
import { ProgressBar } from '../../components/common/ProgressBar';
import { ResourceDetailModal } from './ResourceDetailModal';
import { useRecallStore } from '../../store/useRecallStore';
import { useDebounce } from '../../hooks/useDebounce';
import { apiService } from '../../services/apiService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotification } from '../../context/NotificationContext';
import {
  FolderLock,
  PlusCircle,
  ExternalLink,
  Clock,
  Calendar,
  Filter,
  Trash2,
  Eye,
  BookOpen,
} from 'lucide-react';

const PLATFORMS = ['all', 'YouTube', 'Medium', 'Coursera', 'LeetCode', 'MDN Docs', 'Dev.to', 'GitHub', 'PDF / Document'];
const DOMAINS = ['all', 'Frontend', 'Backend', 'Data Structures', 'System Design'];
const STATUSES = ['all', 'Mastered', 'Needs Revision', 'Reviewing'];

export const VaultView = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedPlatform,
    setSelectedPlatform,
    selectedDomain,
    setSelectedDomain,
    selectedStatus,
    setSelectedStatus,
    setCaptureModalOpen,
  } = useRecallStore();

  const { addNotification } = useNotification();
  const queryClient = useQueryClient();

  const [selectedResource, setSelectedResource] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Unit III: Custom debounce hook for search query
  const debouncedSearch = useDebounce(searchQuery, 250);

  // Unit V: React Query with live background polling
  const { data: resources = [], isLoading, isFetching, refetch } = useQuery({
    queryKey: ['resources'],
    queryFn: apiService.getResources,
    refetchInterval: 5000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiService.deleteResource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      addNotification('Resource removed from Knowledge Vault', 'info');
    },
  });

  // Unit I & Unit III: Derived state filtering with useMemo
  const filteredResources = useMemo(() => {
    return resources.filter((item) => {
      const matchPlatform = selectedPlatform === 'all' || item.platform === selectedPlatform;
      const matchDomain = selectedDomain === 'all' || item.domain === selectedDomain;
      const matchStatus = selectedStatus === 'all' || item.status === selectedStatus;

      const q = debouncedSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q)) ||
        item.extractedConcepts?.some((c) => c.toLowerCase().includes(q));

      return matchPlatform && matchDomain && matchStatus && matchSearch;
    });
  }, [resources, selectedPlatform, selectedDomain, selectedStatus, debouncedSearch]);

  const handleOpenDetail = (resource) => {
    setSelectedResource(resource);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
              <FolderLock className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight">Personal Knowledge Vault</h2>
          </div>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Your single, permanent digital brain. Every tutorial, research paper, video, and notes archive
            is indexed with retention timelines and spaced revision metadata.
          </p>
        </div>
        <Button variant="primary" icon={PlusCircle} onClick={() => setCaptureModalOpen(true)}>
          Add Resource
        </Button>
      </div>

      {/* Filters Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="w-full sm:w-80">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder="Search vault notes, tags..."
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>Showing:</span>
            <span className="font-bold text-white">{filteredResources.length}</span>
            <span>of {resources.length} items</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Platform:
          </span>
          {PLATFORMS.map((plat) => (
            <button
              key={plat}
              onClick={() => setSelectedPlatform(plat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                selectedPlatform === plat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {plat === 'all' ? 'All Platforms' : plat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mr-1">
            Status:
          </span>
          {STATUSES.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                selectedStatus === st
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {st === 'all' ? 'All Status' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Resources */}
      {isLoading ? (
        <div className="p-16 text-center text-slate-400">Loading your knowledge vault...</div>
      ) : filteredResources.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-semibold text-white">No Matching Resources</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search filters or capture a new learning link to start building your vault.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((item) => (
            <Card
              key={item.id}
              onClick={() => handleOpenDetail(item)}
              className="flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge platform={item.platform}>{item.platform}</Badge>
                  <Badge variant={item.status === 'Needs Revision' ? 'danger' : 'success'}>
                    {item.status}
                  </Badge>
                </div>

                <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition line-clamp-2">
                  {item.title}
                </h4>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>

                {/* Extracted Concept Tags */}
                <div className="flex flex-wrap gap-1">
                  {item.extractedConcepts?.slice(0, 3).map((c, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 space-y-2">
                <ProgressBar
                  value={item.masteryScore}
                  size="sm"
                  label="Mastery"
                  color={item.masteryScore < 60 ? 'rose' : 'emerald'}
                />

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <Clock className="w-3 h-3" /> {item.timeSpentMins}m
                  </span>
                  <span className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1 text-[11px]">
                    <Eye className="w-3.5 h-3.5" /> Inspect
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <ResourceDetailModal
        resource={selectedResource}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onDelete={(id) => deleteMutation.mutate(id)}
      />
    </div>
  );
};
