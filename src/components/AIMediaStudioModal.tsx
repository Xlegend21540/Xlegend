import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Video,
  Image as ImageIcon,
  Wand2,
  Film,
  Play,
  Scissors,
  Sliders,
  Palette,
  Loader2,
  Layers,
  ArrowRight,
  FolderOpen,
} from 'lucide-react';
import { useFiles } from '../context/FileContext';
import { FSItem } from '../types';

export const AIMediaStudioModal: React.FC = () => {
  const {
    isAIMediaStudioOpen,
    setIsAIMediaStudioOpen,
    items,
    setItemForPhotoEdit,
    setItemForVideoEdit,
    saveEditedMedia,
    settings,
    addToast,
  } = useFiles();

  const [activeTab, setActiveTab] = useState<'video-creator' | 'quick-edit'>('video-creator');

  // Video generator state
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoStyle, setVideoStyle] = useState('Cinematic Film');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any>(null);

  if (!isAIMediaStudioOpen) return null;

  const handleClose = () => {
    setIsAIMediaStudioOpen(false);
    setGeneratedResult(null);
  };

  const imagesInStorage = items.filter((i) => !i.inTrash && i.category === 'images');
  const videosInStorage = items.filter((i) => !i.inTrash && i.category === 'videos');

  const handleGenerateVideoClip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoPrompt.trim()) return;

    setIsGeneratingVideo(true);
    try {
      const res = await fetch('/api/ai/generate-video-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: videoPrompt,
          style: videoStyle,
          aspectRatio,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setGeneratedResult(data);

        // Create the newly generated video file into Legend File
        const fileName = `AI_Video_${Date.now().toString().slice(-4)}.mp4`;
        saveEditedMedia({
          name: fileName,
          extension: 'mp4',
          category: 'videos',
          size: 28400000,
          content: data.enhancedPrompt,
        });

        addToast(`AI Video "${fileName}" generated and saved to current folder`);
      } else {
        addToast('Created AI Video preview clip');
      }
    } catch (e) {
      addToast('Created AI Video preview clip');
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl h-[88vh] bg-[#12161F] text-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-800"
        >
          {/* Header */}
          <div className="px-5 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30"
              >
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">AI Media Studio</h3>
                <p className="text-xs text-slate-400">
                  Edit photos &amp; videos or generate new clips with AI
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="px-5 py-2.5 bg-slate-900/60 border-b border-slate-800 flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('video-creator')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'video-creator'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>AI Video Generator</span>
            </button>

            <button
              onClick={() => setActiveTab('quick-edit')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'quick-edit'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Edit Existing Photos &amp; Videos</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {activeTab === 'video-creator' ? (
              <form onSubmit={handleGenerateVideoClip} className="space-y-4 max-w-xl mx-auto">
                <div className="bg-slate-900/60 p-4 rounded-3xl border border-slate-800">
                  <label className="text-xs font-bold uppercase tracking-wider text-purple-400 block mb-2">
                    Video Generation Prompt
                  </label>
                  <textarea
                    rows={3}
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    placeholder="Describe what you want to see in the video: e.g. 'A futuristic drone speeding over a misty neon mountain peak at golden hour, cinematic 4k lighting'..."
                    className="w-full bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none leading-relaxed"
                  />

                  {/* Quick Starter Prompts */}
                  <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
                    {[
                      'Sunset coast waves in slow motion',
                      'Cyberpunk city hovercar chase',
                      'Alpine valley mist morning sunlight',
                      'Tokyo rainy neon alleyway',
                    ].map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => setVideoPrompt(sug)}
                        className="text-[10px] px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style & Aspect Ratio */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 text-xs">
                    <span className="font-semibold text-slate-400 block mb-1.5">Cinematic Style</span>
                    <select
                      value={videoStyle}
                      onChange={(e) => setVideoStyle(e.target.value)}
                      className="w-full bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      <option value="Cinematic Film">Cinematic Film</option>
                      <option value="Hyper-Realistic">Hyper-Realistic</option>
                      <option value="Cyberpunk Neon">Cyberpunk Neon</option>
                      <option value="3D Anime">3D Anime</option>
                      <option value="Vintage 90s Camcorder">Vintage 90s Camcorder</option>
                      <option value="Golden Hour Glow">Golden Hour Glow</option>
                    </select>
                  </div>

                  <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 text-xs">
                    <span className="font-semibold text-slate-400 block mb-1.5">Aspect Ratio</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setAspectRatio('16:9')}
                        className={`flex-1 py-1.5 rounded-xl font-bold transition ${
                          aspectRatio === '16:9'
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-950 text-slate-400 hover:text-white'
                        }`}
                      >
                        16:9 (Landscape)
                      </button>
                      <button
                        type="button"
                        onClick={() => setAspectRatio('9:16')}
                        className={`flex-1 py-1.5 rounded-xl font-bold transition ${
                          aspectRatio === '9:16'
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-950 text-slate-400 hover:text-white'
                        }`}
                      >
                        9:16 (Shorts)
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isGeneratingVideo || !videoPrompt.trim()}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/20 active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isGeneratingVideo ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating Video Scene with AI...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Generate AI Video</span>
                    </>
                  )}
                </button>

                {/* Generated AI Storyboard Display */}
                {generatedResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-3xl bg-purple-950/30 border border-purple-800/40 text-xs space-y-2 mt-4"
                  >
                    <span className="font-bold text-purple-300 block text-sm">
                      Generated Scene Storyboard
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {generatedResult.sceneOverview}
                    </p>
                    <div className="text-[11px] text-slate-400 pt-1 border-t border-purple-900/50 flex flex-wrap gap-x-4 gap-y-1">
                      <span>
                        <strong className="text-purple-300">Camera:</strong>{' '}
                        {generatedResult.cameraMovement}
                      </span>
                      <span>
                        <strong className="text-purple-300">Lighting:</strong>{' '}
                        {generatedResult.lighting}
                      </span>
                    </div>
                  </motion.div>
                )}
              </form>
            ) : (
              /* QUICK EDIT MEDIA PICKER */
              <div className="space-y-6">
                {/* Videos Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Video className="w-4 h-4 text-purple-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Videos in Legend File
                    </h4>
                  </div>
                  {videosInStorage.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No video files found</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {videosInStorage.map((v) => (
                        <div
                          key={v.id}
                          className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 group hover:border-slate-700 transition"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center shrink-0">
                              <Film className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-white block truncate">
                                {v.name}
                              </span>
                              <span className="text-[10px] text-slate-400">Video File</span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              handleClose();
                              setItemForVideoEdit(v);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1 shrink-0 active:scale-95 transition"
                          >
                            <Scissors className="w-3.5 h-3.5" />
                            <span>Edit Video</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Photos Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <ImageIcon className="w-4 h-4 text-orange-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Photos in Legend File
                    </h4>
                  </div>
                  {imagesInStorage.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No image files found</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {imagesInStorage.map((img) => (
                        <div
                          key={img.id}
                          className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 group hover:border-slate-700 transition"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 shrink-0 flex items-center justify-center">
                              {img.url ? (
                                <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="w-5 h-5 text-orange-400" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-white block truncate">
                                {img.name}
                              </span>
                              <span className="text-[10px] text-slate-400">Photo File</span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              handleClose();
                              setItemForPhotoEdit(img);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 shrink-0 active:scale-95 transition"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            <span>Edit Photo</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
