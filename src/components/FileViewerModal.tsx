import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Play,
  Pause,
  Volume2,
  FileText,
  Edit2,
  Star,
  Share2,
  Trash2,
  Info,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  Film,
} from 'lucide-react';
import { useFiles } from '../context/FileContext';
import { formatBytes, formatDate } from '../utils/formatters';

export const FileViewerModal: React.FC = () => {
  const {
    itemForViewer,
    setItemForViewer,
    setItemForEdit,
    setItemForDetails,
    setItemForPhotoEdit,
    setItemForVideoEdit,
    toggleFavorite,
    deleteItem,
    addToast,
    settings,
  } = useFiles();

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const file = itemForViewer;

  if (!file) return null;

  const handleClose = () => {
    setItemForViewer(null);
    setIsPlayingAudio(false);
    setIsPlayingVideo(false);
    setZoomLevel(1);
  };

  const isEditable =
    file.category === 'documents' &&
    ['txt', 'md', 'json', 'log', 'ts', 'js', 'html', 'css'].includes(file.extension || '');

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: file.name,
          text: `Sharing ${file.name} from OneFiles`,
        });
      } catch (e) {
        // user cancelled
      }
    } else {
      navigator.clipboard?.writeText?.(window.location.href);
      addToast('Link copied to clipboard');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl h-[90vh] bg-slate-900 text-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-800"
        >
          {/* Top Header */}
          <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-white truncate">{file.name}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                <span className="tabular-nums">{formatBytes(file.size, settings.sizeUnit)}</span> ·{' '}
                <span>{formatDate(file.updatedAt)}</span>
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              {file.category === 'images' && (
                <>
                  <button
                    onClick={() => {
                      handleClose();
                      setItemForPhotoEdit(file);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md active:scale-95 transition"
                    title="Edit with AI"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Edit</span>
                  </button>
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
                    className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                    className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </>
              )}

              {file.category === 'videos' && (
                <button
                  onClick={() => {
                    handleClose();
                    setItemForVideoEdit(file);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md active:scale-95 transition"
                  title="Video Editor"
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Video Editor</span>
                </button>
              )}

              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
                aria-label="Close viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Media Content Display Area */}
          <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-slate-950/60 select-none">
            {/* Image Preview */}
            {file.category === 'images' && file.url && (
              <div className="w-full h-full flex items-center justify-center overflow-hidden">
                <img
                  src={file.url}
                  alt={file.name}
                  style={{ transform: `scale(${zoomLevel})` }}
                  className="max-w-full max-h-full object-contain rounded-xl transition-transform duration-200"
                />
              </div>
            )}

            {/* Audio Player Card */}
            {file.category === 'audio' && (
              <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-3xl text-center shadow-xl">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 mx-auto flex items-center justify-center mb-5 shadow-lg shadow-pink-500/20">
                  <Volume2 className="w-10 h-10 text-white" />
                </div>

                <h4 className="text-base font-bold text-white truncate mb-1">{file.name}</h4>
                <p className="text-xs text-slate-400 mb-6">Samsung Music • 320 kbps High Fidelity</p>

                {/* Animated Waveform Bars */}
                <div className="flex items-center justify-center gap-1.5 h-12 mb-6 px-4">
                  {[28, 45, 75, 90, 60, 35, 80, 100, 70, 40, 85, 95, 65, 50, 80, 45].map(
                    (height, i) => (
                      <motion.div
                        key={i}
                        animate={
                          isPlayingAudio
                            ? {
                                height: [`${height}%`, `${Math.max(15, (height * 1.5) % 100)}%`, `${height}%`],
                              }
                            : { height: '30%' }
                        }
                        transition={{
                          repeat: Infinity,
                          duration: 0.8,
                          delay: i * 0.05,
                        }}
                        className="w-1.5 bg-gradient-to-t from-pink-500 to-purple-400 rounded-full"
                      />
                    )
                  )}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="w-14 h-14 rounded-full bg-pink-600 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition"
                  >
                    {isPlayingAudio ? (
                      <Pause className="w-6 h-6 fill-current" />
                    ) : (
                      <Play className="w-6 h-6 fill-current ml-1" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Video Player Card */}
            {file.category === 'videos' && (
              <div className="w-full max-w-lg aspect-video bg-slate-900 rounded-3xl border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden group shadow-2xl">
                <div className="text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-purple-600/30 text-purple-400 flex items-center justify-center mx-auto mb-3">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{file.name}</h4>
                  <p className="text-xs text-slate-400">1080p 60fps • MP4 Video Stream</p>
                </div>

                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                      className="p-1 hover:text-white"
                    >
                      {isPlayingVideo ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <span>0:14 / 2:38</span>
                  </div>
                  <Maximize2 className="w-4 h-4 cursor-pointer" />
                </div>
              </div>
            )}

            {/* Document / Text / Code Preview */}
            {file.category === 'documents' && file.content && (
              <div className="w-full h-full bg-slate-900 rounded-2xl p-4 overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap select-text border border-slate-800">
                {file.content}
              </div>
            )}

            {/* PDF & Other Files View */}
            {file.category === 'documents' && !file.content && (
              <div className="text-center max-w-sm p-6 bg-slate-900 border border-slate-800 rounded-3xl">
                <div className="w-16 h-16 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{file.name}</h4>
                <p className="text-xs text-slate-400 mb-5">
                  PDF Document • {formatBytes(file.size, settings.sizeUnit)}
                </p>
                <button
                  onClick={() => addToast('Opening PDF Document with system viewer')}
                  className="px-5 py-2.5 rounded-2xl bg-emerald-600 text-white font-semibold text-xs shadow-md hover:bg-emerald-500 transition active:scale-95"
                >
                  View in Reader
                </button>
              </div>
            )}

            {/* APKs / Archives */}
            {file.category === 'archives' && (
              <div className="text-center max-w-sm p-6 bg-slate-900 border border-slate-800 rounded-3xl">
                <div className="w-16 h-16 rounded-2xl bg-blue-950 text-blue-400 flex items-center justify-center mx-auto mb-3">
                  <Download className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{file.name}</h4>
                <p className="text-xs text-slate-400 mb-5">
                  {file.extension === 'apk' ? 'Android Application Package' : 'Compressed Archive'} •{' '}
                  {formatBytes(file.size, settings.sizeUnit)}
                </p>
                <button
                  onClick={() =>
                    addToast(
                      file.extension === 'apk'
                        ? 'Package verified for installation'
                        : 'Archive extraction prepared'
                    )
                  }
                  className="px-5 py-2.5 rounded-2xl bg-blue-600 text-white font-semibold text-xs shadow-md hover:bg-blue-500 transition active:scale-95"
                >
                  {file.extension === 'apk' ? 'Install Package' : 'Extract Archive'}
                </button>
              </div>
            )}
          </div>

          {/* Bottom Action Bar */}
          <div className="px-5 py-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-around gap-2 shrink-0">
            {file.category === 'images' && (
              <button
                onClick={() => {
                  setItemForViewer(null);
                  setItemForPhotoEdit(file);
                }}
                className="flex flex-col items-center gap-1 text-purple-400 hover:text-purple-300 transition"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-medium">AI Photo</span>
              </button>
            )}

            {file.category === 'videos' && (
              <button
                onClick={() => {
                  setItemForViewer(null);
                  setItemForVideoEdit(file);
                }}
                className="flex flex-col items-center gap-1 text-purple-400 hover:text-purple-300 transition"
              >
                <Film className="w-4 h-4" />
                <span className="text-[10px] font-medium">Video Editor</span>
              </button>
            )}

            {isEditable && (
              <button
                onClick={() => {
                  setItemForViewer(null);
                  setItemForEdit(file);
                }}
                className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition"
              >
                <Edit2 className="w-4 h-4" />
                <span className="text-[10px] font-medium">Edit</span>
              </button>
            )}

            <button
              onClick={() => {
                setItemForViewer(null);
                setItemForDetails(file);
              }}
              className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition"
            >
              <Info className="w-4 h-4" />
              <span className="text-[10px] font-medium">Details</span>
            </button>

            <button
              onClick={() => toggleFavorite(file.id)}
              className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition"
            >
              <Star
                className={`w-4 h-4 ${file.isFavorite ? 'text-amber-500 fill-amber-500' : ''}`}
              />
              <span className="text-[10px] font-medium">Favorite</span>
            </button>

            <button
              onClick={handleShare}
              className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-[10px] font-medium">Share</span>
            </button>

            <button
              onClick={() => {
                deleteItem(file.id);
                handleClose();
              }}
              className="flex flex-col items-center gap-1 text-red-400 hover:text-red-300 transition"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-[10px] font-medium">Delete</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
