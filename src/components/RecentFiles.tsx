import React from 'react';
import { motion } from 'motion/react';
import { File, FileText, Image, Video, Music, Archive, Eye } from 'lucide-react';
import { useFiles } from '../context/FileContext';
import { FSItem } from '../types';
import { formatBytes, formatDate } from '../utils/formatters';

export const RecentFiles: React.FC = () => {
  const { items, setItemForViewer, settings } = useFiles();
  const isReducedMotion = settings.animationIntensity === 'off';

  // Get recent 8 files sorted by updatedAt
  const recentFiles = React.useMemo(() => {
    return items
      .filter((i) => !i.inTrash && i.type === 'file' && (settings.showHidden || !i.isHidden))
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 8);
  }, [items, settings.showHidden]);

  if (recentFiles.length === 0) return null;

  const renderIcon = (file: FSItem) => {
    switch (file.category) {
      case 'images':
        return <Image className="w-5 h-5 text-orange-500" />;
      case 'videos':
        return <Video className="w-5 h-5 text-purple-500" />;
      case 'audio':
        return <Music className="w-5 h-5 text-pink-500" />;
      case 'documents':
        return <FileText className="w-5 h-5 text-emerald-500" />;
      case 'archives':
        return <Archive className="w-5 h-5 text-blue-500" />;
      default:
        return <File className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent files</h3>
        <span className="text-xs text-slate-400 tabular-nums">{recentFiles.length} files</span>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
        {recentFiles.map((file, idx) => (
          <motion.button
            key={file.id}
            initial={isReducedMotion ? false : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: idx * 0.04 }}
            whileHover={isReducedMotion ? undefined : { y: -3 }}
            whileTap={isReducedMotion ? undefined : { scale: 0.95 }}
            onClick={() => setItemForViewer(file)}
            className="oneui-card shrink-0 w-36 sm:w-40 rounded-2xl p-2.5 border border-slate-200/70 dark:border-slate-800/80 text-left transition group focus:outline-none flex flex-col justify-between"
          >
            {/* Thumbnail or Icon Preview */}
            <div className="relative w-full h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
              {file.category === 'images' && file.url ? (
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-700/80 shadow-sm flex items-center justify-center transition-transform group-hover:scale-110">
                  {renderIcon(file)}
                </div>
              )}

              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-sm text-white">
                {file.extension || 'file'}
              </span>
            </div>

            {/* Title & metadata */}
            <div className="min-w-0">
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate" title={file.name}>
                {file.name}
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                <span className="tabular-nums">{formatBytes(file.size, settings.sizeUnit)}</span> ·{' '}
                <span>{formatDate(file.updatedAt)}</span>
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
