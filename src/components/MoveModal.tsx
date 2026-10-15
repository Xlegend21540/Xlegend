import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Folder, HardDrive, ChevronRight, ArrowLeft, X, Check } from 'lucide-react';
import { useFiles } from '../context/FileContext';
import { FSItem } from '../types';

export const MoveModal: React.FC = () => {
  const { items, itemsForMove, setItemsForMove, moveItems, copyItems, settings } = useFiles();
  const [destFolderId, setDestFolderId] = useState<string | null>(null);

  if (!itemsForMove) return null;

  const { items: targetItems, mode } = itemsForMove;
  const targetIds = targetItems.map((i) => i.id);

  const handleClose = () => {
    setItemsForMove(null);
    setDestFolderId(null);
  };

  const handleExecute = () => {
    if (mode === 'move') {
      moveItems(targetIds, destFolderId);
    } else {
      copyItems(targetIds, destFolderId);
    }
    handleClose();
  };

  // Find subfolders in current destination
  const subfolders = items.filter(
    (i) =>
      i.parentId === destFolderId &&
      i.type === 'folder' &&
      !i.inTrash &&
      !targetIds.includes(i.id) // Can't move folder into itself
  );

  // Get current destination folder object
  const currentDestFolder = destFolderId ? items.find((i) => i.id === destFolderId) : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
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
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-md h-[520px] oneui-card rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white capitalize">
                {mode === 'move' ? 'Move' : 'Copy'} {targetItems.length}{' '}
                {targetItems.length === 1 ? 'item' : 'items'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose destination folder
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Path Bar & Up button */}
          <div className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800/60 rounded-2xl my-3 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 shrink-0">
            <div className="flex items-center gap-2 truncate">
              {destFolderId ? (
                <>
                  <Folder className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                  <span className="truncate">{currentDestFolder?.name || 'Folder'}</span>
                </>
              ) : (
                <>
                  <HardDrive className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Internal Storage (Root)</span>
                </>
              )}
            </div>

            {destFolderId && (
              <button
                onClick={() => {
                  const parent = currentDestFolder?.parentId || null;
                  setDestFolderId(parent);
                }}
                className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Up</span>
              </button>
            )}
          </div>

          {/* Folder List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {subfolders.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-400">
                No subfolders in this location.
              </div>
            ) : (
              subfolders.map((folder) => {
                const folderColor = folder.color || settings.accentColor;
                return (
                  <button
                    key={folder.id}
                    onClick={() => setDestFolderId(folder.id)}
                    className="w-full flex items-center justify-between py-2.5 px-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition text-left group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${folderColor}20`, color: folderColor }}
                      >
                        <Folder className="w-4 h-4 fill-current" />
                      </div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {folder.name}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                );
              })
            )}
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
            <span className="text-[11px] text-slate-400 truncate max-w-[150px]">
              Destination: {currentDestFolder?.name || 'Internal Storage'}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleExecute}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-xs active:scale-95 transition"
                style={{ backgroundColor: settings.accentColor }}
              >
                <Check className="w-4 h-4" />
                <span>{mode === 'move' ? 'Move here' : 'Copy here'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
