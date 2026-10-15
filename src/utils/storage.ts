import { AppSettings, FSItem } from '../types';
import { INITIAL_FS_ITEMS } from './seedData';

const STORAGE_KEY_ITEMS = 'onefiles_items_v2';
const STORAGE_KEY_SETTINGS = 'onefiles_settings_v2';

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  accentColor: '#2A72DE',
  defaultView: 'list',
  defaultSort: 'name',
  sortDirection: 'asc',
  showHidden: false,
  animationIntensity: 'full',
  sizeUnit: 'decimal',
  rootExplorerEnabled: false,
  shizukuBridgeUrl: 'http://127.0.0.1:8080',
};

export function loadItemsFromStorage(): FSItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ITEMS);
    if (!raw) {
      saveItemsToStorage(INITIAL_FS_ITEMS);
      return INITIAL_FS_ITEMS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      saveItemsToStorage(INITIAL_FS_ITEMS);
      return INITIAL_FS_ITEMS;
    }
    return parsed;
  } catch (e) {
    console.error('Failed to parse stored items, using seed data', e);
    return INITIAL_FS_ITEMS;
  }
}

export function saveItemsToStorage(items: FSItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save items to storage', e);
  }
}

export function loadSettingsFromStorage(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to parse stored settings', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettingsToStorage(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to storage', e);
  }
}
