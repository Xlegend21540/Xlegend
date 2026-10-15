import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Sliders,
  Crop,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Check,
  RotateCcw,
  Save,
  Wand2,
  Image as ImageIcon,
  Loader2,
  Eye,
  Palette,
  Sun,
  Contrast,
  Droplet,
} from 'lucide-react';
import { useFiles } from '../context/FileContext';
import { FSItem } from '../types';

export const PhotoEditorModal: React.FC = () => {
  const { itemForPhotoEdit, setItemForPhotoEdit, saveEditedMedia, settings, addToast } = useFiles();
  const file = itemForPhotoEdit;

  // Active Tool Tab: 'ai' | 'tune' | 'transform'
  const [activeTab, setActiveTab] = useState<'ai' | 'tune' | 'transform'>('ai');

  // Tune Adjustments
  const [brightness, setBrightness] = useState(0); // -100 to 100
  const [contrast, setContrast] = useState(0); // -100 to 100
  const [saturation, setSaturation] = useState(0); // -100 to 100
  const [sepia, setSepia] = useState(0); // 0 to 100
  const [blur, setBlur] = useState(0); // 0 to 15
  const [hueRotate, setHueRotate] = useState(0); // 0 to 360

  // Transform
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<'free' | '1:1' | '4:3' | '16:9' | '9:16'>('free');

  // AI Prompt & State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{
    filterName?: string;
    aiSummary?: string;
    artisticDescription?: string;
    colorPalette?: string[];
  } | null>(null);

  // Compare mode (view original)
  const [isComparing, setIsComparing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Reset when opening a new photo
  useEffect(() => {
    if (file) {
      handleResetAll();
    }
  }, [file]);

  if (!file) return null;

  const handleClose = () => {
    setItemForPhotoEdit(null);
  };

  const handleResetAll = () => {
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setSepia(0);
    setBlur(0);
    setHueRotate(0);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setAspectRatio('free');
    setAiResult(null);
    setAiPrompt('');
  };

  // Compute CSS filter string
  const getFilterStyle = (originalOnly = false) => {
    if (originalOnly) return 'none';
    const b = 100 + brightness;
    const c = 100 + contrast;
    const s = 100 + saturation;
    return `brightness(${b}%) contrast(${c}%) saturate(${s}%) sepia(${sepia}%) blur(${blur}px) hue-rotate(${hueRotate}deg)`;
  };

  const getTransformStyle = (originalOnly = false) => {
    if (originalOnly) return 'none';
    return `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`;
  };

  // AI Prompt Action
  const handleRunAiEdit = async (customPrompt?: string) => {
    const promptToUse = customPrompt || aiPrompt;
    if (!promptToUse.trim()) return;

    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/edit-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToUse,
          imageBase64: file.url || '',
          mimeType: file.mimeType || 'image/jpeg',
        }),
      });

      const data = await res.json();
      if (data.success && data.suggestedAdjustments) {
        const adj = data.suggestedAdjustments;
        if (typeof adj.brightness === 'number') setBrightness(Math.max(-80, Math.min(80, adj.brightness)));
        if (typeof adj.contrast === 'number') setContrast(Math.max(-80, Math.min(80, adj.contrast)));
        if (typeof adj.saturation === 'number') setSaturation(Math.max(-80, Math.min(80, adj.saturation)));
        if (typeof adj.blur === 'number') setBlur(Math.max(0, Math.min(10, adj.blur)));
        if (typeof adj.sepia === 'number') setSepia(Math.max(0, Math.min(100, adj.sepia)));
        if (typeof adj.hueRotate === 'number') setHueRotate(Math.max(0, Math.min(360, adj.hueRotate)));

        setAiResult({
          filterName: data.filterName,
          aiSummary: data.aiSummary,
          artisticDescription: data.artisticDescription,
          colorPalette: data.colorPalette,
        });

        addToast(`AI Look Applied: "${data.filterName || 'Smart Enhancement'}"`);
      } else {
        // Fallback enhancement preset if offline/error
        applyPreset('Galaxy Nightography');
        addToast('Applied Galaxy AI Nightography look');
      }
    } catch (e) {
      applyPreset('Galaxy Nightography');
      addToast('Applied Galaxy AI Nightography look');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Quick AI Presets
  const applyPreset = (name: string) => {
    switch (name) {
      case 'Auto-Enhance':
        setBrightness(12);
        setContrast(18);
        setSaturation(25);
        setSepia(0);
        setBlur(0);
        setHueRotate(0);
        setAiResult({
          filterName: 'Auto-Enhance',
          aiSummary: 'Optimized dynamic range, lifted shadow detail, and enriched vibrant color tones.',
        });
        break;
      case 'Galaxy Nightography':
        setBrightness(-5);
        setContrast(30);
        setSaturation(35);
        setSepia(0);
        setBlur(0);
        setHueRotate(350);
        setAiResult({
          filterName: 'Galaxy Nightography',
          aiSummary: 'High-contrast neon punch with deep midnight blacks and amplified ambient glow.',
          colorPalette: ['#0A0F1D', '#3B82F6', '#EC4899', '#F59E0B'],
        });
        break;
      case 'Cyberpunk Neon':
        setBrightness(10);
        setContrast(35);
        setSaturation(50);
        setSepia(15);
        setBlur(0);
        setHueRotate(280);
        setAiResult({
          filterName: 'Cyberpunk Neon',
          aiSummary: 'Stylized cyan & magenta color grading with intense hyper-saturated highlights.',
          colorPalette: ['#7C3AED', '#06B6D4', '#F43F5E', '#1E1B4B'],
        });
        break;
      case 'Golden Hour':
        setBrightness(15);
        setContrast(15);
        setSaturation(30);
        setSepia(35);
        setBlur(0);
        setHueRotate(20);
        setAiResult({
          filterName: 'Golden Hour Glow',
          aiSummary: 'Warm afternoon sunlight with amber highlights and soft natural skin tones.',
          colorPalette: ['#F59E0B', '#EA580C', '#78350F', '#FEF3C7'],
        });
        break;
      case 'Studio Portrait':
        setBrightness(10);
        setContrast(12);
        setSaturation(10);
        setSepia(5);
        setBlur(0);
        setHueRotate(0);
        setAiResult({
          filterName: 'Studio Portrait',
          aiSummary: 'Balanced studio key-lighting with velvety contrast and flattering skin tones.',
          colorPalette: ['#FFFFFF', '#E2E8F0', '#64748B', '#0F172A'],
        });
        break;
      case 'Vintage 1970s':
        setBrightness(5);
        setContrast(20);
        setSaturation(-10);
        setSepia(55);
        setBlur(0);
        setHueRotate(345);
        setAiResult({
          filterName: 'Vintage 1970s Film',
          aiSummary: 'Authentic analog film look with faded blacks, warm sepia grain, and nostalgic color cast.',
          colorPalette: ['#78350F', '#B45309', '#FDE68A', '#451A03'],
        });
        break;
      case 'Monochrome Noir':
        setBrightness(5);
        setContrast(45);
        setSaturation(-100);
        setSepia(0);
        setBlur(0);
        setHueRotate(0);
        setAiResult({
          filterName: 'Monochrome Noir',
          aiSummary: 'Dramatic black and white with crushed shadows and crisp silver highlights.',
          colorPalette: ['#000000', '#334155', '#94A3B8', '#FFFFFF'],
        });
        break;
    }
  };

  // Save the edited picture to Legend File
  const handleSave = () => {
    // Generate a high-res canvas render
    const img = imageRef.current;
    if (!img) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = img.naturalWidth || 800;
    canvas.height = img.naturalHeight || 600;

    ctx.save();
    ctx.filter = getFilterStyle();

    // Apply rotation and flips
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    ctx.restore();

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

    const nameParts = file.name.split('.');
    const ext = nameParts.pop() || 'jpg';
    const baseName = nameParts.join('.');
    const newName = `${baseName}_AI_Edited.${ext}`;

    saveEditedMedia({
      name: newName,
      extension: ext,
      category: 'images',
      size: Math.floor(file.size * 0.95),
      url: dataUrl,
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
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white truncate">AI Photo Studio</h3>
                <p className="text-[11px] text-slate-400 truncate">{file.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Press & Hold to Compare Original */}
              <button
                onMouseDown={() => setIsComparing(true)}
                onMouseUp={() => setIsComparing(false)}
                onTouchStart={() => setIsComparing(true)}
                onTouchEnd={() => setIsComparing(false)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition select-none ${
                  isComparing
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
                title="Hold to see original"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isComparing ? 'Original' : 'Compare'}</span>
              </button>

              <button
                onClick={handleResetAll}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Reset all edits"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md active:scale-95 transition"
                style={{ backgroundColor: settings.accentColor }}
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Copy</span>
              </button>

              <button
                onClick={handleClose}
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 2. Main Canvas / Preview Stage */}
          <div className="flex-1 overflow-hidden relative flex items-center justify-center p-4 bg-[#0B0E14] select-none">
            {file.url ? (
              <div
                className={`relative max-w-full max-h-full flex items-center justify-center transition-all ${
                  aspectRatio === '1:1'
                    ? 'aspect-square'
                    : aspectRatio === '16:9'
                    ? 'aspect-video'
                    : aspectRatio === '9:16'
                    ? 'aspect-[9/16]'
                    : aspectRatio === '4:3'
                    ? 'aspect-[4/3]'
                    : ''
                }`}
              >
                <img
                  ref={imageRef}
                  src={file.url}
                  alt={file.name}
                  style={{
                    filter: getFilterStyle(isComparing),
                    transform: getTransformStyle(isComparing),
                    transition: isComparing ? 'none' : 'filter 0.2s ease, transform 0.25s ease',
                  }}
                  className="max-w-full max-h-[55vh] object-contain rounded-xl shadow-2xl"
                />

                {isComparing && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-[10px] font-bold tracking-wider uppercase text-amber-400 border border-amber-500/30">
                    Original Image
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-slate-500">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-40" />
                <p className="text-xs">No image preview available</p>
              </div>
            )}
          </div>

          {/* 3. Bottom Tool Panels */}
          <div className="bg-[#161D26] border-t border-slate-800 flex flex-col shrink-0">
            {/* Tab Body */}
            <div className="p-4 max-h-48 overflow-y-auto">
              {/* TAB 1: AI Magic Studio */}
              {activeTab === 'ai' && (
                <div className="space-y-3">
                  {/* AI Prompt Input Bar */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Sparkles className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRunAiEdit()}
                        placeholder="Describe AI edit: e.g. 'Cyberpunk glow', 'Warm 1970s analog grain'..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <button
                      onClick={() => handleRunAiEdit()}
                      disabled={isAiLoading || !aiPrompt.trim()}
                      className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition disabled:opacity-50"
                    >
                      {isAiLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Wand2 className="w-4 h-4" />
                      )}
                      <span>Magic Edit</span>
                    </button>
                  </div>

                  {/* AI Quick Presets Grid */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Galaxy AI Magic Presets
                    </span>
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                      {[
                        'Auto-Enhance',
                        'Galaxy Nightography',
                        'Cyberpunk Neon',
                        'Golden Hour',
                        'Studio Portrait',
                        'Vintage 1970s',
                        'Monochrome Noir',
                      ].map((name) => (
                        <button
                          key={name}
                          onClick={() => applyPreset(name)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-xs font-semibold text-slate-200 whitespace-nowrap active:scale-95 transition"
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* AI Result Feedback Banner */}
                  {aiResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-2.5 rounded-2xl bg-purple-950/30 border border-purple-800/40 text-xs flex items-start gap-2.5"
                    >
                      <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-purple-300 block">
                          {aiResult.filterName || 'AI Enhancement'}
                        </span>
                        <p className="text-[11px] text-slate-300 mt-0.5">{aiResult.aiSummary}</p>
                      </div>
                      {aiResult.colorPalette && (
                        <div className="flex items-center gap-1 shrink-0">
                          {aiResult.colorPalette.map((col, idx) => (
                            <span
                              key={idx}
                              className="w-3.5 h-3.5 rounded-full border border-black/40"
                              style={{ backgroundColor: col }}
                              title={col}
                            />
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              )}

              {/* TAB 2: Manual Tuning & Sliders */}
              {activeTab === 'tune' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  {/* Brightness */}
                  <div className="bg-slate-900/60 p-2.5 rounded-2xl border border-slate-800">
                    <div className="flex items-center justify-between mb-1 text-slate-300">
                      <span>Brightness</span>
                      <span className="font-mono tabular-nums">{brightness}</span>
                    </div>
                    <input
                      type="range"
                      min="-80"
                      max="80"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full accent-blue-500 cursor-pointer"
                    />
                  </div>

                  {/* Contrast */}
                  <div className="bg-slate-900/60 p-2.5 rounded-2xl border border-slate-800">
                    <div className="flex items-center justify-between mb-1 text-slate-300">
                      <span>Contrast</span>
                      <span className="font-mono tabular-nums">{contrast}</span>
                    </div>
                    <input
                      type="range"
                      min="-80"
                      max="80"
                      value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                      className="w-full accent-blue-500 cursor-pointer"
                    />
                  </div>

                  {/* Saturation */}
                  <div className="bg-slate-900/60 p-2.5 rounded-2xl border border-slate-800">
                    <div className="flex items-center justify-between mb-1 text-slate-300">
                      <span>Saturation</span>
                      <span className="font-mono tabular-nums">{saturation}</span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={saturation}
                      onChange={(e) => setSaturation(Number(e.target.value))}
                      className="w-full accent-blue-500 cursor-pointer"
                    />
                  </div>

                  {/* Sepia */}
                  <div className="bg-slate-900/60 p-2.5 rounded-2xl border border-slate-800">
                    <div className="flex items-center justify-between mb-1 text-slate-300">
                      <span>Warmth / Sepia</span>
                      <span className="font-mono tabular-nums">{sepia}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sepia}
                      onChange={(e) => setSepia(Number(e.target.value))}
                      className="w-full accent-blue-500 cursor-pointer"
                    />
                  </div>

                  {/* Blur */}
                  <div className="bg-slate-900/60 p-2.5 rounded-2xl border border-slate-800">
                    <div className="flex items-center justify-between mb-1 text-slate-300">
                      <span>Soft Blur</span>
                      <span className="font-mono tabular-nums">{blur}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="12"
                      value={blur}
                      onChange={(e) => setBlur(Number(e.target.value))}
                      className="w-full accent-blue-500 cursor-pointer"
                    />
                  </div>

                  {/* Hue Rotate */}
                  <div className="bg-slate-900/60 p-2.5 rounded-2xl border border-slate-800">
                    <div className="flex items-center justify-between mb-1 text-slate-300">
                      <span>Color Hue</span>
                      <span className="font-mono tabular-nums">{hueRotate}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={hueRotate}
                      onChange={(e) => setHueRotate(Number(e.target.value))}
                      className="w-full accent-blue-500 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: Transform & Crop */}
              {activeTab === 'transform' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setRotation((r) => (r + 90) % 360)}
                      className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold"
                    >
                      <RotateCw className="w-4 h-4" />
                      <span>Rotate 90° ({rotation}°)</span>
                    </button>
                    <button
                      onClick={() => setFlipH(!flipH)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold border transition ${
                        flipH
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      <FlipHorizontal className="w-4 h-4" />
                      <span>Flip Horizontal</span>
                    </button>
                    <button
                      onClick={() => setFlipV(!flipV)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold border transition ${
                        flipV
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      <FlipVertical className="w-4 h-4" />
                      <span>Flip Vertical</span>
                    </button>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Aspect Ratio Frame
                    </span>
                    <div className="flex items-center gap-2">
                      {(['free', '1:1', '4:3', '16:9', '9:16'] as const).map((ratio) => (
                        <button
                          key={ratio}
                          onClick={() => setAspectRatio(ratio)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase transition ${
                            aspectRatio === ratio
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {ratio}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Navigation Buttons */}
            <div className="px-6 py-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-around">
              <button
                onClick={() => setActiveTab('ai')}
                className={`flex flex-col items-center gap-1 text-xs font-semibold transition ${
                  activeTab === 'ai' ? 'text-purple-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Magic</span>
              </button>

              <button
                onClick={() => setActiveTab('tune')}
                className={`flex flex-col items-center gap-1 text-xs font-semibold transition ${
                  activeTab === 'tune' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Adjustments</span>
              </button>

              <button
                onClick={() => setActiveTab('transform')}
                className={`flex flex-col items-center gap-1 text-xs font-semibold transition ${
                  activeTab === 'transform' ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Crop className="w-4 h-4" />
                <span>Transform</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
