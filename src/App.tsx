import { useState, useEffect } from 'react';
import { StandupForm } from './components/StandupForm';
import { StandupList } from './components/StandupList';
import type { StandupEntry, NewStandupEntry } from './types/standup';
import { getRecentEntries, saveEntry, deleteEntry } from './utils/storage';
import './App.css';

function App() {
  const [entries, setEntries] = useState<StandupEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedEntries = getRecentEntries(7);
    setEntries(loadedEntries);
    setIsLoading(false);
  }, []);

  const handleSubmit = (newEntry: NewStandupEntry) => {
    const savedEntry = saveEntry(newEntry);
    setEntries((prev) => {
      const updated = [savedEntry, ...prev];
      return updated.sort((a, b) => {
        const dateCompare = b.date.localeCompare(a.date);
        if (dateCompare !== 0) return dateCompare;
        return a.name.localeCompare(b.name);
      });
    });
  };

  const handleDelete = (id: string) => {
    const success = deleteEntry(id);
    if (success) {
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">Daily Standup Tracker</h1>
        <p className="subtitle">Track your team's daily progress</p>
      </header>

      <main className="main">
        <section className="formSection">
          <h2 className="sectionTitle">New Standup Entry</h2>
          <StandupForm onSubmit={handleSubmit} />
        </section>

        <section className="listSection">
          <h2 className="sectionTitle">Recent Entries</h2>
          {isLoading ? (
            <p className="loading">Loading entries...</p>
          ) : (
            <StandupList entries={entries} onDelete={handleDelete} />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
