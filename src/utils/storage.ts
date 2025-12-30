import { StandupEntry, NewStandupEntry } from '../types/standup';

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
 * Retrieves all standup entries from localStorage
 * Returns empty array if no entries or on error
 */
export function getEntries(): StandupEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const parsed: unknown = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];

    // Filter out any invalid entries
    return parsed.filter(isValidEntry);
  } catch {
    console.error('Failed to load standup entries from localStorage');
    return [];
  }
}

/**
 * Saves a new standup entry to localStorage
 * Generates a unique ID for the entry
 */
export function saveEntry(entry: NewStandupEntry): StandupEntry {
  const newEntry: StandupEntry = {
    ...entry,
    id: crypto.randomUUID(),
  };

  const entries = getEntries();
  entries.push(newEntry);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    console.error('Failed to save standup entry to localStorage');
    throw new Error('Failed to save entry');
  }

  return newEntry;
}

/**
 * Deletes a standup entry by ID
 * Returns true if entry was found and deleted, false otherwise
 */
export function deleteEntry(id: string): boolean {
  const entries = getEntries();
  const initialLength = entries.length;
  const filtered = entries.filter((entry) => entry.id !== id);

  if (filtered.length === initialLength) {
    return false; // Entry not found
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch {
    console.error('Failed to delete standup entry from localStorage');
    throw new Error('Failed to delete entry');
  }
}

/**
 * Retrieves entries from the last N days
 * Sorted by date descending (newest first)
 */
export function getRecentEntries(days: number = 7): StandupEntry[] {
  const entries = getEntries();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  cutoffDate.setHours(0, 0, 0, 0);

  return entries
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
}
