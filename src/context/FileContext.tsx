import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { AppSettings, FileCategory, FSItem, NavTab, SizeUnit, SortDirection, SortField, ToastItem, ViewMode } from '../types';
import { DEFAULT_SETTINGS, loadItemsFromStorage, loadSettingsFromStorage, saveItemsToStorage, saveSettingsToStorage } from '../utils/storage';
import { INITIAL_FS_ITEMS } from '../utils/seedData';
import { getCategoryFromExtension } from '../utils/formatters';

interface FileContextType {
  items: FSItem[];
  settings: AppSettings;
  currentFolderId: string | null;
  selectedTab: NavTab;
  isMultiSelect: boolean;
  selectedItemIds: Set<string>;
  searchQuery: string;
  activeCategory: FileCategory | null;
  viewMode: ViewMode;
  sortField: SortField;
  sortDirection: SortDirection;
  toasts: ToastItem[];

  // Navigation
  setSelectedTab: (tab: NavTab) => void;
  navigateToFolder: (folderId: string | null) => void;
  navigateUp: () => void;
  getPath: (folderId?: string | null) => FSItem[];

  // Filtering & Search
  setSearchQuery: (query: string) => void;
  setActiveCategory: (cat: FileCategory | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setSortField: (field: SortField) => void;
  toggleSortDirection: () => void;

  // Multi-select
  setIsMultiSelect: (active: boolean) => void;
  toggleSelectItem: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;

  // CRUD & Operations
  createFolder: (name: string, color?: string) => FSItem;
  createDocument: (name: string, content: string, extension?: string) => FSItem;
  uploadFiles: (files: FileList | File[]) => Promise<void>;
  renameItem: (id: string, newName: string) => void;
  updateFolderColor: (id: string, color: string) => void;
  toggleFavorite: (id: string) => void;
  togglePinnedHome: (id: string) => void;
  deleteItem: (id: string) => void;
  deleteSelected: () => void;
  restoreItem: (id: string) => void;
  restoreAllTrash: () => void;
  emptyTrash: () => void;
  moveItems: (itemIds: string[], destinationFolderId: string | null) => void;
  copyItems: (itemIds: string[], destinationFolderId: string | null) => void;
  compressItems: (itemsToCompress: FSItem[], zipName?: string) => Promise<void>;
  saveDocumentContent: (id: string, content: string) => void;
  reorderFavorites: (newOrder: FSItem[]) => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  resetToDemoData: () => void;

  // Active Modals & Dialogs
  activeItemForMenu: FSItem | null;
  setActiveItemForMenu: (item: FSItem | null) => void;
  itemForDetails: FSItem | null;
  setItemForDetails: (item: FSItem | null) => void;
  itemForRename: FSItem | null;
  setItemForRename: (item: FSItem | null) => void;
  itemForViewer: FSItem | null;
  setItemForViewer: (item: FSItem | null) => void;
  itemForEdit: FSItem | null;
  setItemForEdit: (item: FSItem | null) => void;
  folderForColorPicker: FSItem | null;
  setFolderForColorPicker: (item: FSItem | null) => void;
  isNewFolderModalOpen: boolean;
  setIsNewFolderModalOpen: (open: boolean) => void;
  isNewDocModalOpen: boolean;
  setIsNewDocModalOpen: (open: boolean) => void;
  itemsForMove: { items: FSItem[]; mode: 'move' | 'copy' } | null;
  setItemsForMove: (data: { items: FSItem[]; mode: 'move' | 'copy' } | null) => void;
  itemsForCompress: FSItem[] | null;
  setItemsForCompress: (items: FSItem[] | null) => void;
  isTrashOpen: boolean;
  setIsTrashOpen: (open: boolean) => void;
  itemForPhotoEdit: FSItem | null;
  setItemForPhotoEdit: (item: FSItem | null) => void;
  itemForVideoEdit: FSItem | null;
  setItemForVideoEdit: (item: FSItem | null) => void;
  isAIMediaStudioOpen: boolean;
  setIsAIMediaStudioOpen: (open: boolean) => void;
  saveEditedMedia: (media: {
    name: string;
    extension: string;
    category: FileCategory;
    size: number;
    url?: string;
    content?: string;
    parentId?: string | null;
    id?: string;
  }) => FSItem;

  // Toasts
  addToast: (message: string, actionLabel?: string, onAction?: () => void, duration?: number) => void;
  removeToast: (id: string) => void;
}

const FileContext = createContext<FileContextType | null>(null);

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<FSItem[]>(() => loadItemsFromStorage());
  const [settings, setSettings] = useState<AppSettings>(() => loadSettingsFromStorage());
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<NavTab>('home');
  const [isMultiSelect, setIsMultiSelect] = useState<boolean>(false);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<FileCategory | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(settings.defaultView);
  const [sortField, setSortField] = useState<SortField>(settings.defaultSort);
  const [sortDirection, setSortDirection] = useState<SortDirection>(settings.sortDirection);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Modals state
  const [activeItemForMenu, setActiveItemForMenu] = useState<FSItem | null>(null);
  const [itemForDetails, setItemForDetails] = useState<FSItem | null>(null);
  const [itemForRename, setItemForRename] = useState<FSItem | null>(null);
  const [itemForViewer, setItemForViewer] = useState<FSItem | null>(null);
  const [itemForEdit, setItemForEdit] = useState<FSItem | null>(null);
  const [folderForColorPicker, setFolderForColorPicker] = useState<FSItem | null>(null);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [isNewDocModalOpen, setIsNewDocModalOpen] = useState(false);
  const [itemsForMove, setItemsForMove] = useState<{ items: FSItem[]; mode: 'move' | 'copy' } | null>(null);
  const [itemsForCompress, setItemsForCompress] = useState<FSItem[] | null>(null);
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [itemForPhotoEdit, setItemForPhotoEdit] = useState<FSItem | null>(null);
  const [itemForVideoEdit, setItemForVideoEdit] = useState<FSItem | null>(null);
  const [isAIMediaStudioOpen, setIsAIMediaStudioOpen] = useState(false);

  // Sync items to localStorage
  useEffect(() => {
    saveItemsToStorage(items);
  }, [items]);

  // Sync settings to localStorage and apply theme & accent CSS variables
  useEffect(() => {
    saveSettingsToStorage(settings);

    // Apply Theme
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }

    // Apply Accent Color Variable
    root.style.setProperty('--accent', settings.accentColor);
    root.style.setProperty('--accent-ring', `${settings.accentColor}44`);
  }, [settings]);

  const addToast = useCallback((message: string, actionLabel?: string, onAction?: () => void, duration = 5000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastItem = { id, message, actionLabel, onAction, duration };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...partial };
      if (partial.defaultView) setViewMode(partial.defaultView);
      if (partial.defaultSort) setSortField(partial.defaultSort);
      if (partial.sortDirection) setSortDirection(partial.sortDirection);
      return updated;
    });
  }, []);

  const resetToDemoData = useCallback(() => {
    setItems(INITIAL_FS_ITEMS);
    setCurrentFolderId(null);
    setSelectedItemIds(new Set());
    setIsMultiSelect(false);
    addToast('Reset to default files & folders');
  }, [addToast]);

  const navigateToFolder = useCallback((folderId: string | null) => {
    setCurrentFolderId(folderId);
    setSelectedTab('browse');
    setActiveCategory(null);
    setIsMultiSelect(false);
    setSelectedItemIds(new Set());
  }, []);

  const getPath = useCallback((targetFolderId: string | null = currentFolderId): FSItem[] => {
    const path: FSItem[] = [];
    let currentId = targetFolderId;

    while (currentId) {
      const folder = items.find((it) => it.id === currentId && it.type === 'folder');
      if (folder) {
        path.unshift(folder);
        currentId = folder.parentId;
      } else {
        break;
      }
    }
    return path;
  }, [currentFolderId, items]);

  const navigateUp = useCallback(() => {
    if (!currentFolderId) return;
    const current = items.find((it) => it.id === currentFolderId);
    if (current) {
      setCurrentFolderId(current.parentId);
    } else {
      setCurrentFolderId(null);
    }
  }, [currentFolderId, items]);

  const toggleSortDirection = useCallback(() => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  }, []);

  // Multi-select handlers
  const toggleSelectItem = useCallback((id: string) => {
    setSelectedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    const currentFolderItems = items.filter(
      (it) => it.parentId === currentFolderId && !it.inTrash && (settings.showHidden || !it.isHidden)
    );
    setSelectedItemIds(new Set(currentFolderItems.map((it) => it.id)));
  }, [items, currentFolderId, settings.showHidden]);

  const clearSelection = useCallback(() => {
    setSelectedItemIds(new Set());
    setIsMultiSelect(false);
  }, []);

  // Create folder
  const createFolder = useCallback((name: string, color = '#2A72DE'): FSItem => {
    const finalName = name.trim() || 'New Folder';
    const newFolder: FSItem = {
      id: `folder-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      parentId: currentFolderId,
      name: finalName,
      type: 'folder',
      category: 'other',
      size: 0,
      color,
      isFavorite: false,
      isPinnedHome: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isHidden: finalName.startsWith('.'),
    };

    setItems((prev) => [newFolder, ...prev]);
    addToast(`Folder "${finalName}" created`);
    return newFolder;
  }, [currentFolderId, addToast]);

  // Create document
  const createDocument = useCallback((name: string, content: string, extension = 'txt'): FSItem => {
    const cleanExt = extension.replace(/^\./, '').toLowerCase() || 'txt';
    let baseName = name.trim() || `New_Document.${cleanExt}`;
    if (!baseName.endsWith(`.${cleanExt}`)) {
      baseName = `${baseName}.${cleanExt}`;
    }

    const newDoc: FSItem = {
      id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      parentId: currentFolderId,
      name: baseName,
      type: 'file',
      extension: cleanExt,
      category: getCategoryFromExtension(cleanExt),
      size: new Blob([content]).size || 120,
      isFavorite: false,
      isPinnedHome: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      content,
      isHidden: baseName.startsWith('.'),
    };

    setItems((prev) => [newDoc, ...prev]);
    addToast(`Document "${baseName}" created`);
    return newDoc;
  }, [currentFolderId, addToast]);

  // Upload real files
  const uploadFiles = useCallback(async (fileList: FileList | File[]) => {
    const newItems: FSItem[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const ext = file.name.split('.').pop() || '';
      const category = getCategoryFromExtension(ext);

      let content: string | undefined = undefined;
      let url: string | undefined = undefined;

      if (category === 'images') {
        url = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve((e.target?.result as string) || '');
          reader.readAsDataURL(file);
        });
      } else if (file.size < 500000 && (category === 'documents' || ['txt', 'md', 'json', 'js', 'ts', 'html', 'css'].includes(ext))) {
        content = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve((e.target?.result as string) || '');
          reader.readAsText(file);
        });
      }

      newItems.push({
        id: `upload-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        parentId: currentFolderId,
        name: file.name,
        type: 'file',
        extension: ext,
        category,
        size: file.size,
        mimeType: file.type,
        isFavorite: false,
        isPinnedHome: false,
        createdAt: file.lastModified || Date.now(),
        updatedAt: Date.now(),
        content,
        url,
        isHidden: file.name.startsWith('.'),
      });
    }

    setItems((prev) => [...newItems, ...prev]);
    addToast(`${newItems.length} file${newItems.length > 1 ? 's' : ''} uploaded`);
  }, [currentFolderId, addToast]);

  // Rename
  const renameItem = useCallback((id: string, newName: string) => {
    const trimmed = newName.trim();
    if (!trimmed) return;

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const ext = item.type === 'file' ? trimmed.split('.').pop() || item.extension : undefined;
          return {
            ...item,
            name: trimmed,
            extension: ext,
            category: ext ? getCategoryFromExtension(ext) : item.category,
            updatedAt: Date.now(),
            isHidden: trimmed.startsWith('.'),
          };
        }
        return item;
      })
    );
    addToast(`Renamed to "${trimmed}"`);
  }, [addToast]);

  // Update folder color
  const updateFolderColor = useCallback((id: string, color: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, color, updatedAt: Date.now() } : item))
    );
    addToast('Folder color updated');
  }, [addToast]);

  // Toggle favorite
  const toggleFavorite = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newState = !item.isFavorite;
          addToast(newState ? 'Added to Favorites' : 'Removed from Favorites');
          return { ...item, isFavorite: newState };
        }
        return item;
      })
    );
  }, [addToast]);

  // Toggle pinned home
  const togglePinnedHome = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newState = !item.isPinnedHome;
          addToast(newState ? 'Pinned to Home' : 'Unpinned from Home');
          return { ...item, isPinnedHome: newState };
        }
        return item;
      })
    );
  }, [addToast]);

  // Delete item to trash with undo toast
  const deleteItem = useCallback((id: string) => {
    const target = items.find((it) => it.id === id);
    if (!target) return;

    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, inTrash: true, deletedAt: Date.now() } : it))
    );

    addToast(
      `Moved "${target.name}" to Trash`,
      'Undo',
      () => {
        setItems((prev) =>
          prev.map((it) => (it.id === id ? { ...it, inTrash: false, deletedAt: undefined } : it))
        );
      },
      6000
    );
  }, [items, addToast]);

  // Delete selected
  const deleteSelected = useCallback(() => {
    const ids = Array.from(selectedItemIds);
    if (ids.length === 0) return;

    setItems((prev) =>
      prev.map((it) => (ids.includes(it.id) ? { ...it, inTrash: true, deletedAt: Date.now() } : it))
    );

    addToast(
      `Moved ${ids.length} item${ids.length > 1 ? 's' : ''} to Trash`,
      'Undo',
      () => {
        setItems((prev) =>
          prev.map((it) => (ids.includes(it.id) ? { ...it, inTrash: false, deletedAt: undefined } : it))
        );
      },
      6000
    );

    clearSelection();
  }, [selectedItemIds, addToast, clearSelection]);

  // Trash actions
  const restoreItem = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, inTrash: false, deletedAt: undefined } : it))
    );
    addToast('Item restored from Trash');
  }, [addToast]);

  const restoreAllTrash = useCallback(() => {
    setItems((prev) =>
      prev.map((it) => (it.inTrash ? { ...it, inTrash: false, deletedAt: undefined } : it))
    );
    addToast('All items restored from Trash');
  }, [addToast]);

  const emptyTrash = useCallback(() => {
    const trashCount = items.filter((it) => it.inTrash).length;
    setItems((prev) => prev.filter((it) => !it.inTrash));
    addToast(`Trash emptied (${trashCount} items removed permanently)`);
  }, [items, addToast]);

  // Move items
  const moveItems = useCallback((itemIds: string[], destinationFolderId: string | null) => {
    setItems((prev) =>
      prev.map((it) => {
        if (itemIds.includes(it.id)) {
          return { ...it, parentId: destinationFolderId, updatedAt: Date.now() };
        }
        return it;
      })
    );
    addToast(`Moved ${itemIds.length} item${itemIds.length > 1 ? 's' : ''}`);
    clearSelection();
  }, [addToast, clearSelection]);

  // Copy items
  const copyItems = useCallback((itemIds: string[], destinationFolderId: string | null) => {
    const copies: FSItem[] = [];
    const sourceItems = items.filter((it) => itemIds.includes(it.id));

    sourceItems.forEach((it) => {
      copies.push({
        ...it,
        id: `copy-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        parentId: destinationFolderId,
        name: `Copy of ${it.name}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isFavorite: false,
      });
    });

    setItems((prev) => [...copies, ...prev]);
    addToast(`Copied ${sourceItems.length} item${sourceItems.length > 1 ? 's' : ''}`);
    clearSelection();
  }, [items, addToast, clearSelection]);

  // Compress items (creates simulated or real zip item)
  const compressItems = useCallback(async (itemsToCompress: FSItem[], zipName?: string) => {
    const name = zipName?.trim() || `${itemsToCompress[0]?.name || 'Archive'}.zip`;
    const finalZipName = name.endsWith('.zip') ? name : `${name}.zip`;
    const totalSize = itemsToCompress.reduce((acc, it) => acc + (it.size || 5000), 0);

    const zipFile: FSItem = {
      id: `zip-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      parentId: currentFolderId,
      name: finalZipName,
      type: 'file',
      extension: 'zip',
      category: 'archives',
      size: Math.max(1024, Math.floor(totalSize * 0.72)), // simulated compression ratio
      isFavorite: false,
      isPinnedHome: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      content: `Archive containing: ${itemsToCompress.map((i) => i.name).join(', ')}`,
      isHidden: finalZipName.startsWith('.'),
    };

    setItems((prev) => [zipFile, ...prev]);
    addToast(`Compressed into "${finalZipName}"`);
    clearSelection();
  }, [currentFolderId, addToast, clearSelection]);

  // Save document content
  const saveDocumentContent = useCallback((id: string, content: string) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          return {
            ...it,
            content,
            size: new Blob([content]).size,
            updatedAt: Date.now(),
          };
        }
        return it;
      })
    );
  }, []);

  // Reorder favorites
  const reorderFavorites = useCallback((newOrderedList: FSItem[]) => {
    const orderedIds = newOrderedList.map((i) => i.id);
    setItems((prev) => {
      const nonFavs = prev.filter((it) => !it.isFavorite);
      return [...newOrderedList, ...nonFavs];
    });
  }, []);

  // Save edited media (photo or video)
  const saveEditedMedia = useCallback(
    (media: {
      name: string;
      extension: string;
      category: FileCategory;
      size: number;
      url?: string;
      content?: string;
      parentId?: string | null;
      id?: string;
    }): FSItem => {
      if (media.id) {
        setItems((prev) =>
          prev.map((it) => (it.id === media.id ? { ...it, ...media, updatedAt: Date.now() } : it))
        );
        addToast(`Updated "${media.name}"`);
        const updated = items.find((it) => it.id === media.id);
        return updated || (media as FSItem);
      }

      const newItem: FSItem = {
        id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        parentId: media.parentId !== undefined ? media.parentId : currentFolderId,
        name: media.name,
        type: 'file',
        extension: media.extension,
        category: media.category,
        size: media.size,
        url: media.url,
        content: media.content,
        isFavorite: false,
        isPinnedHome: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setItems((prev) => [newItem, ...prev]);
      addToast(`Saved "${media.name}"`);
      return newItem;
    },
    [currentFolderId, items, addToast]
  );

  const value = useMemo(
    () => ({
      items,
      settings,
      currentFolderId,
      selectedTab,
      isMultiSelect,
      selectedItemIds,
      searchQuery,
      activeCategory,
      viewMode,
      sortField,
      sortDirection,
      toasts,

      setSelectedTab,
      navigateToFolder,
      navigateUp,
      getPath,

      setSearchQuery,
      setActiveCategory,
      setViewMode,
      setSortField,
      toggleSortDirection,

      setIsMultiSelect,
      toggleSelectItem,
      selectAll,
      clearSelection,

      createFolder,
      createDocument,
      uploadFiles,
      renameItem,
      updateFolderColor,
      toggleFavorite,
      togglePinnedHome,
      deleteItem,
      deleteSelected,
      restoreItem,
      restoreAllTrash,
      emptyTrash,
      moveItems,
      copyItems,
      compressItems,
      saveDocumentContent,
      reorderFavorites,
      updateSettings,
      resetToDemoData,

      activeItemForMenu,
      setActiveItemForMenu,
      itemForDetails,
      setItemForDetails,
      itemForRename,
      setItemForRename,
      itemForViewer,
      setItemForViewer,
      itemForEdit,
      setItemForEdit,
      folderForColorPicker,
      setFolderForColorPicker,
      isNewFolderModalOpen,
      setIsNewFolderModalOpen,
      isNewDocModalOpen,
      setIsNewDocModalOpen,
      itemsForMove,
      setItemsForMove,
      itemsForCompress,
      setItemsForCompress,
      isTrashOpen,
      setIsTrashOpen,
      itemForPhotoEdit,
      setItemForPhotoEdit,
      itemForVideoEdit,
      setItemForVideoEdit,
      isAIMediaStudioOpen,
      setIsAIMediaStudioOpen,
      saveEditedMedia,

      addToast,
      removeToast,
    }),
    [
      items,
      settings,
      currentFolderId,
      selectedTab,
      isMultiSelect,
      selectedItemIds,
      searchQuery,
      activeCategory,
      viewMode,
      sortField,
      sortDirection,
      toasts,
      navigateToFolder,
      navigateUp,
      getPath,
      toggleSortDirection,
      toggleSelectItem,
      selectAll,
      clearSelection,
      createFolder,
      createDocument,
      uploadFiles,
      renameItem,
      updateFolderColor,
      toggleFavorite,
      togglePinnedHome,
      deleteItem,
      deleteSelected,
      restoreItem,
      restoreAllTrash,
      emptyTrash,
      moveItems,
      copyItems,
      compressItems,
      saveDocumentContent,
      reorderFavorites,
      updateSettings,
      resetToDemoData,
      activeItemForMenu,
      itemForDetails,
      itemForRename,
      itemForViewer,
      itemForEdit,
      folderForColorPicker,
      isNewFolderModalOpen,
      isNewDocModalOpen,
      itemsForMove,
      itemsForCompress,
      isTrashOpen,
      itemForPhotoEdit,
      itemForVideoEdit,
      isAIMediaStudioOpen,
      saveEditedMedia,
      addToast,
      removeToast,
    ]
  );

  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
};

export function useFiles(): FileContextType {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFiles must be used within a FileProvider');
  }
  return context;
}
