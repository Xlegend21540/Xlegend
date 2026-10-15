import React from 'react';
import { motion } from 'motion/react';
import { Image, Video, Music, FileText, Download, Archive } from 'lucide-react';
import { useFiles } from '../context/FileContext';
import { FileCategory } from '../types';
import { formatBytes } from '../utils/formatters';

interface CategoryItemConfig {
  id: FileCategory;
  name: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  darkBgColor: string;
}

const CATEGORIES: CategoryItemConfig[] = [
  {
    id: 'images',
    name: 'Images',
    icon: Image,
    color: '#EA580C',
    bgColor: 'bg-orange-50',
    darkBgColor: 'dark:bg-orange-950/30',
  },
  {
    id: 'videos',
    name: 'Videos',
    icon: Video,
    color: '#8B5CF6',
    bgColor: 'bg-purple-50',
    darkBgColor: 'dark:bg-purple-950/30',
  },
  {
    id: 'audio',
    name: 'Audio',
    icon: Music,
    color: '#EC4899',
    bgColor: 'bg-pink-50',
    darkBgColor: 'dark:bg-pink-950/30',
  },
  {
    id: 'documents',
    name: 'Documents',
    icon: FileText,
    color: '#10B981',
    bgColor: 'bg-emerald-50',
    darkBgColor: 'dark:bg-emerald-950/30',
  },
  {
    id: 'downloads',
    name: 'Downloads',
    icon: Download,
    color: '#4F46E5',
    bgColor: 'bg-indigo-50',
    darkBgColor: 'dark:bg-indigo-950/30',
  },
  {
    id: 'archives',
    name: 'Installation files',
    icon: Archive,
    color: '#2A72DE',
    bgColor: 'bg-blue-50',
    darkBgColor: 'dark:bg-blue-950/30',
  },
];

export const CategoryGrid: React.FC = () => {
  const { items, settings, setActiveCategory, setSelectedTab } = useFiles();
  const isReducedMotion = settings.animationIntensity === 'off';

  // Calculate file counts & sizes per category
  const activeFiles = items.filter((i) => !i.inTrash && i.type === 'file');

  const stats = React.useMemo(() => {
    const counts: Record<string, { count: number; size: number }> = {};
    CATEGORIES.forEach((c) => {
      counts[c.id] = { count: 0, size: 0 };
    });

    activeFiles.forEach((file) => {
      // If it's located in Downloads folder or categorized as downloads
      let targetCat = file.category;
      if (file.extension === 'apk' || file.extension === 'zip') {
        targetCat = 'archives';
      }
      if (counts[targetCat]) {
        counts[targetCat].count += 1;
        counts[targetCat].size += file.size || 0;
      }
    });

    return counts;
  }, [activeFiles]);

  const handleSelectCategory = (catId: FileCategory) => {
    setActiveCategory(catId);
    setSelectedTab('browse');
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {CATEGORIES.map((cat, idx) => {
        const Icon = cat.icon;
        const catStat = stats[cat.id] || { count: 0, size: 0 };

        return (
          <motion.button
            key={cat.id}
            initial={isReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
            whileHover={isReducedMotion ? undefined : { scale: 1.02 }}
            whileTap={isReducedMotion ? undefined : { scale: 0.96 }}
            onClick={() => handleSelectCategory(cat.id)}
            className="oneui-card rounded-2xl p-3.5 flex items-center gap-3 border border-slate-200/60 dark:border-slate-800/80 text-left transition group focus:outline-none"
          >
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${cat.bgColor} ${cat.darkBgColor} transition-transform group-hover:scale-105`}
            >
              <Icon className="w-5 h-5" style={{ color: cat.color }} />
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                {cat.name}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                <span className="tabular-nums">{catStat.count} items</span> ·{' '}
                <span className="tabular-nums">{formatBytes(catStat.size, settings.sizeUnit)}</span>
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};
