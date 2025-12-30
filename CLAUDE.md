# Daily Standup Tracker Project

## Project Overview
A single-page React application for teams to log daily standup entries with localStorage persistence.

## Tech Stack
- React 18+ with TypeScript
- Vite for build tooling
- CSS Modules for styling
- localStorage for persistence
- No external UI libraries (build from scratch)

## Project Structure
```
 standup-tracker/
  ├── src/
  │   ├── components/
  │   │   ├── StandupForm.tsx      
  │   │   ├── StandupList.tsx     
  │   │   └── StandupEntry.tsx   
  │   ├── types/
  │   │   └── standup.ts         
  │   ├── utils/
  │   │   └── storage.ts        
  │   ├── App.tsx        
  │   ├── App.css                
  │   ├── main.tsx             
  │   └── vite-env.d.ts    
  ├── index.html
  ├── package.json
  ├── package-lock.json
  ├── tsconfig.json
  ├── vite.config.ts
  ├── eslint.config.js
  └── CLAUDE.md
```

## Core Types
```typescript
interface StandupEntry {
  id: string;
  name: string;
  date: string; // ISO date string
  yesterday: string;
  today: string;
  blockers: string;
}
```

## Development Guidelines
- Use functional components with TypeScript
- Implement proper error boundaries
- Add loading states for localStorage operations
- Use proper TypeScript types (no `any`)
- Handle edge cases gracefully
- Keep components small and focused

## Naming Conventions
- Components: PascalCase
- Functions/hooks: camelCase
- Types/Interfaces: PascalCase
- Files: PascalCase for components, camelCase for utils

## Key Features
- Form to capture standup data
- Display last 7 days of entries
- localStorage persistence
- Clean, functional UI
- Responsive design