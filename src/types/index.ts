export type ItemType = 'folder' | 'file';

export type FileCategory =
  | 'images'
  | 'videos'
  | 'audio'
  | 'documents'
  | 'downloads'
  | 'archives'
  | 'other';

export interface FSItem {
  id: string;
  parentId: string | null; // null represents the root filesystem
  name: string;
  type: ItemType;
  extension?: string;
  category: FileCategory;
  size: number; // in bytes
  color?: string; // hex color for folders
  isFavorite: boolean;
  isPinnedHome: boolean;
  createdAt: number;
  updatedAt: number;
  content?: string; // textual content for documents/code
  url?: string; // media URL or base64 data for images
  mimeType?: string;
  inTrash?: boolean;
  deletedAt?: number;
  isHidden?: boolean;
  permissions?: string;
  owner?: string;
  isSystemFile?: boolean;
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type ViewMode = 'list' | 'grid';
export type SortField = 'name' | 'date' | 'size' | 'type';
export type SortDirection = 'asc' | 'desc';
export type AnimationIntensity = 'full' | 'reduced' | 'off';
export type SizeUnit = 'decimal' | 'binary';

export interface AppSettings {
  theme: ThemeMode;
  accentColor: string;
  defaultView: ViewMode;
  defaultSort: SortField;
  sortDirection: SortDirection;
  showHidden: boolean;
  animationIntensity: AnimationIntensity;
  sizeUnit: SizeUnit;
  rootExplorerEnabled: boolean;
  shizukuBridgeUrl: string;
}

export type NavTab = 'home' | 'browse' | 'favorites' | 'settings';

export interface ToastItem {
  id: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}
