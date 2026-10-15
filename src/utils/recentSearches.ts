const STORAGE_KEY_RECENT_SEARCHES = 'legend_file_recent_searches';
const MAX_RECENT_SEARCHES = 10;

export function getRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RECENT_SEARCHES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to load recent searches', e);
    return [];
  }
}

export function saveRecentSearches(searches: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_RECENT_SEARCHES, JSON.stringify(searches));
  } catch (e) {
    console.error('Failed to save recent searches', e);
  }
}

export function addRecentSearch(term: string): string[] {
  const trimmed = term.trim();
  if (!trimmed) return getRecentSearches();

  const current = getRecentSearches();
  // Filter out existing occurrence of this term (case-insensitive deduplication)
  const filtered = current.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
  const updated = [trimmed, ...filtered].slice(0, MAX_RECENT_SEARCHES);
  saveRecentSearches(updated);
  return updated;
}

export function removeRecentSearch(term: string): string[] {
  const current = getRecentSearches();
  const updated = current.filter((item) => item !== term);
  saveRecentSearches(updated);
  return updated;
}

export function clearRecentSearches(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_RECENT_SEARCHES);
  } catch (e) {
    console.error('Failed to clear recent searches', e);
  }
}
