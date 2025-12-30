import { useState, FormEvent, ChangeEvent } from 'react';
import { NewStandupEntry } from '../types/standup';
import styles from './StandupForm.module.css';

interface StandupFormProps {
  onSubmit: (entry: NewStandupEntry) => void;
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function StandupForm({ onSubmit }: StandupFormProps) {
  const [name, setName] = useState('');
  const [date, setDate] = useState(getTodayDate);
  const [yesterday, setYesterday] = useState('');
  const [today, setToday] = useState('');
  const [blockers, setBlockers] = useState('');
  const [errors, setErrors] = useState<{ name?: string; today?: string }>({});

  const validate = (): boolean => {
    const newErrors: { name?: string; today?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!today.trim()) {
      newErrors.today = 'Today\'s tasks are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const entry: NewStandupEntry = {
      name: name.trim(),
      date,
      yesterday: yesterday.trim(),
      today: today.trim(),
      blockers: blockers.trim(),
    };

    onSubmit(entry);

    // Clear form after successful submission
    setName('');
    setDate(getTodayDate());
    setYesterday('');
    setToday('');
    setBlockers('');
    setErrors({});
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleTodayChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setToday(e.target.value);
    if (errors.today) {
      setErrors((prev) => ({ ...prev, today: undefined }));
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.title}>Daily Standup</h2>

      <div className={styles.field}>
        <label htmlFor="standup-name" className={styles.label}>
          Name <span className={styles.required}>*</span>
        </label>
        <input
          id="standup-name"
          type="text"
          className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
          value={name}
          onChange={handleNameChange}
          placeholder="Enter your name"
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <span id="name-error" className={styles.error} role="alert">
            {errors.name}
          </span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="standup-date" className={styles.label}>
          Date
        </label>
        <input
          id="standup-date"
          type="date"
          className={styles.input}
          value={date}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
          aria-label="Standup date"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="standup-yesterday" className={styles.label}>
          What did you do yesterday?
        </label>
        <textarea
          id="standup-yesterday"
          className={styles.textarea}
          value={yesterday}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setYesterday(e.target.value)}
          placeholder="Describe what you accomplished yesterday..."
          rows={3}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="standup-today" className={styles.label}>
          What will you do today? <span className={styles.required}>*</span>
        </label>
        <textarea
          id="standup-today"
          className={`${styles.textarea} ${errors.today ? styles.inputError : ''}`}
          value={today}
          onChange={handleTodayChange}
          placeholder="Describe what you plan to work on today..."
          rows={3}
          aria-required="true"
          aria-invalid={!!errors.today}
          aria-describedby={errors.today ? 'today-error' : undefined}
        />
        {errors.today && (
          <span id="today-error" className={styles.error} role="alert">
            {errors.today}
          </span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="standup-blockers" className={styles.label}>
          Any blockers?
        </label>
        <textarea
          id="standup-blockers"
          className={styles.textarea}
          value={blockers}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setBlockers(e.target.value)}
          placeholder="Describe any blockers or challenges..."
          rows={2}
        />
      </div>

      <button type="submit" className={styles.submitButton}>
        Submit Standup
      </button>
    </form>
  );
}
