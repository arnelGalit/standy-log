import { useState, useEffect, useCallback } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { StandupForm } from './components/StandupForm';
import { StandupList } from './components/StandupList';
import type { StandupEntry, NewStandupEntry, StorageError } from './types/standup';
import { getRecentEntries, saveEntry, deleteEntry } from './utils/storage';
import './App.css';

function App() {
  const [entries, setEntries] = useState<StandupEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<StorageError | null>(null);

  const loadEntries = useCallback(() => {
    setIsLoading(true);
    setError(null);
    const result = getRecentEntries(7);
    if (result.success) {
      setEntries(result.data ?? []);
    } else {
      setError(result.error ?? null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const handleSubmit = (newEntry: NewStandupEntry) => {
    setError(null);
    const result = saveEntry(newEntry);
    if (result.success) {
      loadEntries();
    } else {
      setError(result.error ?? null);
    }
  };

  const handleDelete = (id: string) => {
    setError(null);
    const result = deleteEntry(id);
    if (result.success && result.data) {
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } else if (!result.success) {
      setError(result.error ?? null);
    }
  };

  const handleDismissError = () => {
    setError(null);
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <header className="header">
          <h1 className="title">Daily Standup Tracker</h1>
          <p className="subtitle">Track your team's daily progress</p>
        </header>

        {error && (
          <div className="errorBanner" role="alert">
            <span className="errorText">{error.message}</span>
            <button
              className="errorDismiss"
              onClick={handleDismissError}
              aria-label="Dismiss error"
            >
              Dismiss
            </button>
          </div>
        )}

        <main className="main">
          <section className="formSection">
            <h2 className="sectionTitle">New Standup Entry</h2>
            <StandupForm onSubmit={handleSubmit} />
          </section>

          <section className="listSection">
            {isLoading ? (
              <div className="loadingContainer">
                <div className="loadingSpinner" />
                <p className="loading">Loading entries...</p>
              </div>
            ) : (
              <StandupList entries={entries} onDelete={handleDelete} />
            )}
          </section>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
