import type { StandupEntry as StandupEntryType } from '../types/standup';
import { StandupEntry } from './StandupEntry';
import styles from './StandupList.module.css';

interface StandupListProps {
  entries: StandupEntryType[];
  onDelete: (id: string) => void;
}

interface GroupedEntries {
  date: string;
  entries: StandupEntryType[];
}

function formatDateHeading(isoDate: string): string {
  const date = new Date(isoDate + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const entryDate = new Date(date);
  entryDate.setHours(0, 0, 0, 0);

  if (entryDate.getTime() === today.getTime()) {
    return 'Today';
  }
  if (entryDate.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function groupEntriesByDate(entries: StandupEntryType[]): GroupedEntries[] {
  const grouped = new Map<string, StandupEntryType[]>();

  for (const entry of entries) {
    const existing = grouped.get(entry.date);
    if (existing) {
      existing.push(entry);
    } else {
      grouped.set(entry.date, [entry]);
    }
  }

  return Array.from(grouped.entries())
    .map(([date, dateEntries]) => ({ date, entries: dateEntries }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function StandupList({ entries, onDelete }: StandupListProps) {
  if (entries.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyTitle}>No standup entries yet</p>
        <p className={styles.emptyMessage}>
          Add your first standup entry using the form above to get started.
        </p>
      </div>
    );
  }

  const groupedEntries = groupEntriesByDate(entries);

  return (
    <div className={styles.container}>
      {groupedEntries.map(({ date, entries: dateEntries }) => (
        <section key={date} className={styles.dateGroup}>
          <h2 className={styles.dateHeading}>{formatDateHeading(date)}</h2>
          <div className={styles.entriesList}>
            {dateEntries.map((entry) => (
              <StandupEntry key={entry.id} entry={entry} onDelete={onDelete} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
