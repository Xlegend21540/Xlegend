import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFiles } from '../context/FileContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast, settings } = useFiles();
  const isReducedMotion = settings.animationIntensity === 'off';

  return (
    <div className="fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none w-full max-w-sm px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={isReducedMotion ? false : { opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={isReducedMotion ? undefined : { opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-full bg-slate-900/95 dark:bg-[#1E2633] text-white rounded-2xl shadow-xl px-4 py-3 flex items-center justify-between border border-slate-700/60 backdrop-blur-md pointer-events-auto overflow-hidden relative"
          >
            {/* Animated countdown progress line */}
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: (toast.duration || 5000) / 1000, ease: 'linear' }}
              className="absolute bottom-0 left-0 h-0.5 bg-blue-500 opacity-60"
            />

            <span className="text-xs font-semibold truncate mr-3">{toast.message}</span>

            {toast.actionLabel && toast.onAction && (
              <button
                onClick={() => {
                  toast.onAction?.();
                  removeToast(toast.id);
                }}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wider shrink-0 px-2 py-1 rounded-lg hover:bg-white/10 transition active:scale-95"
              >
                {toast.actionLabel}
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
