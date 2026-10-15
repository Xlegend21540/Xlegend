import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Play,
  Pause,
  Scissors,
  Sparkles,
  Sliders,
  Type,
  Gauge,
  Volume2,
  VolumeX,
  Save,
  RotateCcw,
  Wand2,
  Film,
  Loader2,
  Check,
  Video as VideoIcon,
  Subtitles,
  Tv,
} from 'lucide-react';
import { useFiles } from '../context/FileContext';
import { FSItem } from '../types';

export const VideoEditorModal: React.FC = () => {
  const { itemForVideoEdit, setItemForVideoEdit, saveEditedMedia, settings, addToast } = useFiles();
  const file = itemForVideoEdit;

  // Active Tool Tab: 'ai' | 'trim' | 'filters' | 'text' | 'speed'
  const [activeTab, setActiveTab] = useState<'ai' | 'trim' | 'filters' | 'text' | 'speed'>('ai');

  // Video playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(15); // simulated duration in seconds if no video tag

  // Trimming State
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(15);

  // Speed & Audio
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);

  // Filters & Color Grading
  const [selectedFilter, setSelectedFilter] = useState<string>('normal');
  const [filterSettings, setFilterSettings] = useState({
    brightness: 100,
    contrast: 100,
    saturate: 100,
    sepia: 0,
    hueRotate: 0,
  });

  // Text & Subtitles Overlay
  const [overlayText, setOverlayText] = useState('');
  const [textPosition, setTextPosition] = useState<'top' | 'center' | 'bottom'>('bottom');
  const [timedCaptions, setTimedCaptions] = useState<{ time: number; text: string }[]>([]);

  // AI Video State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiDirectorResult, setAiDirectorResult] = useState<{
    videoTitle?: string;
    colorGrade?: string;
    scriptHook?: string;
    aiDirectorAdvice?: string;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize duration and bounds when opening
  useEffect(() => {
    if (file) {
      setTrimStart(0);
      setTrimEnd(15);
      setCurrentTime(0);
      setIsPlaying(false);
      setSelectedFilter('normal');
      setOverlayText('');
      setTimedCaptions([]);
      setAiDirectorResult(null);
    }
  }, [file]);

  if (!file) return null;

  const handleClose = () => {
    setItemForVideoEdit(null);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (file.url && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        if (currentTime >= trimEnd) {
          videoRef.current.currentTime = trimStart;
        }
        videoRef.current.play().catch(() => {});
      }
    }
    setIsPlaying((prev) => !prev);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      setCurrentTime(cur);
      // Loop within trim range
      if (cur >= trimEnd) {
        videoRef.current.currentTime = trimStart;
      }
    }
  };

  // Format seconds to mm:ss.s
  const formatTimecode = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = (sec % 60).toFixed(1);
    return `${m.toString().padStart(2, '0')}:${parseFloat(s) < 10 ? '0' : ''}${s}`;
  };

  // Compute CSS filter for video
  const getVideoFilterStyle = () => {
    return `brightness(${filterSettings.brightness}%) contrast(${filterSettings.contrast}%) saturate(${filterSettings.saturate}%) sepia(${filterSettings.sepia}%) hue-rotate(${filterSettings.hueRotate}deg)`;
  };

  // Simulated timeline playback when no binary video URL is provided
  useEffect(() => {
    if (!isPlaying || file.url) return;
    const interval = setInterval(() => {
      setCurrentTime((cur) => {
        const next = cur + 0.1 * playbackSpeed;
        if (next >= trimEnd) {
          return trimStart;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, file.url, trimStart, trimEnd, playbackSpeed]);

  // Draw simulated dynamic video canvas monitor when !file.url
  useEffect(() => {
    if (file.url || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background gradient - dynamic with timecode
    const grad = ctx.createLinearGradient(0, 0, width, height);
    const progress = duration > 0 ? (currentTime % duration) / duration : 0;
    grad.addColorStop(0, '#090D16');
    grad.addColorStop(0.5, '#1E1B4B');
    grad.addColorStop(1, '#0F172A');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Glowing orb / sun
    const sunX = width * 0.2 + progress * (width * 0.6);
    const sunY = height * 0.35 + Math.sin(progress * Math.PI) * -30;
    const sunGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 120);
    sunGrad.addColorStop(0, 'rgba(168, 85, 247, 0.9)');
    sunGrad.addColorStop(0.4, 'rgba(59, 130, 246, 0.4)');
    sunGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 120, 0, Math.PI * 2);
    ctx.fill();

    // Mountain silhouettes in background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, height * 0.65);
    ctx.lineTo(width * 0.25, height * 0.45);
    ctx.lineTo(width * 0.5, height * 0.7);
    ctx.lineTo(width * 0.75, height * 0.4);
    ctx.lineTo(width, height * 0.6);
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // Foreground hills
    ctx.fillStyle = '#060911';
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, height * 0.8);
    ctx.quadraticCurveTo(width * 0.35, height * 0.65, width * 0.65, height * 0.82);
    ctx.quadraticCurveTo(width * 0.85, height * 0.92, width, height * 0.78);
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // Animated Audio Waveform in monitor
    const bars = 24;
    const barWidth = 6;
    const barGap = 4;
    const startX = width / 2 - (bars * (barWidth + barGap)) / 2;
    const centerY = height * 0.82;
    for (let i = 0; i < bars; i++) {
      const freq = Math.sin(currentTime * 4 + i * 0.5) * 0.5 + 0.5;
      const h = Math.max(6, freq * 36);
      ctx.fillStyle = isPlaying ? '#38BDF8' : '#64748B';
      ctx.fillRect(startX + i * (barWidth + barGap), centerY - h / 2, barWidth, h);
    }

    // Top HUD
    ctx.fillStyle = '#F8FAFC';
    ctx.font = '600 16px monospace';
    ctx.fillText('REC ● 60FPS 4K UHD', 32, 40);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '500 14px monospace';
    ctx.fillText(`${file.name}`, 32, 64);

    // Right HUD: Timecode
    ctx.textAlign = 'right';
    ctx.fillStyle = '#38BDF8';
    ctx.font = '700 16px monospace';
    ctx.fillText(`${formatTimecode(currentTime)} / ${formatTimecode(duration)}`, width - 32, 40);
    ctx.textAlign = 'left';
  }, [file.name, file.url, currentTime, duration, isPlaying]);

  // Color Grade Preset Application
  const applyColorGrade = (grade: string) => {
    setSelectedFilter(grade);
    switch (grade) {
      case 'Cinematic Teal & Orange':
        setFilterSettings({ brightness: 105, contrast: 125, saturate: 135, sepia: 15, hueRotate: 345 });
        break;
      case 'Cyberpunk Neon':
        setFilterSettings({ brightness: 110, contrast: 135, saturate: 160, sepia: 10, hueRotate: 280 });
        break;
      case 'Golden Hour Glow':
        setFilterSettings({ brightness: 115, contrast: 115, saturate: 130, sepia: 40, hueRotate: 25 });
        break;
      case 'Vintage 90s VHS':
        setFilterSettings({ brightness: 105, contrast: 110, saturate: 85, sepia: 30, hueRotate: 350 });
        break;
      case 'Film Noir B&W':
        setFilterSettings({ brightness: 105, contrast: 145, saturate: 0, sepia: 0, hueRotate: 0 });
        break;
      case 'Pop Vivid':
        setFilterSettings({ brightness: 110, contrast: 120, saturate: 150, sepia: 0, hueRotate: 0 });
        break;
      default:
        setFilterSettings({ brightness: 100, contrast: 100, saturate: 100, sepia: 0, hueRotate: 0 });
    }
  };

  // Run AI Video Analysis & Director
  const handleRunAiDirector = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/ai/analyze-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoTitle: file.name,
          prompt: aiPrompt,
          duration: trimEnd - trimStart,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAiDirectorResult({
          videoTitle: data.videoTitle,
          colorGrade: data.colorGrade,
          scriptHook: data.scriptHook,
          aiDirectorAdvice: data.aiDirectorAdvice,
        });

        if (data.colorGrade) {
          applyColorGrade(data.colorGrade);
        } else if (data.filterSettings) {
          setFilterSettings(data.filterSettings);
        }

        if (data.scriptHook) {
          setOverlayText(data.scriptHook);
        }

        if (data.captions && Array.isArray(data.captions)) {
          setTimedCaptions(data.captions);
        }

        addToast(`AI Director applied: "${data.colorGrade || 'Cinematic Grade'}"`);
      } else {
        applyColorGrade('Cinematic Teal & Orange');
        setOverlayText('Highlight of the Year');
        addToast('Applied Cinematic Teal & Orange grade');
      }
    } catch (e) {
      applyColorGrade('Cinematic Teal & Orange');
      setOverlayText('Highlight of the Year');
      addToast('Applied Cinematic Teal & Orange grade');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Find active timed caption
  const activeCaption = timedCaptions.find(
    (c) => currentTime >= c.time && currentTime < c.time + 3.5
  )?.text;

  // Save the edited video to Legend File
  const handleSaveVideo = () => {
    const nameParts = file.name.split('.');
    const ext = nameParts.pop() || 'mp4';
    const baseName = nameParts.join('.');
    const newName = `${baseName}_Edited.${ext}`;

    const newDuration = Math.max(1, trimEnd - trimStart);
    const sizeRatio = newDuration / (duration || 15);

    let finalUrl = file.url;
    if (!finalUrl && canvasRef.current) {
      try {
        finalUrl = canvasRef.current.toDataURL('image/jpeg', 0.85);
      } catch {
        // ignore canvas security error if any
      }
    }

    saveEditedMedia({
      name: newName,
      extension: ext,
      category: 'videos',
      size: Math.floor(file.size * sizeRatio),
      url: finalUrl,
      parentId: file.parentId,
    });

    handleClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl h-[94vh] bg-[#12161F] text-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-800"
        >
          {/* 1. Header */}
          <div className="px-5 py-3.5 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${settings.accentColor}25`, color: settings.accentColor }}
              >
                <Film className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white truncate">AI Video Studio & Editor</h3>
                <p className="text-[11px] text-slate-400 truncate">{file.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleSaveVideo}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md active:scale-95 transition"
                style={{ backgroundColor: settings.accentColor }}
              >
                <Save className="w-3.5 h-3.5" />
                <span>Export & Save</span>
              </button>

              <button
                onClick={handleClose}
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 2. Video Preview & Monitor Stage */}
          <div className="flex-1 overflow-hidden relative flex flex-col items-center justify-center p-4 bg-[#0A0D14] select-none">
            <div className="relative max-w-full max-h-[50vh] aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black flex items-center justify-center border border-slate-800/80">
              {/* Guarded Video Element if URL exists, or dynamic Canvas monitor if no raw URL */}
              {file.url ? (
                <video
                  ref={videoRef}
                  src={file.url}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={(e) => {
                    const d = (e.target as HTMLVideoElement).duration || 15;
                    setDuration(d);
                    setTrimEnd(d);
                  }}
                  muted={isMuted}
                  playsInline
                  style={{ filter: getVideoFilterStyle() }}
                  className="w-full h-full object-contain"
                />
              ) : (
                <canvas
                  ref={canvasRef}
                  width={960}
                  height={540}
                  style={{ filter: getVideoFilterStyle() }}
                  className="w-full h-full object-contain"
                />
              )}

              {/* Live Overlay Subtitle / Hook Badge */}
              {(overlayText || activeCaption) && (
                <div
                  className={`absolute inset-x-6 z-20 flex justify-center pointer-events-none ${
                    textPosition === 'top'
                      ? 'top-4'
                      : textPosition === 'center'
                      ? 'top-1/2 -translate-y-1/2'
                      : 'bottom-6'
                  }`}
                >
                  <span className="px-4 py-2 rounded-xl bg-black/80 backdrop-blur-md text-white font-bold text-xs sm:text-sm tracking-wide shadow-xl text-center max-w-[85%] border border-white/20">
                    {activeCaption || overlayText}
                  </span>
                </div>
              )}

              {/* Big Center Play Button Overlay */}
              {!isPlaying && (
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition group"
                >
                  <div className="w-16 h-16 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition active:scale-95">
                    <Play className="w-7 h-7 fill-current ml-1" />
                  </div>
                </button>
              )}
            </div>

            {/* Video Playback & Timeline Scrubber Bar */}
            <div className="w-full max-w-2xl mt-4 px-4 py-2.5 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>{formatTimecode(currentTime)}</span>
                <span className="text-white font-bold">{formatTimecode(trimEnd - trimStart)} Clip</span>
                <span>{formatTimecode(duration)}</span>
              </div>

              {/* Scrubber slider */}
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition shrink-0"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>

                <input
                  type="range"
                  min="0"
                  max={duration}
                  step="0.1"
                  value={currentTime}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setCurrentTime(val);
                    if (videoRef.current) videoRef.current.currentTime = val;
                  }}
                  className="flex-1 accent-blue-500 cursor-pointer h-1.5"
                />

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-1.5 rounded-lg text-xs transition ${
                    isMuted ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-300'
                  }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* 3. Bottom Tool Panels */}
          <div className="bg-[#161D26] border-t border-slate-800 flex flex-col shrink-0">
            {/* Tool Body */}
            <div className="p-4 max-h-48 overflow-y-auto">
              {/* TAB 1: AI Video Director */}
              {activeTab === 'ai' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Sparkles className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRunAiDirector()}
                        placeholder="e.g. 'Create a cinematic trailer with subtitles', 'Fast viral social cuts'..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <button
                      onClick={handleRunAiDirector}
                      disabled={isAiLoading || !aiPrompt.trim()}
                      className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition disabled:opacity-50 shrink-0"
                    >
                      {isAiLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Wand2 className="w-4 h-4" />
                      )}
                      <span>AI Direct</span>
                    </button>
                  </div>

                  {/* AI Quick Styles */}
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    {[
                      'Cinematic Teal & Orange',
                      'Cyberpunk Neon',
                      'Golden Hour Glow',
                      'Vintage 90s VHS',
                      'Film Noir B&W',
                      'Pop Vivid',
                    ].map((grade) => (
                      <button
                        key={grade}
                        onClick={() => applyColorGrade(grade)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                          selectedFilter === grade
                            ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                        }`}
                      >
                        {grade}
                      </button>
                    ))}
                  </div>

                  {/* AI Director Advice Banner */}
                  {aiDirectorResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-2xl bg-purple-950/30 border border-purple-800/40 text-xs flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-300">
                          AI Director: {aiDirectorResult.colorGrade}
                        </span>
                        {aiDirectorResult.videoTitle && (
                          <span className="text-[11px] text-purple-400 font-semibold truncate max-w-[200px]">
                            Title: &quot;{aiDirectorResult.videoTitle}&quot;
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {aiDirectorResult.aiDirectorAdvice}
                      </p>
                    </motion.div>
                  )}
                </div>
              )}

              {/* TAB 2: Trim & Cut */}
              {activeTab === 'trim' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                      <div className="flex items-center justify-between mb-1 text-slate-300">
                        <span>Start Cut Point</span>
                        <span className="font-mono font-bold text-blue-400">
                          {formatTimecode(trimStart)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={trimEnd - 1}
                        step="0.5"
                        value={trimStart}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setTrimStart(val);
                          if (currentTime < val) setCurrentTime(val);
                        }}
                        className="w-full accent-blue-500 cursor-pointer"
                      />
                    </div>

                    <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
                      <div className="flex items-center justify-between mb-1 text-slate-300">
                        <span>End Cut Point</span>
                        <span className="font-mono font-bold text-blue-400">
                          {formatTimecode(trimEnd)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={trimStart + 1}
                        max={duration}
                        step="0.5"
                        value={trimEnd}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setTrimEnd(val);
                          if (currentTime > val) setCurrentTime(val);
                        }}
                        className="w-full accent-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 text-center">
                    Exported video duration will be{' '}
                    <strong className="text-white font-mono">
                      {(trimEnd - trimStart).toFixed(1)} seconds
                    </strong>
                  </p>
                </div>
              )}

              {/* TAB 3: Filters & Color Grading */}
              {activeTab === 'filters' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    'Normal',
                    'Cinematic Teal & Orange',
                    'Cyberpunk Neon',
                    'Golden Hour Glow',
                    'Vintage 90s VHS',
                    'Film Noir B&W',
                    'Pop Vivid',
                  ].map((f) => (
                    <button
                      key={f}
                      onClick={() => applyColorGrade(f)}
                      className={`p-2.5 rounded-xl border text-center transition ${
                        selectedFilter === f
                          ? 'bg-blue-600 border-blue-500 text-white font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}

              {/* TAB 4: Subtitles & Text Overlay */}
              {activeTab === 'text' && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={overlayText}
                      onChange={(e) => setOverlayText(e.target.value)}
                      placeholder="Add title, hook, or caption over video..."
                      className="flex-1 px-3.5 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {overlayText && (
                      <button
                        onClick={() => setOverlayText('')}
                        className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Position:</span>
                    {(['top', 'center', 'bottom'] as const).map((pos) => (
                      <button
                        key={pos}
                        onClick={() => setTextPosition(pos)}
                        className={`px-3 py-1 rounded-xl capitalize font-semibold transition ${
                          textPosition === pos
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: Playback Speed */}
              {activeTab === 'speed' && (
                <div className="flex items-center justify-center gap-3 py-2">
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => {
                        setPlaybackSpeed(spd);
                        if (videoRef.current) videoRef.current.playbackRate = spd;
                      }}
                      className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition ${
                        playbackSpeed === spd
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Tab Bar */}
            <div className="px-6 py-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-around">
              <button
                onClick={() => setActiveTab('ai')}
                className={`flex flex-col items-center gap-1 text-xs font-semibold transition ${
                  activeTab === 'ai' ? 'text-purple-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Director</span>
              </button>

              <button
                onClick={() => setActiveTab('trim')}
                className={`flex flex-col items-center gap-1 text-xs font-semibold transition ${
                  activeTab === 'trim' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Scissors className="w-4 h-4" />
                <span>Trim & Cut</span>
              </button>

              <button
                onClick={() => setActiveTab('filters')}
                className={`flex flex-col items-center gap-1 text-xs font-semibold transition ${
                  activeTab === 'filters' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Color Grade</span>
              </button>

              <button
                onClick={() => setActiveTab('text')}
                className={`flex flex-col items-center gap-1 text-xs font-semibold transition ${
                  activeTab === 'text' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Subtitles className="w-4 h-4" />
                <span>Captions</span>
              </button>

              <button
                onClick={() => setActiveTab('speed')}
                className={`flex flex-col items-center gap-1 text-xs font-semibold transition ${
                  activeTab === 'speed' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Gauge className="w-4 h-4" />
                <span>Speed</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
