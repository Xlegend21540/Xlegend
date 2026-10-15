import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Search, Trash2, CheckSquare, X, Check, MoreVertical, Sparkles } from 'lucide-react';
import { useFiles } from '../context/FileContext';

interface HeaderProps {
  scrollOffset?: number;
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  scrollOffset = 0,
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
}) => {
  const {
    isMultiSelect,
    selectedItemIds,
    clearSelection,
    selectAll,
    deleteSelected,
    items,
    currentFolderId,
    setIsTrashOpen,
    setIsAIMediaStudioOpen,
    settings,
  } = useFiles();

  // Calculate collapse ratio based on scroll
  const collapseRatio = Math.min(1, Math.max(0, scrollOffset / 70));
  const isReducedMotion = settings.animationIntensity === 'off';

  // Trash count
  const trashCount = items.filter((i) => i.inTrash).length;

  // If in multi-select mode, render top contextual action bar
  if (isMultiSelect) {
    return (
      <header className="sticky top-0 z-40 w-full bg-white dark:bg-[#161D26] border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={clearSelection}
              className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95"
              aria-label="Cancel Selection"
            >
              <X className="w-5 h-5 text-slate-700 dark:text-slate-200" />
            </button>
            <span className="font-semibold text-base text-slate-900 dark:text-white">
              {selectedItemIds.size} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={selectAll}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            >
              Select all
            </button>
            {selectedItemIds.size > 0 && (
              <button
                onClick={deleteSelected}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-full transition active:scale-95"
                title="Delete selected"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 w-full oneui-glass border-b border-slate-200/60 dark:border-slate-800/60 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4">
        {/* Compact Bar (always visible at top, 56px) */}
        <div className="h-14 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {showBack && (
              <button
                onClick={onBack}
                className="p-2 -ml-2 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition active:scale-90"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-slate-800 dark:text-slate-100" />
              </button>
            )}

            {/* Compact title that fades in as user scrolls down */}
            <div
              className="min-w-0 transition-opacity duration-200"
              style={{
                opacity: collapseRatio,
                transform: `translateY(${(1 - collapseRatio) * 6}px)`,
              }}
            >
              <h2 className="text-base font-bold text-slate-900 dark:text-white truncate">
                {title}
              </h2>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-1 shrink-0">
            {rightAction}

            <button
              onClick={() => setIsAIMediaStudioOpen(true)}
              className="p-2.5 rounded-full hover:bg-purple-100/60 dark:hover:bg-purple-950/60 transition active:scale-90 text-purple-600 dark:text-purple-400"
              aria-label="AI Video & Photo Studio"
              title="AI Video & Photo Studio"
            >
              <Sparkles className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsTrashOpen(true)}
              className="relative p-2.5 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition active:scale-90 text-slate-700 dark:text-slate-300"
              aria-label="Trash Bin"
              title="Trash"
            >
              <Trash2 className="w-5 h-5" />
              {trashCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
              )}
            </button>
          </div>
        </div>

        {/* Large One UI Title Area (collapses smoothly with scroll) */}
        <div
          className="overflow-hidden transition-all duration-150"
          style={{
            height: isReducedMotion ? (scrollOffset > 50 ? '0px' : 'auto') : `${Math.max(0, 64 * (1 - collapseRatio))}px`,
            opacity: Math.max(0, 1 - collapseRatio * 1.4),
            transform: `scale(${1 - collapseRatio * 0.08})`,
            transformOrigin: 'left bottom',
          }}
        >
          <div className="pb-3 pt-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
