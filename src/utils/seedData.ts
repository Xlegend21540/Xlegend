import { FSItem } from '../types';

// Sleek SVG Data URLs for built-in visual previews
const createSampleImage = (title: string, bg1: string, bg2: string, subtitle: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg1}" />
        <stop offset="100%" stop-color="${bg2}" />
      </linearGradient>
      <filter id="f" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000" flood-opacity="0.25"/>
      </filter>
    </defs>
    <rect width="800" height="600" fill="url(#g)" />
    <circle cx="400" cy="240" r="140" fill="#ffffff" opacity="0.15" filter="url(#f)" />
    <circle cx="560" cy="180" r="90" fill="#ffffff" opacity="0.1" />
    <path d="M 0 520 Q 200 420 400 480 T 800 460 L 800 600 L 0 600 Z" fill="#ffffff" opacity="0.2" />
    <path d="M 0 550 Q 260 490 520 540 T 800 520 L 800 600 L 0 600 Z" fill="#ffffff" opacity="0.25" />
    <text x="400" y="270" font-family="-apple-system, system-ui, sans-serif" font-size="34" font-weight="700" fill="#ffffff" text-anchor="middle" filter="url(#f)">${title}</text>
    <text x="400" y="315" font-family="-apple-system, system-ui, sans-serif" font-size="18" font-weight="500" fill="#ffffff" opacity="0.9" text-anchor="middle">${subtitle}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const INITIAL_FS_ITEMS: FSItem[] = [
  // root / user
  {
    id: 'folder-user',
    parentId: null,
    name: 'user',
    type: 'folder',
    category: 'other',
    size: 0,
    color: '#2A72DE', // Samsung Blue
    isFavorite: false,
    isPinnedHome: true,
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 2,
  },

  // root / user / dcmi
  {
    id: 'folder-dcmi',
    parentId: 'folder-user',
    name: 'dcmi',
    type: 'folder',
    category: 'images',
    size: 0,
    color: '#EA580C', // Coral Orange
    isFavorite: true,
    isPinnedHome: true,
    createdAt: Date.now() - 86400000 * 28,
    updatedAt: Date.now() - 86400000 * 1,
  },

  // root / user / dcmi / abc
  {
    id: 'folder-abc',
    parentId: 'folder-dcmi',
    name: 'abc',
    type: 'folder',
    category: 'documents',
    size: 0,
    color: '#7C3AED', // Violet Purple
    isFavorite: true,
    isPinnedHome: false,
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now() - 86400000 * 1,
  },

  // root / user / dcmi / abc / test.txt (as requested!)
  {
    id: 'file-test-txt',
    parentId: 'folder-abc',
    name: 'test.txt',
    type: 'file',
    extension: 'txt',
    category: 'documents',
    size: 1420,
    isFavorite: true,
    isPinnedHome: false,
    createdAt: Date.now() - 86400000 * 14,
    updatedAt: Date.now() - 3600000 * 3,
    content: `Welcome to Legend File!
Samsung One UI inspired file manager web app (PWA).

Features:
✓ Pinned breadcrumb navigation with jump support
✓ Custom folder colors (14 presets + custom hex picker)
✓ Multi-select batch operations (delete, move, compress)
✓ In-app markdown & text editor with live autosave
✓ Built-in media viewer (images, audio, video preview)
✓ Trash bin with restore and undo snackbar
✓ Full light and dark mode with accent color engine
✓ Smooth Spring animations powered by Motion`,
  },

  // root / user / dcmi / Camera
  {
    id: 'folder-camera',
    parentId: 'folder-dcmi',
    name: 'Camera',
    type: 'folder',
    category: 'images',
    size: 0,
    color: '#0284C7',
    isFavorite: false,
    isPinnedHome: true,
    createdAt: Date.now() - 86400000 * 25,
    updatedAt: Date.now() - 86400000 * 1,
  },

  // Camera images
  {
    id: 'file-camera-sunset',
    parentId: 'folder-camera',
    name: 'Sunset_Over_Coast.jpg',
    type: 'file',
    extension: 'jpg',
    category: 'images',
    size: 3420000,
    isFavorite: true,
    isPinnedHome: false,
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 3,
    url: createSampleImage('Sunset Over Coast', '#FF512F', '#DD2476', '4032 × 3024 · 3.4 MB · HDR'),
  },
  {
    id: 'file-camera-urban',
    parentId: 'folder-camera',
    name: 'Urban_Night_Tokyo.jpg',
    type: 'file',
    extension: 'jpg',
    category: 'images',
    size: 2850000,
    isFavorite: false,
    isPinnedHome: false,
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 5,
    url: createSampleImage('Urban Night Tokyo', '#1F1C2C', '#928DAB', '4032 × 3024 · 2.8 MB · Night Mode'),
  },
  {
    id: 'file-camera-mountain',
    parentId: 'folder-camera',
    name: 'Alpine_Valley_Mist.jpg',
    type: 'file',
    extension: 'jpg',
    category: 'images',
    size: 4120000,
    isFavorite: false,
    isPinnedHome: false,
    createdAt: Date.now() - 86400000 * 6,
    updatedAt: Date.now() - 86400000 * 6,
    url: createSampleImage('Alpine Valley Mist', '#20002c', '#cbb4d4', '4032 × 3024 · 4.1 MB · Ultra Wide'),
  },
  {
    id: 'file-camera-video',
    parentId: 'folder-camera',
    name: 'VID_20261012_1830.mp4',
    type: 'file',
    extension: 'mp4',
    category: 'videos',
    size: 48200000,
    isFavorite: false,
    isPinnedHome: false,
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
  },

  // root / user / Documents
  {
    id: 'folder-documents',
    parentId: 'folder-user',
    name: 'Documents',
    type: 'folder',
    category: 'documents',
    size: 0,
    color: '#059669', // Emerald Green
    isFavorite: true,
    isPinnedHome: true,
    createdAt: Date.now() - 86400000 * 24,
    updatedAt: Date.now() - 3600000 * 6,
  },
  {
    id: 'file-project-plan',
    parentId: 'folder-documents',
    name: 'Project_Sprint_Roadmap.md',
    type: 'file',
    extension: 'md',
    category: 'documents',
    size: 4500,
    isFavorite: true,
    isPinnedHome: false,
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 3600000 * 2,
    content: `# Mobile Engineering Sprint Roadmap 2026

## Objective
Deliver a production-grade, delightfully animated mobile file manager based on Samsung One UI specifications.

### Key Milestones
- [x] Initial One UI ergonomic design & squircle tokens
- [x] IndexedDB/LocalStorage file system persistence
- [x] Breadcrumb auto-scroll & deep nested routing
- [x] Multi-color folder tagging
- [x] In-app markdown preview and text editing
- [x] Media previews (images, audio waveforms, video stubs)
- [x] PWA offline caching & install prompt banner

### Design Principles
1. **One-Handed Ergonomics**: Thumb-zone optimized reachability.
2. **Generous Radii**: 24px - 28px corners matching Samsung Galaxy S24/S25 curves.
3. **Responsive**: Fluid mobile 375px through 1440px desktop balance.`,
  },
  {
    id: 'file-oneui-pdf',
    parentId: 'folder-documents',
    name: 'Samsung_OneUI_Design_System.pdf',
    type: 'file',
    extension: 'pdf',
    category: 'documents',
    size: 3850000,
    isFavorite: true,
    isPinnedHome: false,
    createdAt: Date.now() - 86400000 * 8,
    updatedAt: Date.now() - 86400000 * 8,
  },
  {
    id: 'file-system-config',
    parentId: 'folder-documents',
    name: 'settings_config.json',
    type: 'file',
    extension: 'json',
    category: 'documents',
    size: 890,
    isFavorite: false,
    isPinnedHome: false,
    createdAt: Date.now() - 86400000 * 12,
    updatedAt: Date.now() - 86400000 * 10,
    content: JSON.stringify(
      {
        appName: 'OneFiles',
        version: '2.4.0',
        engine: 'One UI 6.1 Touch',
        animationProfile: 'spring_gentle',
        hapticsEnabled: true,
        cacheLimitMB: 512,
      },
      null,
      2
    ),
  },

  // root / user / Downloads
  {
    id: 'folder-downloads',
    parentId: 'folder-user',
    name: 'Downloads',
    type: 'folder',
    category: 'downloads',
    size: 0,
    color: '#4F46E5', // Ocean Indigo
    isFavorite: false,
    isPinnedHome: true,
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now() - 3600000 * 4,
  },
  {
    id: 'file-download-apk',
    parentId: 'folder-downloads',
    name: 'OneFiles_v2.4_Release.apk',
    type: 'file',
    extension: 'apk',
    category: 'archives',
    size: 24800000,
    isFavorite: false,
    isPinnedHome: false,
    createdAt: Date.now() - 86400000 * 1,
    updatedAt: Date.now() - 86400000 * 1,
  },
  {
    id: 'file-download-zip',
    parentId: 'folder-downloads',
    name: 'Assets_Vector_Icons.zip',
    type: 'file',
    extension: 'zip',
    category: 'archives',
    size: 16400000,
    isFavorite: false,
    isPinnedHome: false,
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'file-download-pdf',
    parentId: 'folder-downloads',
    name: 'Travel_Itinerary_Tokyo.pdf',
    type: 'file',
    extension: 'pdf',
    category: 'documents',
    size: 1820000,
    isFavorite: false,
    isPinnedHome: false,
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 3,
  },

  // root / user / Audio
  {
    id: 'folder-audio',
    parentId: 'folder-user',
    name: 'Audio',
    type: 'folder',
    category: 'audio',
    size: 0,
    color: '#DB2777', // Rose Pink
    isFavorite: false,
    isPinnedHome: false,
    createdAt: Date.now() - 86400000 * 22,
    updatedAt: Date.now() - 86400000 * 4,
  },
  {
    id: 'file-audio-ambient',
    parentId: 'folder-audio',
    name: 'Morning_Chords_Lofi.mp3',
    type: 'file',
    extension: 'mp3',
    category: 'audio',
    size: 7200000,
    isFavorite: true,
    isPinnedHome: false,
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 4,
  },
  {
    id: 'file-audio-synth',
    parentId: 'folder-audio',
    name: 'Night_Drive_Synthwave.mp3',
    type: 'file',
    extension: 'mp3',
    category: 'audio',
    size: 8900000,
    isFavorite: false,
    isPinnedHome: false,
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now() - 86400000 * 7,
  },

  // Hidden folder to test show/hide hidden items
  {
    id: 'folder-hidden-cache',
    parentId: 'folder-user',
    name: '.system_cache',
    type: 'folder',
    category: 'other',
    size: 0,
    color: '#64748B',
    isFavorite: false,
    isPinnedHome: false,
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 1,
    isHidden: true,
  },
  {
    id: 'file-hidden-dump',
    parentId: 'folder-hidden-cache',
    name: '.cache_journal.log',
    type: 'file',
    extension: 'log',
    category: 'other',
    size: 34000,
    isFavorite: false,
    isPinnedHome: false,
    createdAt: Date.now() - 86400000 * 1,
    updatedAt: Date.now() - 86400000 * 1,
    content: '[LOG 2026-10-14] OneFiles cache synchronized successfully.\nZero checksum conflicts detected.',
    isHidden: true,
  },

  // Android Root File System Partitions (Accessible in Root Explorer Mode)
  {
    id: 'folder-root-system',
    parentId: null,
    name: 'system',
    type: 'folder',
    category: 'other',
    size: 0,
    color: '#DC2626', // Red for system partition
    isFavorite: false,
    isPinnedHome: false,
    createdAt: Date.now() - 86400000 * 100,
    updatedAt: Date.now() - 86400000 * 10,
    permissions: 'drwxr-xr-x',
    owner: 'root:root',
    isSystemFile: true,
  },
  {
    id: 'file-build-prop',
    parentId: 'folder-root-system',
    name: 'build.prop',
    type: 'file',
    extension: 'prop',
    category: 'documents',
    size: 9840,
    isFavorite: false,
    isPinnedHome: false,
    createdAt: Date.now() - 86400000 * 60,
    updatedAt: Date.now() - 86400000 * 10,
    permissions: '-rw-r--r--',
    owner: 'root:root',
    isSystemFile: true,
    content: `# Android System Properties
ro.build.version.release=15
ro.build.version.sdk=35
ro.product.model=SM-S928B
ro.product.brand=samsung
ro.product.name=galaxy_ultra
ro.build.display.id=OneUI_6.1_LegendFile
ro.shizuku.version=13.5.4
ro.security.selinux=enforcing
ro.debuggable=1
persist.sys.usb.config=adb`,
  },
  {
    id: 'folder-system-bin',
    parentId: 'folder-root-system',
    name: 'bin',
    type: 'folder',
    category: 'other',
    size: 0,
    color: '#B91C1C',
    isFavorite: false,
    isPinnedHome: false,
    createdAt: Date.now() - 86400000 * 100,
    updatedAt: Date.now() - 86400000 * 10,
    permissions: 'drwxr-xr-x',
    owner: 'root:shell',
    isSystemFile: true,
  },
  {
    id: 'file-bin-sh',
    parentId: 'folder-system-bin',
    name: 'sh',
    type: 'file',
    extension: 'bin',
    category: 'other',
    size: 198400,
    isFavorite: false,
    isPinnedHome: false,
    createdAt: Date.now() - 86400000 * 100,
    updatedAt: Date.now() - 86400000 * 10,
    permissions: '-rwxr-xr-x',
    owner: 'root:shell',
    isSystemFile: true,
  },
  {
    id: 'file-bin-su',
    parentId: 'folder-system-bin',
    name: 'su',
    type: 'file',
    extension: 'bin',
    category: 'other',
    size: 142000,
    isFavorite: false,
    isPinnedHome: false,
    createdAt: Date.now() - 86400000 * 100,
    updatedAt: Date.now() - 86400000 * 10,
    permissions: '-rwsr-sr-x',
    owner: 'root:root',
    isSystemFile: true,
  },

  // /data partition
  {
    id: 'folder-root-data',
    parentId: null,
    name: 'data',
    type: 'folder',
    category: 'other',
    size: 0,
    color: '#D97706',
    isFavorite: false,
    isPinnedHome: false,
    createdAt: Date.now() - 86400000 * 100,
    updatedAt: Date.now() - 86400000 * 5,
    permissions: 'drwxrwx--x',
    owner: 'system:system',
    isSystemFile: true,
  },
  {
    id: 'folder-data-apps',
    parentId: 'folder-root-data',
    name: 'data',
    type: 'folder',
    category: 'other',
    size: 0,
    color: '#B45309',
    isFavorite: false,
    isPinnedHome: false,
    createdAt: Date.now() - 86400000 * 100,
    updatedAt: Date.now() - 86400000 * 5,
    permissions: 'drwxrwx--x',
    owner: 'system:system',
    isSystemFile: true,
  },
  {
    id: 'folder-app-shizuku',
    parentId: 'folder-data-apps',
    name: 'moe.shizuku.privileged.api',
    type: 'folder',
    category: 'other',
    size: 0,
    color: '#2563EB',
    isFavorite: false,
    isPinnedHome: false,
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now() - 86400000 * 2,
    permissions: 'drwx------',
    owner: 'u0_a248:u0_a248',
    isSystemFile: true,
  },

  // /vendor partition
  {
    id: 'folder-root-vendor',
    parentId: null,
    name: 'vendor',
    type: 'folder',
    category: 'other',
    size: 0,
    color: '#475569',
    isFavorite: false,
    isPinnedHome: false,
    createdAt: Date.now() - 86400000 * 100,
    updatedAt: Date.now() - 86400000 * 15,
    permissions: 'drwxr-xr-x',
    owner: 'root:root',
    isSystemFile: true,
  },

  // Root /init.rc
  {
    id: 'file-init-rc',
    parentId: null,
    name: 'init.rc',
    type: 'file',
    extension: 'rc',
    category: 'documents',
    size: 28400,
    isFavorite: false,
    isPinnedHome: false,
    createdAt: Date.now() - 86400000 * 100,
    updatedAt: Date.now() - 86400000 * 30,
    permissions: '-rw-r--r--',
    owner: 'root:root',
    isSystemFile: true,
    content: `# Android Init Script
on early-init
    loglevel 3
    write /proc/sys/kernel/sysrq 0
    start ueventd

on init
    sysclktz 0
    mkdir /system
    mkdir /data 0771 system system
    mkdir /storage 0751 root sdcard_r
    mount_all /vendor/etc/fstab.qcom

service shizuku_server /system/bin/sh /data/local/tmp/shizuku_starter
    class main
    user root
    group root
    seclabel u:r:su:s0`,
  },
];
