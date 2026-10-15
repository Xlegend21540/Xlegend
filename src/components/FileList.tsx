import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Folder,
  File,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Archive,
  MoreVertical,
  Check,
  Star,
  Plus,
} from 'lucide-react';
import { useFiles } from '../context/FileContext';
import { FSItem } from '../types';
import { formatBytes, formatDate } from '../utils/formatters';

interface FileListProps {
  items: FSItem[];
  isLoading?: boolean;
}

export const FileList: React.FC<FileListProps> = ({ items, isLoading = false }) => {
  const {
    viewMode,
    navigateToFolder,
    setItemForViewer,
    setActiveItemForMenu,
    isMultiSelect,
    setIsMultiSelect,
    selectedItemIds,
    toggleSelectItem,
    settings,
    setIsNewFolderModalOpen,
  } = useFiles();

  const isReducedMotion = settings.animationIntensity === 'off';
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle long press to enter multi-select
  const handleTouchStart = (item: FSItem) => {
    longPressTimerRef.current = setTimeout(() => {
      setIsMultiSelect(true);
      toggleSelectItem(item.id);
    }, 450);
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleItemClick = (item: FSItem) => {
    if (isMultiSelect) {
      toggleSelectItem(item.id);
      return;
    }

    if (item.type === 'folder') {
      navigateToFolder(item.id);
    } else {
      setItemForViewer(item);
    }
  };

  const renderFileIcon = (item: FSItem) => {
    if (item.type === 'folder') {
      const color = item.color || settings.accentColor;
      return (
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
          style={{
            backgroundColor: `${color}18`,
            color: color,
          }}
        >
          <Folder className="w-5 h-5 fill-current" />
        </div>
      );
    }

    if (item.category === 'images' && item.url) {
      return (
        <div className="w-10 h-10 rounded-2xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
          <img src={item.url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
        </div>
      );
    }

    let IconComp = File;
    let iconColor = 'text-slate-500';
    let bgColor = 'bg-slate-100 dark:bg-slate-800';

    switch (item.category) {
      case 'images':
        IconComp = ImageIcon;
        iconColor = 'text-orange-500';
        bgColor = 'bg-orange-50 dark:bg-orange-950/30';
        break;
      case 'videos':
        IconComp = Video;
        iconColor = 'text-purple-500';
        bgColor = 'bg-purple-50 dark:bg-purple-950/30';
        break;
      case 'audio':
        IconComp = Music;
        iconColor = 'text-pink-500';
        bgColor = 'bg-pink-50 dark:bg-pink-950/30';
        break;
      case 'documents':
        IconComp = FileText;
        iconColor = 'text-emerald-500';
        bgColor = 'bg-emerald-50 dark:bg-emerald-950/30';
        break;
      case 'archives':
        IconComp = Archive;
        iconColor = 'text-blue-500';
        bgColor = 'bg-blue-50 dark:bg-blue-950/30';
        break;
    }

    return (
      <div
        className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${bgColor} ${iconColor} transition-transform group-hover:scale-105`}
      >
        <IconComp className="w-5 h-5" />
      </div>
    );
  };

  // Empty folder state
  if (items.length === 0) {
    return (
      <motion.div
        initial={isReducedMotion ? false : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center py-16 px-4 text-center"
      >
        <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center mb-4 text-slate-400">
          <Folder className="w-10 h-10 opacity-60" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">This folder is empty</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
          Tap the + button to create a new folder, create a document, or upload files from your device.
        </p>
        <button
          onClick={() => setIsNewFolderModalOpen(true)}
          className="mt-5 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold text-white shadow-sm transition active:scale-95"
          style={{ backgroundColor: settings.accentColor }}
        >
          <Plus className="w-4 h-4" />
          Create New Folder
        </button>
      </motion.div>
    );
  }

  // Grid View
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 py-2">
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => {
            const isSelected = selectedItemIds.has(item.id);
            const folderColor = item.color || settings.accentColor;

            return (
              <motion.div
                key={item.id}
                layout={!isReducedMotion}
                initial={isReducedMotion ? false : { opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={isReducedMotion ? undefined : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25, delay: index * 0.02 }}
                whileHover={isReducedMotion ? undefined : { y: -2 }}
                whileTap={isReducedMotion ? undefined : { scale: 0.96 }}
                onTouchStart={() => handleTouchStart(item)}
                onTouchEnd={handleTouchEnd}
                onMouseDown={() => handleTouchStart(item)}
                onMouseUp={handleTouchEnd}
                onClick={() => handleItemClick(item)}
                className={`oneui-card relative rounded-3xl p-3 border transition cursor-pointer select-none flex flex-col justify-between ${
                  isSelected
                    ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                    : 'border-slate-200/70 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Checkbox (in multi-select mode) */}
                {isMultiSelect && (
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-blue-600 text-white' : 'border-2 border-slate-300 bg-white dark:bg-slate-800'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                )}

                {/* More action button (when not in multi-select) */}
                {!isMultiSelect && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveItemForMenu(item);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition z-10"
                    aria-label="Item menu"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                )}

                {/* Preview / Icon Slot */}
                <div className="w-full h-24 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center mb-2 overflow-hidden">
                  {item.type === 'folder' ? (
                    <Folder className="w-12 h-12 fill-current" style={{ color: folderColor }} />
                  ) : item.category === 'images' && item.url ? (
                    <img src={item.url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="scale-125">{renderFileIcon(item)}</div>
                  )}
                </div>

                {/* Metadata */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    {item.isFavorite && (
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                    )}
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate" title={item.name}>
                      {item.name}
                    </h4>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {item.type === 'folder' ? 'Folder' : formatBytes(item.size, settings.sizeUnit)} ·{' '}
                    {formatDate(item.updatedAt)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    );
  }

  // List View (Default One UI Layout)
  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800/60 py-1">
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => {
          const isSelected = selectedItemIds.has(item.id);

          return (
            <motion.div
              key={item.id}
              layout={!isReducedMotion}
              initial={isReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={isReducedMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.2, delay: index * 0.015 }}
              whileTap={isReducedMotion ? undefined : { scale: 0.98 }}
              onTouchStart={() => handleTouchStart(item)}
              onTouchEnd={handleTouchEnd}
              onMouseDown={() => handleTouchStart(item)}
              onMouseUp={handleTouchEnd}
              onClick={() => handleItemClick(item)}
              className={`flex items-center justify-between px-3 py-3 rounded-2xl transition cursor-pointer select-none group ${
                isSelected
                  ? 'bg-blue-50/70 dark:bg-blue-950/40'
                  : 'hover:bg-white dark:hover:bg-slate-800/40 active:bg-slate-100 dark:active:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1 mr-2">
                {/* Selection Checkbox */}
                {isMultiSelect ? (
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? 'bg-blue-600 text-white' : 'border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                ) : (
                  renderFileIcon(item)
                )}

                {/* Name & Subtitle */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4
                      className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate"
                      title={item.name}
                    >
                      {item.name}
                    </h4>
                    {item.isFavorite && (
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.permissions && (
                      <>
                        <span className="font-mono text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded font-semibold">
                          {item.permissions}
                        </span>
                        <span>·</span>
                      </>
                    )}
                    {item.type === 'file' && (
                      <>
                        <span className="tabular-nums">{formatBytes(item.size, settings.sizeUnit)}</span>
                        <span>·</span>
                      </>
                    )}
                    <span>{formatDate(item.updatedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Right menu button */}
              {!isMultiSelect && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveItemForMenu(item);
                  }}
                  className="p-2 -mr-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition active:scale-90"
                  aria-label="Options"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
