import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Folder, Check, X } from 'lucide-react';
import { useFiles } from '../context/FileContext';
import { PRESET_FOLDER_COLORS } from '../utils/formatters';

export const NewFolderModal: React.FC = () => {
  const { isNewFolderModalOpen, setIsNewFolderModalOpen, createFolder, settings } = useFiles();
  const [folderName, setFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState(settings.accentColor);
  const [customColor, setCustomColor] = useState('#2A72DE');

  if (!isNewFolderModalOpen) return null;

  const handleClose = () => {
    setIsNewFolderModalOpen(false);
    setFolderName('');
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;
    createFolder(folderName, selectedColor);
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

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-sm oneui-card rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xl z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">New Folder</h3>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCreate}>
            {/* Live Folder Preview */}
            <div className="flex flex-col items-center justify-center py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl mb-4">
              <Folder
                className="w-16 h-16 fill-current transition-colors duration-200"
                style={{ color: selectedColor }}
              />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-2 truncate max-w-[200px]">
                {folderName.trim() || 'New Folder'}
              </span>
            </div>

            {/* Folder Name Input */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
                Folder Name
              </label>
              <input
                type="text"
                autoFocus
                placeholder="Folder name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border-0 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Color Presets */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">
                Folder Color
              </label>
              <div className="grid grid-cols-7 gap-2">
                {PRESET_FOLDER_COLORS.map((preset) => {
                  const isCurrent = selectedColor.toLowerCase() === preset.hex.toLowerCase();
                  return (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => {
                        setSelectedColor(preset.hex);
                        setCustomColor(preset.hex);
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-xs"
                      style={{ backgroundColor: preset.hex }}
                      title={preset.name}
                      aria-label={preset.name}
                    >
                      {isCurrent && <Check className="w-4 h-4 text-white stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Color Row */}
            <div className="flex items-center gap-3 pt-2 mb-6 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">Custom:</label>
              <input
                type="color"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  setSelectedColor(e.target.value);
                }}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <span className="text-xs font-mono text-slate-500 uppercase">{selectedColor}</span>
            </div>

            {/* Actions */}
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
                disabled={!folderName.trim()}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white transition active:scale-95 shadow-sm disabled:opacity-50"
                style={{ backgroundColor: settings.accentColor }}
              >
                Create
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
