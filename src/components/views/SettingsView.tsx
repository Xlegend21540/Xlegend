import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Laptop,
  Palette,
  LayoutList,
  LayoutGrid,
  Sparkles,
  Eye,
  Trash2,
  HardDrive,
  RotateCcw,
  Info,
  Check,
  Shield,
  Terminal,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
} from 'lucide-react';
import { useFiles } from '../../context/FileContext';
import { ACCENT_PRESETS } from '../../utils/formatters';
import { AnimationIntensity, SizeUnit, SortField, ThemeMode, ViewMode } from '../../types';
import { PWAInstallButton } from '../PWAInstallButton';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, items, emptyTrash, resetToDemoData, setIsTrashOpen, addToast } = useFiles();

  const [bridgeStatus, setBridgeStatus] = useState<'idle' | 'testing' | 'connected' | 'offline'>('idle');
  const [showShizukuGuide, setShowShizukuGuide] = useState(false);

  const trashCount = items.filter((i) => i.inTrash).length;

  const handleTestBridge = async () => {
    setBridgeStatus('testing');
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(`${settings.shizukuBridgeUrl}/ping`, {
        signal: controller.signal,
        mode: 'cors',
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        setBridgeStatus('connected');
        addToast('Connected to local Shizuku / Root bridge server');
      } else {
        setBridgeStatus('offline');
      }
    } catch (e) {
      setBridgeStatus('offline');
    }
  };

  return (
    <div className="space-y-5 pb-28 max-w-2xl mx-auto">
      {/* Group 1: Appearance */}
      <div className="oneui-card rounded-3xl p-5 border border-slate-200/70 dark:border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 px-1">
          Appearance & Theme
        </h3>

        {/* Theme mode */}
        <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Theme</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Select color appearance</p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            {(['light', 'dark', 'system'] as ThemeMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => updateSettings({ theme: mode })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                  settings.theme === mode
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {mode === 'light' && <Sun className="w-3.5 h-3.5" />}
                {mode === 'dark' && <Moon className="w-3.5 h-3.5" />}
                {mode === 'system' && <Laptop className="w-3.5 h-3.5" />}
                <span>{mode}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Accent Color */}
        <div className="py-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Accent Color</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customizes system buttons, bars, and highlights
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.accentColor}
                onChange={(e) => updateSettings({ accentColor: e.target.value })}
                className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                title="Custom accent hex"
              />
              <span className="text-xs font-mono font-semibold uppercase text-slate-500">
                {settings.accentColor}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {ACCENT_PRESETS.map((preset) => {
              const isSelected = settings.accentColor.toLowerCase() === preset.hex.toLowerCase();
              return (
                <button
                  key={preset.hex}
                  onClick={() => updateSettings({ accentColor: preset.hex })}
                  className="w-9 h-9 rounded-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-2xs"
                  style={{ backgroundColor: preset.hex }}
                  title={preset.name}
                  aria-label={preset.name}
                >
                  {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Default View Mode */}
        <div className="flex items-center justify-between pt-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Default View</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Starting folder layout</p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <button
              onClick={() => updateSettings({ defaultView: 'list' })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                settings.defaultView === 'list'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => updateSettings({ defaultView: 'grid' })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                settings.defaultView === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Group 2: Browsing & Behavior */}
      <div className="oneui-card rounded-3xl p-5 border border-slate-200/70 dark:border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 px-1">
          Browsing & Files
        </h3>

        {/* Default Sort */}
        <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Default Sort</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Default order for files</p>
          </div>

          <select
            value={settings.defaultSort}
            onChange={(e) => updateSettings({ defaultSort: e.target.value as SortField })}
            className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 border-0 focus:outline-none cursor-pointer"
          >
            <option value="name">Name</option>
            <option value="date">Date</option>
            <option value="size">Size</option>
            <option value="type">Type</option>
          </select>
        </div>

        {/* Show hidden files */}
        <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Show Hidden Files</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Display files starting with dot (e.g. .config)
            </p>
          </div>

          <button
            onClick={() => updateSettings({ showHidden: !settings.showHidden })}
            className={`w-12 h-6 rounded-full transition-colors p-0.5 focus:outline-none ${
              settings.showHidden ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                settings.showHidden ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* File Size Units */}
        <div className="flex items-center justify-between pt-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">File Size Units</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Decimal (KB, MB) or Binary (KiB, MiB)
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <button
              onClick={() => updateSettings({ sizeUnit: 'decimal' })}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                settings.sizeUnit === 'decimal'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Decimal (KB)
            </button>
            <button
              onClick={() => updateSettings({ sizeUnit: 'binary' })}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                settings.sizeUnit === 'binary'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Binary (KiB)
            </button>
          </div>
        </div>
      </div>

      {/* Group 3: Motion & Animations */}
      <div className="oneui-card rounded-3xl p-5 border border-slate-200/70 dark:border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 px-1">
          Motion & Performance
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Animation Intensity</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Spring dynamics for page and folder changes
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            {(['full', 'reduced', 'off'] as AnimationIntensity[]).map((level) => (
              <button
                key={level}
                onClick={() => updateSettings({ animationIntensity: level })}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                  settings.animationIntensity === level
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Group 4: Root Access & Shizuku Bridge (NEW) */}
      <div className="oneui-card rounded-3xl p-5 border border-slate-200/70 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-red-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Root Access & Shizuku
            </h3>
          </div>
          <button
            onClick={() => setShowShizukuGuide(true)}
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>How it works</span>
          </button>
        </div>

        {/* Toggle Root Explorer View */}
        <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Root / System Directory Explorer
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Unlock /system, /data, /vendor, and init.rc in file navigation
            </p>
          </div>

          <button
            onClick={() => {
              const next = !settings.rootExplorerEnabled;
              updateSettings({ rootExplorerEnabled: next });
              addToast(next ? 'Root Explorer Mode activated' : 'Root Explorer Mode deactivated');
            }}
            className={`w-12 h-6 rounded-full transition-colors p-0.5 focus:outline-none ${
              settings.rootExplorerEnabled ? 'bg-red-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                settings.rootExplorerEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Shizuku / Root Bridge URL */}
        <div className="py-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Shizuku / Root Local Bridge Server
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Termux or native daemon URL for live root filesystem streaming
              </p>
            </div>
            <button
              onClick={handleTestBridge}
              disabled={bridgeStatus === 'testing'}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition shrink-0"
            >
              {bridgeStatus === 'testing' ? 'Testing...' : 'Test Connection'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={settings.shizukuBridgeUrl}
              onChange={(e) => updateSettings({ shizukuBridgeUrl: e.target.value })}
              placeholder="http://127.0.0.1:8080"
              className="flex-1 px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border-0 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {bridgeStatus === 'connected' && (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Bridge active! Connected to local device root provider.</span>
            </div>
          )}

          {bridgeStatus === 'offline' && (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Bridge offline. Tap &quot;How it works&quot; above to see Termux setup instructions.</span>
            </div>
          )}
        </div>
      </div>

      {/* Group 5: Trash & Storage Maintenance */}
      <div className="oneui-card rounded-3xl p-5 border border-slate-200/70 dark:border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 px-1">
          Storage & Trash
        </h3>

        <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Recycle Bin</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {trashCount} {trashCount === 1 ? 'item' : 'items'} currently in Trash
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTrashOpen(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 transition"
            >
              Open Trash
            </button>
            {trashCount > 0 && (
              <button
                onClick={emptyTrash}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 transition"
              >
                Empty
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Reset to Demo Data</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Restore default folders, DCIM, and files
            </p>
          </div>

          <button
            onClick={resetToDemoData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Files</span>
          </button>
        </div>
      </div>

      {/* Group 6: PWA Installation */}
      <div className="oneui-card rounded-3xl p-5 border border-slate-200/70 dark:border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 px-1">
          Install Application
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Home Screen Shortcut</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Run Legend File offline with full-screen experience
            </p>
          </div>

          <PWAInstallButton />
        </div>
      </div>

      {/* Group 7: About */}
      <div className="oneui-card rounded-3xl p-5 border border-slate-200/70 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg text-white"
            style={{ backgroundColor: settings.accentColor }}
          >
            LF
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Legend File</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Samsung One UI 6.1 Design Concept • Version 2.4.0
            </p>
          </div>
        </div>
      </div>

      {/* Shizuku & Root Guide Modal */}
      {showShizukuGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#161D26] p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
                <Shield className="w-5 h-5 text-red-500" />
                <h3>How Root &amp; Shizuku Work</h3>
              </div>
              <button
                onClick={() => setShowShizukuGuide(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                  1. Browser Security Sandbox
                </h4>
                <p>
                  As a web app / Progressive Web App (PWA), browsers run inside an isolated OS sandbox. Browsers do not permit web pages to invoke Android Binder IPC (`moe.shizuku.server`) or execute `/system/bin/su` directly without a bridge.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                  2. Option A: Termux Local Bridge (No root or Full root)
                </h4>
                <p className="mb-2">
                  You can run a lightweight local bridge in Termux that connects to Shizuku (`rish`) or `su` and streams real Android root files to Legend File:
                </p>
                <div className="bg-slate-900 text-slate-200 p-3 rounded-2xl font-mono text-[11px] select-all overflow-x-auto space-y-1">
                  <p className="text-emerald-400"># 1. Install python or node in Termux:</p>
                  <p>pkg install python</p>
                  <p className="text-emerald-400"># 2. Run local root HTTP bridge with rish or su:</p>
                  <p>rish -c &quot;python3 -m http.server 8080 --bind 127.0.0.1&quot;</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                  3. Option B: Native APK Packaging (Capacitor)
                </h4>
                <p>
                  If you package this React project into a native Android APK using <strong>Capacitor</strong>, the native Android shell can directly import Shizuku’s official Android API (<code>moe.shizuku.api:shizuku-api</code>) and request Binder permissions natively with one tap!
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                  4. In-App Root Explorer Mode
                </h4>
                <p>
                  Enable <strong>&quot;Root / System Directory Explorer&quot;</strong> toggle in Settings to immediately view and inspect simulated or bridged Android system structures (<code>/system</code>, <code>/data</code>, <code>/vendor</code>, <code>build.prop</code>, and <code>init.rc</code>) with Linux permission flags.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowShizukuGuide(false)}
              className="mt-6 w-full rounded-2xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold py-2.5 text-xs shadow-md transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
