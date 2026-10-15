import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, RotateCcw, X, Folder, File, AlertTriangle } from 'lucide-react';
import { useFiles } from '../context/FileContext';
import { formatBytes, formatDate } from '../utils/formatters';

export const TrashModal: React.FC = () => {
  const { isTrashOpen, setIsTrashOpen, items, restoreItem, restoreAllTrash, emptyTrash, settings } =
    useFiles();
  const [confirmEmpty, setConfirmEmpty] = React.useState(false);

  if (!isTrashOpen) return null;

  const trashItems = items.filter((i) => i.inTrash);
  const totalTrashSize = trashItems.reduce((acc, it) => acc + (it.size || 0), 0);

  const handleClose = () => {
    setIsTrashOpen(false);
    setConfirmEmpty(false);
  };

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
          className="relative w-full max-w-lg h-[540px] oneui-card rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Trash</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {trashItems.length} {trashItems.length === 1 ? 'item' : 'items'} ·{' '}
                  {formatBytes(totalTrashSize, settings.sizeUnit)}
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Confirm Empty Dialog Overlay */}
          {confirmEmpty ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center mb-4">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                Permanently delete all items?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-6">
                This will permanently remove {trashItems.length} items from your device. This action cannot be undone.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setConfirmEmpty(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    emptyTrash();
                    setConfirmEmpty(false);
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 shadow-sm transition active:scale-95"
                >
                  Delete permanently
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Trash items list */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 py-2">
                {trashItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12 text-slate-400">
                    <Trash2 className="w-10 h-10 opacity-30 mb-2" />
                    <p className="text-xs font-medium">Trash is empty</p>
                  </div>
                ) : (
                  trashItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-2.5 px-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl transition"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-500">
                          {item.type === 'folder' ? (
                            <Folder className="w-4 h-4 fill-current" />
                          ) : (
                            <File className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                            {item.name}
                          </h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">
                            {item.deletedAt ? `Deleted ${formatDate(item.deletedAt)}` : 'In Trash'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => restoreItem(item.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition shrink-0"
                        title="Restore item"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Restore</span>
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Bottom bar */}
              {trashItems.length > 0 && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                  <button
                    onClick={() => setConfirmEmpty(true)}
                    className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline px-2 py-1"
                  >
                    Empty Trash
                  </button>

                  <button
                    onClick={restoreAllTrash}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-xs active:scale-95 transition"
                    style={{ backgroundColor: settings.accentColor }}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore All</span>
                  </button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
