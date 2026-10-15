import React from 'react';
import { motion } from 'motion/react';
import { HardDrive, ChevronRight } from 'lucide-react';
import { useFiles } from '../context/FileContext';
import { formatBytes } from '../utils/formatters';

export const StorageCard: React.FC = () => {
  const { items, settings, setSelectedTab, setActiveCategory } = useFiles();

  // Simulated total storage: 128 GB
  const TOTAL_STORAGE_BYTES = 128 * 1024 * 1024 * 1024;
  // Baseline system & apps usage: ~32.4 GB
  const SYSTEM_USAGE_BYTES = 32.4 * 1024 * 1024 * 1024;

  // Calculate actual files breakdown
  const nonTrashItems = items.filter((i) => !i.inTrash && i.type === 'file');

  const categoriesSize = nonTrashItems.reduce(
    (acc, it) => {
      acc[it.category] = (acc[it.category] || 0) + (it.size || 0);
      return acc;
    },
    {} as Record<string, number>
  );

  const imagesSize = categoriesSize['images'] || 0;
  const videosSize = categoriesSize['videos'] || 0;
  const audioSize = categoriesSize['audio'] || 0;
  const docsSize = categoriesSize['documents'] || 0;
  const archivesSize = categoriesSize['archives'] || 0;
  const downloadsSize = categoriesSize['downloads'] || 0;

  const userFilesTotal = Object.values(categoriesSize).reduce((a, b) => a + b, 0);
  const totalUsedBytes = SYSTEM_USAGE_BYTES + userFilesTotal;
  const usedPercentage = Math.min(100, (totalUsedBytes / TOTAL_STORAGE_BYTES) * 100);

  const isReducedMotion = settings.animationIntensity === 'off';

  const segments = [
    { name: 'System', color: '#94A3B8', size: SYSTEM_USAGE_BYTES },
    { name: 'Images', color: '#EA580C', size: imagesSize, cat: 'images' },
    { name: 'Videos', color: '#8B5CF6', size: videosSize, cat: 'videos' },
    { name: 'Audio', color: '#EC4899', size: audioSize, cat: 'audio' },
    { name: 'Documents', color: '#10B981', size: docsSize, cat: 'documents' },
    { name: 'Archives', color: '#3B82F6', size: archivesSize, cat: 'archives' },
  ];

  return (
    <motion.div
      whileHover={isReducedMotion ? undefined : { y: -2 }}
      className="oneui-card rounded-3xl p-5 border border-slate-200/70 dark:border-slate-800/80 transition-shadow duration-200"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center transition-colors"
            style={{
              backgroundColor: `${settings.accentColor}18`,
              color: settings.accentColor,
            }}
          >
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Internal Storage</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {formatBytes(totalUsedBytes, settings.sizeUnit)} used of{' '}
              {formatBytes(TOTAL_STORAGE_BYTES, settings.sizeUnit)}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span
            className="text-lg font-extrabold tracking-tight tabular-nums"
            style={{ color: settings.accentColor }}
          >
            {usedPercentage.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Multi-segment Progress Bar */}
      <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex my-3">
        {segments.map((seg, i) => {
          const segPercent = (seg.size / TOTAL_STORAGE_BYTES) * 100;
          if (segPercent <= 0) return null;
          return (
            <motion.div
              key={seg.name}
              initial={isReducedMotion ? false : { width: 0 }}
              animate={{ width: `${segPercent}%` }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="h-full first:rounded-l-full last:rounded-r-full"
              style={{ backgroundColor: seg.color }}
              title={`${seg.name}: ${formatBytes(seg.size, settings.sizeUnit)}`}
            />
          );
        })}
      </div>

      {/* Clean Segment Badges / Legend */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        {segments.map((seg) => (
          <button
            key={seg.name}
            onClick={() => {
              if (seg.cat) {
                setActiveCategory(seg.cat as any);
                setSelectedTab('browse');
              }
            }}
            className={`flex items-center gap-1.5 py-1 px-1.5 rounded-lg text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
              seg.cat ? 'cursor-pointer' : 'cursor-default'
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: seg.color }}
            />
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block truncate">
                {seg.name}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 tabular-nums block truncate">
                {formatBytes(seg.size, settings.sizeUnit)}
              </span>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
};
