import { useState, FormEvent, ChangeEvent } from 'react';
import type { NewStandupEntry } from '../types/standup';
import styles from './StandupForm.module.css';

interface StandupFormProps {
  onSubmit: (entry: NewStandupEntry) => void;
}

function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function StandupForm({ onSubmit }: StandupFormProps) {
  const [name, setName] = useState('');
  const [date, setDate] = useState(getTodayDate);
  const [yesterday, setYesterday] = useState('');
  const [today, setToday] = useState('');
  const [blockers, setBlockers] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const entry: NewStandupEntry = {
      name: name.trim(),
      date,
      yesterday: yesterday.trim(),
      today: today.trim(),
      blockers: blockers.trim(),
    };

    onSubmit(entry);

    // Reset form but keep date for convenience
    setName('');
    setYesterday('');
    setToday('');
    setBlockers('');
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleYesterdayChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setYesterday(e.target.value);
  };

  const handleTodayChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setToday(e.target.value);
  };

  const handleBlockersChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setBlockers(e.target.value);
  };

  const isValid = name.trim() && yesterday.trim() && today.trim();

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>
            Name
          </label>
          <input
            type="text"
            id="name"
            className={styles.input}
            value={name}
            onChange={handleNameChange}
            placeholder="Your name"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="date" className={styles.label}>
            Date
          </label>
          <input
            type="date"
            id="date"
            className={styles.input}
            value={date}
            onChange={handleDateChange}
            max={getTodayDate()}
            required
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="yesterday" className={styles.label}>
          What did you work on yesterday?
        </label>
        <textarea
          id="yesterday"
          className={styles.textarea}
          value={yesterday}
          onChange={handleYesterdayChange}
          placeholder="Describe what you accomplished..."
          rows={3}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="today" className={styles.label}>
          What will you work on today?
        </label>
        <textarea
          id="today"
          className={styles.textarea}
          value={today}
          onChange={handleTodayChange}
          placeholder="Describe your plans for today..."
          rows={3}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="blockers" className={styles.label}>
          Any blockers? <span className={styles.optional}>(optional)</span>
        </label>
        <textarea
          id="blockers"
          className={styles.textarea}
          value={blockers}
          onChange={handleBlockersChange}
          placeholder="Describe any blockers or challenges..."
          rows={2}
        />
      </div>

      <button type="submit" className={styles.submitButton} disabled={!isValid}>
        Submit Standup
      </button>
    </form>
  );
}
