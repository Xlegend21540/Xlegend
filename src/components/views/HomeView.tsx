import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  Folder,
  File,
  ArrowRight,
  Clock,
  Trash2,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { useFiles } from '../../context/FileContext';
import { StorageCard } from '../StorageCard';
import { CategoryGrid } from '../CategoryGrid';
import { RecentFiles } from '../RecentFiles';
import { FavoriteFolders } from '../FavoriteFolders';
import { formatBytes, formatDate } from '../../utils/formatters';
import {
  getRecentSearches,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
} from '../../utils/recentSearches';

export const HomeView: React.FC = () => {
  const {
    items,
    settings,
    searchQuery,
    setSearchQuery,
    navigateToFolder,
    setItemForViewer,
  } = useFiles();

  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isReducedMotion = settings.animationIntensity === 'off';

  // Load recent searches from localStorage
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Close search overlay on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (!searchQuery.trim()) {
          setIsFocused(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchQuery]);

  // Search filter
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        !item.inTrash &&
        item.name.toLowerCase().includes(q) &&
        (settings.showHidden || !item.isHidden)
    );
  }, [items, searchQuery, settings.showHidden]);

  const handleSelectRecentTerm = (term: string) => {
    setSearchQuery(term);
    const updated = addRecentSearch(term);
    setRecentSearches(updated);
  };

  const handleRemoveRecentTerm = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    const updated = removeRecentSearch(term);
    setRecentSearches(updated);
  };

  const handleClearAllRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearRecentSearches();
    setRecentSearches([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const updated = addRecentSearch(searchQuery.trim());
      setRecentSearches(updated);
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      setSearchQuery('');
      inputRef.current?.blur();
    }
  };

  const handleResultClick = (item: (typeof items)[0]) => {
    if (searchQuery.trim()) {
      const updated = addRecentSearch(searchQuery.trim());
      setRecentSearches(updated);
    }
    if (item.type === 'folder') {
      navigateToFolder(item.id);
    } else {
      setItemForViewer(item);
    }
  };

  const isSearchActive = isFocused || searchQuery.trim().length > 0;

  return (
    <div ref={containerRef} className="space-y-6 pb-24">
      {/* 1. Search Bar */}
      <div className="relative z-30">
        <div className="relative flex items-center">
          {isSearchActive ? (
            <button
              onClick={() => {
                setIsFocused(false);
                setSearchQuery('');
                inputRef.current?.blur();
              }}
              className="absolute left-3 p-1.5 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-700/60 text-slate-600 dark:text-slate-300 transition"
              aria-label="Exit search"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
          )}

          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onFocus={() => setIsFocused(true)}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search files, folders and extensions..."
            className={`w-full ${
              isSearchActive ? 'pl-11 pr-20' : 'pl-11 pr-10'
            } py-3.5 rounded-3xl oneui-card border ${
              isSearchActive
                ? 'border-blue-500 ring-2 ring-blue-500/20'
                : 'border-slate-200/70 dark:border-slate-800/80'
            } text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none shadow-xs transition`}
          />

          <div className="absolute right-3.5 flex items-center gap-1.5">
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  inputRef.current?.focus();
                }}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {isSearchActive && !searchQuery && (
              <button
                onClick={() => {
                  setIsFocused(false);
                  inputRef.current?.blur();
                }}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 px-1 py-0.5"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Recent Searches Overlay (appears when focused and query is empty) */}
        <AnimatePresence>
          {isFocused && !searchQuery.trim() && (
            <motion.div
              initial={isReducedMotion ? false : { opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={isReducedMotion ? undefined : { opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="absolute left-0 right-0 top-full mt-2 oneui-card rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xl z-40 overflow-hidden"
            >
              <div className="flex items-center justify-between pb-2.5 mb-1 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Recent Searches
                  </span>
                </div>
                {recentSearches.length > 0 && (
                  <button
                    onClick={handleClearAllRecent}
                    className="text-xs font-semibold text-red-500 hover:text-red-600 dark:text-red-400 px-2 py-0.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {recentSearches.length === 0 ? (
                <div className="py-6 text-center">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-2 text-slate-400">
                    <Clock className="w-5 h-5 opacity-60" />
                  </div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    No recent searches
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Search for files or try suggestions below
                  </p>

                  {/* Suggestion Chips */}
                  <div className="flex items-center justify-center flex-wrap gap-1.5 mt-3">
                    {['test.txt', 'Camera', 'Sunset', 'Roadmap', 'apk'].map((sug) => (
                      <button
                        key={sug}
                        onClick={() => handleSelectRecentTerm(sug)}
                        className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-64 overflow-y-auto">
                  {recentSearches.map((term) => (
                    <div
                      key={term}
                      onClick={() => handleSelectRecentTerm(term)}
                      className="flex items-center justify-between py-2 px-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl cursor-pointer transition group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                        <Clock className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors shrink-0" />
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {term}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleRemoveRecentTerm(e, term)}
                        className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition"
                        title="Remove term"
                        aria-label={`Remove ${term}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* If Searching, show search results */}
      {searchQuery.trim() ? (
        <div className="oneui-card rounded-3xl p-5 border border-slate-200/70 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Search Results</h3>
            <span className="text-xs text-slate-400 tabular-nums">
              {searchResults.length} {searchResults.length === 1 ? 'match' : 'matches'}
            </span>
          </div>

          {searchResults.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No files or folders matched &quot;{searchQuery}&quot;
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[60vh] overflow-y-auto">
              {searchResults.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleResultClick(item)}
                  className="flex items-center justify-between py-2.5 px-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl cursor-pointer transition group"
                >
                  <div className="flex items-center gap-3 min-w-0 mr-2">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor:
                          item.type === 'folder'
                            ? `${item.color || settings.accentColor}18`
                            : '#F1F5F9',
                        color:
                          item.type === 'folder'
                            ? item.color || settings.accentColor
                            : '#64748B',
                      }}
                    >
                      {item.type === 'folder' ? (
                        <Folder className="w-5 h-5 fill-current" />
                      ) : (
                        <File className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        {item.type === 'folder' ? 'Folder' : formatBytes(item.size, settings.sizeUnit)} ·{' '}
                        {formatDate(item.updatedAt)}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* 2. Storage Card */}
          <StorageCard />

          {/* 3. Category Grid */}
          <CategoryGrid />

          {/* 4. Recent Files Horizontal Carousel */}
          <RecentFiles />

          {/* 5. Favorite Folders Row */}
          <FavoriteFolders />
        </>
      )}
    </div>
  );
};
