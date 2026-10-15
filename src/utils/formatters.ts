import { FileCategory, SizeUnit } from '../types';

export function formatBytes(bytes: number, unit: SizeUnit = 'decimal'): string {
  if (bytes === 0) return '0 B';
  const k = unit === 'binary' ? 1024 : 1000;
  const sizes = unit === 'binary' 
    ? ['B', 'KiB', 'MiB', 'GiB', 'TiB']
    : ['B', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  return `${value.toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const isCurrentYear = date.getFullYear() === now.getFullYear();
  if (isCurrentYear) {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }

  return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatFullDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function getCategoryFromExtension(ext: string = ''): FileCategory {
  const cleanExt = ext.toLowerCase().replace(/^\./, '');
  
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'heic', 'avif'];
  const videoExts = ['mp4', 'mkv', 'mov', 'webm', 'avi', '3gp', 'flv'];
  const audioExts = ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac', 'opus'];
  const docExts = ['pdf', 'doc', 'docx', 'txt', 'md', 'rtf', 'odt', 'csv', 'xlsx', 'pptx', 'json', 'ts', 'js', 'html', 'css'];
  const archiveExts = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'apk', 'xapk'];

  if (imageExts.includes(cleanExt)) return 'images';
  if (videoExts.includes(cleanExt)) return 'videos';
  if (audioExts.includes(cleanExt)) return 'audio';
  if (archiveExts.includes(cleanExt)) return 'archives';
  if (docExts.includes(cleanExt)) return 'documents';
  return 'other';
}

export const PRESET_FOLDER_COLORS = [
  { name: 'Samsung Blue', hex: '#2A72DE' },
  { name: 'Ocean Indigo', hex: '#4F46E5' },
  { name: 'Sky Cyan', hex: '#0284C7' },
  { name: 'Teal Mint', hex: '#0D9488' },
  { name: 'Emerald Forest', hex: '#059669' },
  { name: 'Lime Green', hex: '#65A30D' },
  { name: 'Amber Gold', hex: '#D97706' },
  { name: 'Coral Orange', hex: '#EA580C' },
  { name: 'Sunset Terracotta', hex: '#E11D48' },
  { name: 'Rose Pink', hex: '#DB2777' },
  { name: 'Violet Purple', hex: '#7C3AED' },
  { name: 'Plum Berry', hex: '#9333EA' },
  { name: 'Mocha Bronze', hex: '#78350F' },
  { name: 'Slate Gray', hex: '#475569' },
];

export const ACCENT_PRESETS = [
  { name: 'Galaxy Blue', hex: '#2A72DE' },
  { name: 'Royal Violet', hex: '#7C3AED' },
  { name: 'Emerald Mint', hex: '#059669' },
  { name: 'Sunset Coral', hex: '#EA580C' },
  { name: 'Rose Gold', hex: '#E11D48' },
  { name: 'Electric Cyan', hex: '#0284C7' },
  { name: 'Midnight Slate', hex: '#334155' },
];
