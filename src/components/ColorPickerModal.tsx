import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Folder, Check, X } from 'lucide-react';
import { useFiles } from '../context/FileContext';
import { PRESET_FOLDER_COLORS } from '../utils/formatters';

export const ColorPickerModal: React.FC = () => {
  const { folderForColorPicker, setFolderForColorPicker, updateFolderColor, settings } = useFiles();
  const folder = folderForColorPicker;

  const [selectedColor, setSelectedColor] = useState<string>(
    folder?.color || settings.accentColor
  );
  const [customColor, setCustomColor] = useState<string>(
    folder?.color || '#2A72DE'
  );

  if (!folder) return null;

  const handleClose = () => {
    setFolderForColorPicker(null);
  };

  const handleApply = () => {
    updateFolderColor(folder.id, selectedColor);
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
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Folder Color</h3>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Folder Icon Preview */}
          <div className="flex flex-col items-center justify-center py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl mb-5">
            <Folder className="w-16 h-16 fill-current transition-colors duration-200" style={{ color: selectedColor }} />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-2 truncate max-w-[200px]">
              {folder.name}
            </span>
          </div>

          {/* Presets Grid */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">
              Color Presets
            </label>
            <div className="grid grid-cols-7 gap-2">
              {PRESET_FOLDER_COLORS.map((preset) => {
                const isCurrent = selectedColor.toLowerCase() === preset.hex.toLowerCase();
                return (
                  <button
                    key={preset.hex}
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

          {/* Custom Color Input */}
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
              onClick={handleClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white transition active:scale-95 shadow-sm"
              style={{ backgroundColor: settings.accentColor }}
            >
              Apply
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
