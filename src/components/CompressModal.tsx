import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Archive, X, Check, Loader2 } from 'lucide-react';
import { useFiles } from '../context/FileContext';
import { formatBytes } from '../utils/formatters';

export const CompressModal: React.FC = () => {
  const { itemsForCompress, setItemsForCompress, compressItems, settings } = useFiles();
  const [zipName, setZipName] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!itemsForCompress || itemsForCompress.length === 0) return null;

  const defaultName = `${itemsForCompress[0]?.name.replace(/\.[^/.]+$/, '') || 'Archive'}.zip`;
  const totalOriginalSize = itemsForCompress.reduce((acc, it) => acc + (it.size || 5000), 0);

  const handleClose = () => {
    if (isCompressing) return;
    setItemsForCompress(null);
    setIsCompressing(false);
    setProgress(0);
    setZipName('');
  };

  const handleStartCompress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCompressing(true);
    setProgress(0);

    const targetZip = zipName.trim() || defaultName;

    // Smooth compression progress simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(async () => {
            setProgress(100);
            await compressItems(itemsForCompress, targetZip);
            setIsCompressing(false);
            setItemsForCompress(null);
            setProgress(0);
            setZipName('');
          }, 400);
          return 95;
        }
        return prev + Math.floor(Math.random() * 20) + 10;
      });
    }, 180);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-sm oneui-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xl z-10"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Compress to ZIP</h3>
            {!isCompressing && (
              <button
                onClick={handleClose}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <form onSubmit={handleStartCompress}>
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${settings.accentColor}18`, color: settings.accentColor }}
              >
                <Archive className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {itemsForCompress.length} {itemsForCompress.length === 1 ? 'item' : 'items'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Total size: {formatBytes(totalOriginalSize, settings.sizeUnit)}
                </p>
              </div>
            </div>

            {isCompressing ? (
              <div className="py-6 text-center">
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden mb-3">
                  <motion.div
                    className="h-full rounded-full transition-all duration-200"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: settings.accentColor,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Compressing files...
                  </span>
                  <span className="tabular-nums font-bold text-slate-900 dark:text-white">
                    {progress}%
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
                    Archive File Name
                  </label>
                  <input
                    type="text"
                    autoFocus
                    placeholder={defaultName}
                    value={zipName}
                    onChange={(e) => setZipName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border-0 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-xs active:scale-95 transition"
                    style={{ backgroundColor: settings.accentColor }}
                  >
                    Compress
                  </button>
                </div>
              </>
            )}
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
