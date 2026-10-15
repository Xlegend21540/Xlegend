import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Edit2, X } from 'lucide-react';
import { useFiles } from '../context/FileContext';

export const RenameModal: React.FC = () => {
  const { itemForRename, setItemForRename, renameItem, settings } = useFiles();
  const [name, setName] = useState('');

  useEffect(() => {
    if (itemForRename) {
      setName(itemForRename.name);
    }
  }, [itemForRename]);

  if (!itemForRename) return null;

  const handleClose = () => {
    setItemForRename(null);
  };

  const handleRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    renameItem(itemForRename.id, name);
    handleClose();
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
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Rename</h3>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleRename}>
            <div className="mb-5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
                New Name
              </label>
              <input
                type="text"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                disabled={!name.trim() || name === itemForRename.name}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-xs active:scale-95 transition disabled:opacity-50"
                style={{ backgroundColor: settings.accentColor }}
              >
                Rename
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
