import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Info,
  Edit2,
  Eye,
  Archive,
  Move,
  Copy,
  Trash2,
  Star,
  Pin,
  Share2,
  Palette,
  Folder,
  File,
  Sparkles,
  Film,
  Wand2,
} from 'lucide-react';
import { useFiles } from '../context/FileContext';
import { formatBytes } from '../utils/formatters';

export const BottomSheet: React.FC = () => {
  const {
    activeItemForMenu,
    setActiveItemForMenu,
    setItemForDetails,
    setItemForRename,
    setItemForViewer,
    setFolderForColorPicker,
    setItemsForMove,
    setItemsForCompress,
    deleteItem,
    toggleFavorite,
    togglePinnedHome,
    setItemForPhotoEdit,
    setItemForVideoEdit,
    setIsAIMediaStudioOpen,
    addToast,
    settings,
  } = useFiles();

  const isReducedMotion = settings.animationIntensity === 'off';
  const item = activeItemForMenu;

  if (!item) return null;

  const handleClose = () => {
    setActiveItemForMenu(null);
  };

  const handleShare = async () => {
    handleClose();
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.name,
          text: `Check out ${item.name} in OneFiles`,
        });
      } catch (e) {
        // user cancelled or share failed
      }
    } else {
      navigator.clipboard?.writeText?.(window.location.href);
      addToast('Link copied to clipboard');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Sheet Container with drag-to-dismiss */}
        <motion.div
          initial={isReducedMotion ? false : { y: '100%' }}
          animate={{ y: 0 }}
          exit={isReducedMotion ? undefined : { y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 350 }}
          drag="y"
          dragConstraints={{ top: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.y > 100 || info.velocity.y > 400) {
              handleClose();
            }
          }}
          className="relative w-full max-w-lg bg-white dark:bg-[#161D26] rounded-t-[32px] shadow-2xl border-t border-slate-200/80 dark:border-slate-800/80 pb-safe z-10 max-h-[85vh] flex flex-col overflow-hidden"
        >
          {/* Grab Handle */}
          <div className="w-full flex items-center justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
            <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
          </div>

          {/* Header with Item Summary */}
          <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-3.5">
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

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {item.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {item.type === 'folder'
                  ? 'Folder'
                  : `${formatBytes(item.size, settings.sizeUnit)} · ${item.extension?.toUpperCase() || 'FILE'}`}
              </p>
            </div>
          </div>

          {/* Action List */}
          <div className="px-4 py-3 overflow-y-auto max-h-[60vh] divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
            {/* Primary View / Open */}
            <button
              onClick={() => {
                handleClose();
                setItemForViewer(item);
              }}
              className="w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200 transition font-medium text-left"
            >
              <Eye className="w-5 h-5 text-slate-500" />
              <span>{item.type === 'folder' ? 'Open Folder' : 'Open with / View'}</span>
            </button>

            {/* AI Photo Studio (for images) */}
            {item.type === 'file' && item.category === 'images' && (
              <button
                onClick={() => {
                  handleClose();
                  setItemForPhotoEdit(item);
                }}
                className="w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-700 dark:text-purple-300 transition font-medium text-left"
              >
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <div className="flex-1">
                  <span>Edit photo with AI</span>
                  <span className="ml-2 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                    Gemini AI
                  </span>
                </div>
              </button>
            )}

            {/* AI Video Editor (for videos) */}
            {item.type === 'file' && item.category === 'videos' && (
              <button
                onClick={() => {
                  handleClose();
                  setItemForVideoEdit(item);
                }}
                className="w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl hover:bg-purple-50 dark:hover:bg-purple-950/40 text-purple-700 dark:text-purple-300 transition font-medium text-left"
              >
                <Film className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <div className="flex-1">
                  <span>Edit video with AI</span>
                  <span className="ml-2 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                    AI Editor
                  </span>
                </div>
              </button>
            )}

            {/* Folder Color Picker (for folders only) */}
            {item.type === 'folder' && (
              <button
                onClick={() => {
                  handleClose();
                  setFolderForColorPicker(item);
                }}
                className="w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200 transition font-medium text-left"
              >
                <Palette className="w-5 h-5" style={{ color: item.color || settings.accentColor }} />
                <span>Change Folder Color</span>
              </button>
            )}

            {/* Details */}
            <button
              onClick={() => {
                handleClose();
                setItemForDetails(item);
              }}
              className="w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200 transition font-medium text-left"
            >
              <Info className="w-5 h-5 text-slate-500" />
              <span>Details</span>
            </button>

            {/* Rename */}
            <button
              onClick={() => {
                handleClose();
                setItemForRename(item);
              }}
              className="w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200 transition font-medium text-left"
            >
              <Edit2 className="w-5 h-5 text-slate-500" />
              <span>Rename</span>
            </button>

            {/* Favorite */}
            <button
              onClick={() => {
                toggleFavorite(item.id);
                handleClose();
              }}
              className="w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200 transition font-medium text-left"
            >
              <Star
                className={`w-5 h-5 ${item.isFavorite ? 'text-amber-500 fill-amber-500' : 'text-slate-500'}`}
              />
              <span>{item.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
            </button>

            {/* Pin to Home */}
            <button
              onClick={() => {
                togglePinnedHome(item.id);
                handleClose();
              }}
              className="w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200 transition font-medium text-left"
            >
              <Pin
                className={`w-5 h-5 ${item.isPinnedHome ? 'text-blue-500 fill-blue-500' : 'text-slate-500'}`}
              />
              <span>{item.isPinnedHome ? 'Unpin from Home' : 'Add to Home screen'}</span>
            </button>

            {/* Move */}
            <button
              onClick={() => {
                handleClose();
                setItemsForMove({ items: [item], mode: 'move' });
              }}
              className="w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200 transition font-medium text-left"
            >
              <Move className="w-5 h-5 text-slate-500" />
              <span>Move</span>
            </button>

            {/* Copy */}
            <button
              onClick={() => {
                handleClose();
                setItemsForMove({ items: [item], mode: 'copy' });
              }}
              className="w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200 transition font-medium text-left"
            >
              <Copy className="w-5 h-5 text-slate-500" />
              <span>Copy</span>
            </button>

            {/* Compress */}
            <button
              onClick={() => {
                handleClose();
                setItemsForCompress([item]);
              }}
              className="w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200 transition font-medium text-left"
            >
              <Archive className="w-5 h-5 text-slate-500" />
              <span>Compress (zip)</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200 transition font-medium text-left"
            >
              <Share2 className="w-5 h-5 text-slate-500" />
              <span>Share</span>
            </button>

            {/* Delete */}
            <button
              onClick={() => {
                deleteItem(item.id);
                handleClose();
              }}
              className="w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 transition font-medium text-left"
            >
              <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span>Delete</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
