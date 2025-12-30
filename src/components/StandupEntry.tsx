import { useState } from 'react';
import type { StandupEntry as StandupEntryType } from '../types/standup';
import styles from './StandupEntry.module.css';

interface StandupEntryProps {
  entry: StandupEntryType;
  onDelete: (id: string) => void;
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

export function StandupEntry({ entry, onDelete }: StandupEntryProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(entry.id);
    setShowConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <div className={styles.meta}>
          <span className={styles.name}>{entry.name}</span>
          <time className={styles.date} dateTime={entry.date}>
            {formatDate(entry.date)}
          </time>
        </div>
        {showConfirm ? (
          <div className={styles.confirmDialog}>
            <span className={styles.confirmText}>Delete this entry?</span>
            <div className={styles.confirmButtons}>
              <button
                className={styles.cancelButton}
                onClick={handleCancelDelete}
                type="button"
              >
                Cancel
              </button>
              <button
                className={styles.confirmDeleteButton}
                onClick={handleConfirmDelete}
                type="button"
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <button
            className={styles.deleteButton}
            onClick={handleDeleteClick}
            aria-label={`Delete standup entry for ${entry.name}`}
            type="button"
          >
            Delete
          </button>
        )}
      </header>

      <div className={styles.content}>
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Yesterday</h3>
          <p className={styles.sectionText}>{entry.yesterday}</p>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Today</h3>
          <p className={styles.sectionText}>{entry.today}</p>
        </section>

        {entry.blockers && (
          <section className={styles.section}>
            <h3 className={`${styles.sectionTitle} ${styles.blockerTitle}`}>
              Blockers
            </h3>
            <p className={styles.sectionText}>{entry.blockers}</p>
          </section>
        )}
      </div>
    </article>
  );
}
