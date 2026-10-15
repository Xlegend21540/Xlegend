import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Folder, File, ArrowUp, ArrowDown, ChevronRight } from 'lucide-react';
import { useFiles } from '../../context/FileContext';
import { FSItem } from '../../types';
import { formatBytes, formatDate } from '../../utils/formatters';

export const FavoritesView: React.FC = () => {
  const {
    items,
    navigateToFolder,
    setItemForViewer,
    toggleFavorite,
    reorderFavorites,
    settings,
  } = useFiles();

  const [filterType, setFilterType] = useState<'all' | 'folders' | 'files'>('all');
  const isReducedMotion = settings.animationIntensity === 'off';

  // Extract favorite items
  const favorites = React.useMemo(() => {
    let list = items.filter((i) => i.isFavorite && !i.inTrash);
    if (filterType === 'folders') list = list.filter((i) => i.type === 'folder');
    if (filterType === 'files') list = list.filter((i) => i.type === 'file');
    return list;
  }, [items, filterType]);

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newList = [...favorites];
    const temp = newList[index - 1];
    newList[index - 1] = newList[index];
    newList[index] = temp;
    reorderFavorites(newList);
  };

  const handleMoveDown = (index: number) => {
    if (index === favorites.length - 1) return;
    const newList = [...favorites];
    const temp = newList[index + 1];
    newList[index + 1] = newList[index];
    newList[index] = temp;
    reorderFavorites(newList);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Segmented Filter Control */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 dark:bg-slate-800/80 rounded-2xl max-w-xs">
        <button
          onClick={() => setFilterType('all')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition ${
            filterType === 'all'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterType('folders')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition ${
            filterType === 'folders'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Folders
        </button>
        <button
          onClick={() => setFilterType('files')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition ${
            filterType === 'files'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Files
        </button>
      </div>

      {/* Empty State */}
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/30 text-amber-500 flex items-center justify-center mb-3">
            <Star className="w-8 h-8 fill-amber-500/20" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">No favorites yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
            Star items in Browse or Home to keep your frequently accessed folders and files right here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {favorites.map((item, index) => {
              const folderColor = item.color || settings.accentColor;

              return (
                <motion.div
                  key={item.id}
                  layout={!isReducedMotion}
                  initial={isReducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={isReducedMotion ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="oneui-card rounded-2xl p-3 border border-slate-200/70 dark:border-slate-800/80 flex items-center justify-between gap-3 group"
                >
                  {/* Reorder Buttons */}
                  <div className="flex flex-col items-center gap-0.5 text-slate-400 shrink-0">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-1 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 transition"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === favorites.length - 1}
                      className="p-1 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 transition"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Main clickable target */}
                  <div
                    onClick={() => {
                      if (item.type === 'folder') {
                        navigateToFolder(item.id);
                      } else {
                        setItemForViewer(item);
                      }
                    }}
                    className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                  >
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor:
                          item.type === 'folder'
                            ? `${folderColor}18`
                            : '#F1F5F9',
                        color:
                          item.type === 'folder'
                            ? folderColor
                            : '#64748B',
                      }}
                    >
                      {item.type === 'folder' ? (
                        <Folder className="w-5 h-5 fill-current" />
                      ) : (
                        <File className="w-5 h-5" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {item.type === 'folder' ? 'Folder' : formatBytes(item.size, settings.sizeUnit)} ·{' '}
                        {formatDate(item.updatedAt)}
                      </p>
                    </div>
                  </div>

                  {/* Unstar button */}
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className="p-2 text-amber-500 hover:text-amber-600 transition shrink-0 active:scale-90"
                    title="Remove from favorites"
                  >
                    <Star className="w-5 h-5 fill-current" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
