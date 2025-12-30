import {
  StandupEntry,
  NewStandupEntry,
  StorageResult,
  StorageError,
} from '../types/standup';

const STORAGE_KEY = 'standup-entries';

/**
 * Validates that an object has the shape of a StandupEntry
 */
function isValidEntry(entry: unknown): entry is StandupEntry {
  if (typeof entry !== 'object' || entry === null) return false;
  const e = entry as Record<string, unknown>;
  return (
    typeof e.id === 'string' &&
    typeof e.name === 'string' &&
    typeof e.date === 'string' &&
    typeof e.yesterday === 'string' &&
    typeof e.today === 'string' &&
    typeof e.blockers === 'string'
  );
}

/**
 * Determines the error type from a caught exception
 */
function getStorageError(error: unknown): StorageError {
  if (error instanceof DOMException) {
    if (error.name === 'QuotaExceededError') {
      return {
        type: 'QUOTA_EXCEEDED',
        message: 'Storage is full. Please delete some entries to make room.',
      };
    }
  }
  if (error instanceof SyntaxError) {
    return {
      type: 'PARSE_ERROR',
      message: 'Stored data is corrupted. Starting fresh.',
    };
  }
  return {
    type: 'UNKNOWN',
    message: 'An unexpected error occurred while accessing storage.',
  };
}

/**
 * Retrieves all standup entries from localStorage
 * Returns result object with entries or error
 */
export function getEntries(): StorageResult<StandupEntry[]> {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return { success: true, data: [] };

    const parsed: unknown = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      return { success: true, data: [] };
    }

    // Filter out any invalid entries
    return { success: true, data: parsed.filter(isValidEntry) };
  } catch (error) {
    console.error('Failed to load standup entries from localStorage:', error);
    return { success: false, error: getStorageError(error) };
  }
}

/**
 * Saves a new standup entry to localStorage
 * Generates a unique ID for the entry
 */
export function saveEntry(
  entry: NewStandupEntry
): StorageResult<StandupEntry> {
  const newEntry: StandupEntry = {
    ...entry,
    id: crypto.randomUUID(),
  };

  const result = getEntries();
  const entries = result.success ? result.data ?? [] : [];
  entries.push(newEntry);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return { success: true, data: newEntry };
  } catch (error) {
    console.error('Failed to save standup entry to localStorage:', error);
    return { success: false, error: getStorageError(error) };
  }
}

/**
 * Deletes a standup entry by ID
 * Returns result indicating success or failure
 */
export function deleteEntry(id: string): StorageResult<boolean> {
  const result = getEntries();
  if (!result.success) {
    return { success: false, error: result.error };
  }

  const entries = result.data ?? [];
  const initialLength = entries.length;
  const filtered = entries.filter((entry) => entry.id !== id);

  if (filtered.length === initialLength) {
    return { success: true, data: false }; // Entry not found
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return { success: true, data: true };
  } catch (error) {
    console.error('Failed to delete standup entry from localStorage:', error);
    return { success: false, error: getStorageError(error) };
  }
}

/**
 * Retrieves entries from the last N days
 * Sorted by date descending (newest first)
 */
export function getRecentEntries(
  days: number = 7
): StorageResult<StandupEntry[]> {
  const result = getEntries();
  if (!result.success) {
    return result;
  }

  const entries = result.data ?? [];
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  cutoffDate.setHours(0, 0, 0, 0);

  const filtered = entries
    .filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= cutoffDate;
    })
    .sort((a, b) => {
      // Sort by date descending, then by name ascending for same date
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return a.name.localeCompare(b.name);
    });

  return { success: true, data: filtered };
}
