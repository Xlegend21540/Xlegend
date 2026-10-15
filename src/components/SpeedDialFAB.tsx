import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, FolderPlus, FilePlus, Upload, Sparkles } from 'lucide-react';
import { useFiles } from '../context/FileContext';

export const SpeedDialFAB: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    setIsNewFolderModalOpen,
    setIsNewDocModalOpen,
    setIsAIMediaStudioOpen,
    uploadFiles,
    settings,
    isMultiSelect,
  } = useFiles();

  const isReducedMotion = settings.animationIntensity === 'off';

  // If in multi-select mode, hide the FAB to prevent conflict
  if (isMultiSelect) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
      e.target.value = '';
      setIsOpen(false);
    }
  };

  const dialActions = [
    {
      id: 'ai-studio',
      label: 'AI Video & Photo Studio',
      icon: Sparkles,
      color: '#9333EA', // Purple
      onClick: () => {
        setIsAIMediaStudioOpen(true);
        setIsOpen(false);
      },
    },
    {
      id: 'upload',
      label: 'Upload File',
      icon: Upload,
      color: '#4F46E5', // Indigo
      onClick: () => {
        fileInputRef.current?.click();
      },
    },
    {
      id: 'document',
      label: 'New Document',
      icon: FilePlus,
      color: '#059669', // Emerald
      onClick: () => {
        setIsNewDocModalOpen(true);
        setIsOpen(false);
      },
    },
    {
      id: 'folder',
      label: 'New Folder',
      icon: FolderPlus,
      color: '#EA580C', // Orange
      onClick: () => {
        setIsNewFolderModalOpen(true);
        setIsOpen(false);
      },
    },
  ];

  return (
    <>
      {/* Hidden file input for file uploads */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileUpload}
        className="hidden"
        aria-hidden="true"
      />

      {/* Dimmed backdrop when speed dial is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-20 right-4 sm:right-6 z-50 flex flex-col items-end pointer-events-none">
        {/* Expanded Speed-Dial Child Options */}
        <AnimatePresence>
          {isOpen && (
            <div className="flex flex-col items-end gap-3 mb-3 pointer-events-auto">
              {dialActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={action.id}
                    initial={isReducedMotion ? false : { opacity: 0, y: 15, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={isReducedMotion ? undefined : { opacity: 0, y: 10, scale: 0.8 }}
                    transition={{
                      duration: 0.25,
                      delay: isReducedMotion ? 0 : (dialActions.length - 1 - index) * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="flex items-center gap-3"
                  >
                    <span className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 bg-white/95 dark:bg-slate-800/95 shadow-md border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-md">
                      {action.label}
                    </span>

                    <motion.button
                      whileHover={isReducedMotion ? undefined : { scale: 1.08 }}
                      whileTap={isReducedMotion ? undefined : { scale: 0.92 }}
                      onClick={action.onClick}
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg focus:outline-none"
                      style={{ backgroundColor: action.color }}
                      aria-label={action.label}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>

        {/* Primary FAB Button with rotating "+" icon */}
        <motion.button
          whileHover={isReducedMotion ? undefined : { scale: 1.05 }}
          whileTap={isReducedMotion ? undefined : { scale: 0.92 }}
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-14 h-14 rounded-3xl flex items-center justify-center text-white shadow-xl pointer-events-auto focus:outline-none transition-shadow"
          style={{
            backgroundColor: settings.accentColor,
            boxShadow: `0 8px 24px -4px ${settings.accentColor}55`,
          }}
          aria-label={isOpen ? 'Close actions menu' : 'Add new items'}
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={isReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 25 }}
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </motion.div>
        </motion.button>
      </div>
    </>
  );
};
