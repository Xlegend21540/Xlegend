import React from 'react';
import { motion } from 'motion/react';
import { Folder, Star, ChevronRight } from 'lucide-react';
import { useFiles } from '../context/FileContext';
import { FSItem } from '../types';

export const FavoriteFolders: React.FC = () => {
  const { items, navigateToFolder, settings } = useFiles();
  const isReducedMotion = settings.animationIntensity === 'off';

  // Get favorite or pinned folders
  const favFolders = React.useMemo(() => {
    return items.filter(
      (i) => !i.inTrash && i.type === 'folder' && (i.isFavorite || i.isPinnedHome)
    );
  }, [items]);

  if (favFolders.length === 0) return null;

  const getFolderChildCount = (folderId: string) => {
    return items.filter(
      (i) => i.parentId === folderId && !i.inTrash && (settings.showHidden || !i.isHidden)
    ).length;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        <div className="flex items-center gap-1.5">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Favorite folders</h3>
        </div>
        <span className="text-xs text-slate-400 tabular-nums">{favFolders.length} folders</span>
      </div>

      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
        {favFolders.map((folder, idx) => {
          const childCount = getFolderChildCount(folder.id);
          const folderColor = folder.color || settings.accentColor;

          return (
            <motion.button
              key={folder.id}
              initial={isReducedMotion ? false : { opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              whileHover={isReducedMotion ? undefined : { scale: 1.02 }}
              whileTap={isReducedMotion ? undefined : { scale: 0.95 }}
              onClick={() => navigateToFolder(folder.id)}
              className="oneui-card shrink-0 flex items-center gap-3 px-3.5 py-2.5 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition group focus:outline-none"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                style={{
                  backgroundColor: `${folderColor}20`,
                  color: folderColor,
                }}
              >
                <Folder className="w-5 h-5 fill-current" />
              </div>

              <div className="text-left min-w-0 pr-1">
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block truncate max-w-[120px]">
                  {folder.name}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block tabular-nums">
                  {childCount} {childCount === 1 ? 'item' : 'items'}
                </span>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-transform group-hover:translate-x-0.5" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
