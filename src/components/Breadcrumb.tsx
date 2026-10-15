import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, HardDrive, Folder } from 'lucide-react';
import { useFiles } from '../context/FileContext';

export const Breadcrumb: React.FC = () => {
  const { currentFolderId, navigateToFolder, getPath, settings } = useFiles();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const path = getPath(currentFolderId);
  const isReducedMotion = settings.animationIntensity === 'off';

  // Auto-scroll to the end of the breadcrumb when path changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: scrollContainerRef.current.scrollWidth,
        behavior: isReducedMotion ? 'auto' : 'smooth',
      });
    }
  }, [currentFolderId, path.length, isReducedMotion]);

  return (
    <div className="w-full bg-slate-100/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 py-2 px-3">
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap text-xs font-medium"
      >
        {/* Root storage item */}
        <button
          onClick={() => navigateToFolder(null)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl transition shrink-0 ${
            currentFolderId === null
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
          }`}
        >
          <HardDrive className="w-3.5 h-3.5" style={{ color: settings.accentColor }} />
          <span>Internal Storage</span>
        </button>

        {/* Path segments */}
        {path.map((segment, index) => {
          const isLast = index === path.length - 1;
          const folderColor = segment.color || settings.accentColor;

          return (
            <React.Fragment key={segment.id}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mx-0.5" />

              <motion.button
                initial={isReducedMotion ? false : { opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => navigateToFolder(segment.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl transition shrink-0 ${
                  isLast
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: folderColor }}
                />
                <span className="truncate max-w-[140px]">{segment.name}</span>
              </motion.button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
