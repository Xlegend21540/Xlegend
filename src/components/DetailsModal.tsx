import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, X, Folder, File, Calendar, HardDrive, MapPin } from 'lucide-react';
import { useFiles } from '../context/FileContext';
import { formatBytes, formatFullDate } from '../utils/formatters';

export const DetailsModal: React.FC = () => {
  const { itemForDetails, setItemForDetails, getPath, items, settings } = useFiles();
  const item = itemForDetails;

  if (!item) return null;

  const handleClose = () => {
    setItemForDetails(null);
  };

  const path = getPath(item.parentId);
  const pathString = `root / ${path.map((p) => p.name).join(' / ')} / ${item.name}`;

  const childCount =
    item.type === 'folder'
      ? items.filter((i) => i.parentId === item.id && !i.inTrash).length
      : 0;

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
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Details</h3>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Item Icon & Title */}
          <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
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
                <Folder className="w-6 h-6 fill-current" />
              ) : (
                <File className="w-6 h-6" />
              )}
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate" title={item.name}>
                {item.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                {item.type === 'folder' ? 'Folder' : `${item.category} file`}
              </p>
            </div>
          </div>

          {/* Details list */}
          <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Size</span>
              <span className="text-slate-900 dark:text-white font-medium tabular-nums">
                {item.type === 'folder'
                  ? `${childCount} items`
                  : `${formatBytes(item.size, settings.sizeUnit)} (${(item.size || 0).toLocaleString()} bytes)`}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Full Path</span>
              <span className="font-mono text-[11px] text-slate-800 dark:text-slate-200 break-all select-all">
                {pathString}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Last Modified</span>
              <span className="text-slate-900 dark:text-white font-medium">
                {formatFullDate(item.updatedAt)}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Created</span>
              <span className="text-slate-900 dark:text-white font-medium">
                {formatFullDate(item.createdAt)}
              </span>
            </div>

            {item.extension && (
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Extension</span>
                <span className="text-slate-900 dark:text-white font-mono uppercase font-bold">
                  .{item.extension}
                </span>
              </div>
            )}
          </div>

          {/* Close button */}
          <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={handleClose}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-xs active:scale-95 transition"
              style={{ backgroundColor: settings.accentColor }}
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
