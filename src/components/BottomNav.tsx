import React from 'react';
import { motion } from 'motion/react';
import { Home, Folder, Star, Settings } from 'lucide-react';
import { useFiles } from '../context/FileContext';
import { NavTab } from '../types';

export const BottomNav: React.FC = () => {
  const { selectedTab, setSelectedTab, settings } = useFiles();

  const tabs: { id: NavTab; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'browse', label: 'Browse', icon: Folder },
    { id: 'favorites', label: 'Favorites', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const isReducedMotion = settings.animationIntensity === 'off';

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 oneui-glass border-t border-slate-200/80 dark:border-slate-800/80 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)',
      }}
    >
      <div className="max-w-md mx-auto grid grid-cols-4 items-center h-16 px-2">
        {tabs.map((tab) => {
          const isActive = selectedTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className="relative flex flex-col items-center justify-center h-full min-h-[44px] group focus:outline-none"
              aria-label={tab.label}
              aria-selected={isActive}
            >
              {/* Soft animated pill behind active tab */}
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-x-3 inset-y-1.5 rounded-2xl bg-slate-200/60 dark:bg-slate-800/80 -z-10"
                  transition={
                    isReducedMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 450, damping: 32 }
                  }
                />
              )}

              <motion.div
                whileTap={isReducedMotion ? undefined : { scale: 0.88 }}
                className="flex flex-col items-center justify-center transition-colors duration-200"
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? 'scale-110' : 'group-hover:scale-105'
                    }`}
                    style={{
                      color: isActive ? settings.accentColor : undefined,
                    }}
                  />
                </div>
                <span
                  className={`text-[11px] font-semibold mt-1 tracking-tight transition-colors duration-150 ${
                    isActive
                      ? 'text-slate-900 dark:text-white font-bold'
                      : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                  }`}
                  style={{
                    color: isActive ? settings.accentColor : undefined,
                  }}
                >
                  {tab.label}
                </span>
              </motion.div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
