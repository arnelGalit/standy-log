# Daily Standup Tracker

A single-page React application for teams to log daily standup entries with localStorage persistence.

## Features

- Form to capture standup data (yesterday's work, today's plans, blockers)
- Date picker limited to past 7 days
- Entries grouped by date with "Today" and "Yesterday" labels
- localStorage persistence with error handling
- Entry deletion with confirmation
- Error boundary for crash protection
- Responsive two-column layout

## Tech Stack

- React 18 with TypeScript
- Vite for build tooling
- CSS Modules for styling
- localStorage for persistence

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens the app at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── components/
│   ├── ErrorBoundary.tsx      # Error catching component
│   ├── StandupForm.tsx        # Form for new entries
│   ├── StandupList.tsx        # List with date grouping
│   └── StandupEntry.tsx       # Individual entry card
├── types/
│   └── standup.ts             # TypeScript interfaces
├── utils/
│   └── storage.ts             # localStorage operations
├── App.tsx                    # Main app with state management
└── main.tsx                   # Entry point
```
