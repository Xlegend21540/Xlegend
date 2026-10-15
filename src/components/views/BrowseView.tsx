import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  LayoutList,
  LayoutGrid,
  ArrowUpDown,
  Filter,
  CheckSquare,
  X,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  Film,
} from 'lucide-react';
import { useFiles } from '../../context/FileContext';
import { Breadcrumb } from '../Breadcrumb';
import { FileList } from '../FileList';
import { SpeedDialFAB } from '../SpeedDialFAB';
import { SortField } from '../../types';

export const BrowseView: React.FC = () => {
  const {
    items,
    currentFolderId,
    activeCategory,
    setActiveCategory,
    viewMode,
    setViewMode,
    sortField,
    setSortField,
    sortDirection,
    toggleSortDirection,
    isMultiSelect,
    setIsMultiSelect,
    setIsAIMediaStudioOpen,
    settings,
    updateSettings,
  } = useFiles();

  // Filter items in current view
  const currentItems = useMemo(() => {
    let filtered = items.filter((item) => !item.inTrash);

    // If an active category filter is selected (from Home category grid)
    if (activeCategory) {
      filtered = filtered.filter((item) => {
        if (item.type === 'folder') return false;
        if (activeCategory === 'archives') {
          return item.extension === 'apk' || item.extension === 'zip' || item.category === 'archives';
        }
        return item.category === activeCategory;
      });
    } else {
      // Normal folder browsing
      filtered = filtered.filter((item) => item.parentId === currentFolderId);
    }

    // Hidden files filter
    if (!settings.showHidden) {
      filtered = filtered.filter((item) => !item.isHidden);
    }

    // System Root Files filter: only visible when rootExplorerEnabled is true
    if (!settings.rootExplorerEnabled) {
      filtered = filtered.filter((item) => !item.isSystemFile);
    }

    // Sort items: folders first, then files
    return filtered.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1;
      }

      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
          break;
        case 'date':
          comparison = b.updatedAt - a.updatedAt;
          break;
        case 'size':
          comparison = (b.size || 0) - (a.size || 0);
          break;
        case 'type':
          comparison = (a.extension || '').localeCompare(b.extension || '');
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [items, currentFolderId, activeCategory, settings.showHidden, sortField, sortDirection]);

  return (
    <div className="pb-28">
      {/* 1. Pinned Breadcrumb (unless filtering by category) */}
      {!activeCategory ? (
        <div className="sticky top-14 z-20 -mx-4 mb-3">
          <Breadcrumb />
        </div>
      ) : (
        <div className="sticky top-14 z-20 -mx-4 mb-3 bg-blue-50/90 dark:bg-blue-950/80 backdrop-blur-md px-4 py-2 border-b border-blue-200/60 dark:border-blue-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-900 dark:text-blue-100 uppercase tracking-wider">
              Category:
            </span>
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 capitalize">
              {activeCategory}
            </span>
          </div>
          <button
            onClick={() => setActiveCategory(null)}
            className="flex items-center gap-1 text-xs font-bold text-blue-700 dark:text-blue-300 hover:text-blue-900"
          >
            <span>Show all</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* AI Studio Category Quick Action Banner */}
      {activeCategory === 'videos' && (
        <div className="mb-3.5 p-3.5 rounded-3xl bg-linear-to-r from-purple-500/15 via-indigo-500/10 to-transparent border border-purple-200/80 dark:border-purple-800/60 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Film className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>AI Video Editor</span>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-full bg-purple-600 text-white font-extrabold tracking-wider">
                  Gemini
                </span>
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Trim, speed control, color grading, and AI subtitles
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAIMediaStudioOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs shrink-0 active:scale-95 transition"
          >
            Open Studio
          </button>
        </div>
      )}

      {activeCategory === 'images' && (
        <div className="mb-3.5 p-3.5 rounded-3xl bg-linear-to-r from-orange-500/15 via-pink-500/10 to-transparent border border-orange-200/80 dark:border-orange-800/60 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>AI Photo Studio</span>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-full bg-orange-600 text-white font-extrabold tracking-wider">
                  Gemini
                </span>
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Smart retouching, aesthetics review, and custom AI filter styles
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAIMediaStudioOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-xs shrink-0 active:scale-95 transition"
          >
            Open Studio
          </button>
        </div>
      )}

      {/* 2. Toolbar: View mode, Sort, Multi-select, Hidden toggle */}
      <div className="flex items-center justify-between py-1 mb-2">
        <div className="flex items-center gap-2">
          {/* Sort dropdown */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800/80 rounded-xl px-2.5 py-1 border border-slate-200/80 dark:border-slate-700/80 text-xs shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="bg-transparent border-0 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="name">Name</option>
              <option value="date">Date</option>
              <option value="size">Size</option>
              <option value="type">Type</option>
            </select>
            <button
              onClick={toggleSortDirection}
              className="font-mono font-bold text-[10px] text-slate-500 hover:text-slate-900 dark:hover:text-white px-1"
              title="Toggle sort direction"
            >
              {sortDirection === 'asc' ? '↑' : '↓'}
            </button>
          </div>

          {/* Show hidden toggle button */}
          <button
            onClick={() => updateSettings({ showHidden: !settings.showHidden })}
            className={`p-1.5 rounded-xl border transition ${
              settings.showHidden
                ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-400'
                : 'bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
            title={settings.showHidden ? 'Hidden files visible' : 'Hidden files hidden'}
          >
            {settings.showHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* View mode toggle & Select button */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsMultiSelect(!isMultiSelect)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold border transition ${
              isMultiSelect
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Select</span>
          </button>

          <div className="flex items-center bg-white dark:bg-slate-800/80 rounded-xl p-0.5 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'list'
                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="List View"
            >
              <LayoutList className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Items Counter */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium px-1 mb-2">
        <span className="tabular-nums">
          {currentItems.length} {currentItems.length === 1 ? 'item' : 'items'}
        </span>
        {settings.rootExplorerEnabled && (
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Root Explorer Mode (Shizuku / su)</span>
          </div>
        )}
      </div>

      {/* 4. Files & Folders */}
      <FileList items={currentItems} />

      {/* 5. Speed Dial Floating Action Button */}
      <SpeedDialFAB />
    </div>
  );
};
