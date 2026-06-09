# Task Tracker Coding Guidelines

## Quick Reference

### Tech Stack

| Package         | Version |
| --------------- | ------- |
| React           | 18.3.1  |
| TypeScript      | 5.4.5   |
| Vite            | 5.3.1   |
| Zustand         | 5.0.3   |
| TanStack Query  | 5.90.5  |
| TanStack Router | 1.95.5  |
| i18next         | 23.11.5 |
| Tailwind CSS    | 3.4.4   |

### Path Alias

```typescript
// Use @app/* for all internal imports
import { Button } from '@app/components/ui/Button';
```

---

## Project Structure

```ini
src/
├── api/           # API layer (mockClient + TanStack Query hooks)
├── components/    # Shared UI components (including shadcn/ui primitives)
├── hooks/         # Custom React hooks
├── i18n/          # i18next configuration
├── locales/       # Translation files (ru.json, en.json)
├── modules/       # Feature modules (domain-specific: Board, TaskDetail)
├── Providers/     # React context providers (Query, Router, etc.)
├── routes/        # TanStack Router file-based routes
├── styles/        # Global styles (index.css with Tailwind)
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
```

---

## Import Order

Imports MUST follow this exact order with blank lines between groups:

```typescript
// 1. React
import { useCallback, useState } from 'react';

// 2. External libraries
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

// 3. Internal modules (@app/*)
import { useTranslation as useAppTranslation } from '@app/i18n';
import { Button } from '@app/components/ui/Button';

// 4. Relative imports
import { useLocalStore } from './store';
import './Component.css';
```

---

## TypeScript Rules

### STRICT: No `any` Without Justification

```typescript
// ❌ FORBIDDEN - will fail review
const data: any = response;
function process(input: any) {}

// ✅ REQUIRED - must have @ts-expect-error with explanation
// @ts-expect-error - LocalStorage might return corrupted JSON, fallback is handled
const data: any = JSON.parse(storedData);

// ✅ PREFERRED - use proper types
interface Task {
  id: string;
  title: string;
}
const data: Task = response;
```

### Type Inference

Let TypeScript infer simple types automatically. Do not annotate redundant types.

```typescript
// ❌ Redundant type annotation
const count: number = 5;
const items: string[] = ['a', 'b'];

// ✅ Let TypeScript infer
const count = 5;
const items = ['a', 'b'];
```

---

## Component Patterns

### Standard Component Template

```typescript
import { memo, useCallback } from 'react';
import { useTranslation } from '@app/i18n';

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export const Button = memo(function Button({
  label,
  onClick,
  disabled = false,
}: ButtonProps) {
  const { t } = useTranslation();

  const handleButtonClick = useCallback(() => {
    onClick();
  }, [onClick]);

  return (
    <button
      className="px-4 py-2 bg-primary text-text rounded-md disabled:opacity-50"
      onClick={handleButtonClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
});
```

### Event Handlers Naming

- Internal handlers MUST use the `handle*` prefix (e.g., `handleDeleteClick`, `handleDragStart`).
- Props representing callbacks MUST use the `on*` prefix (e.g., `onClick`, `onDelete`, `onDragEnd`).

---

## State Management

We separate state into three distinct layers:

| Layer | Tool | Use Case |
| ----- | ---- | -------- |
| **Server State** | TanStack Query | Tasks, Projects, Columns (fetched from mock API) |
| **UI State** | Zustand | Drawer open/close, active task ID, theme |
| **URL State** | TanStack Router | Search query, filters, active project ID |

### TanStack Query Rules

- Always use the `queryOptions` pattern for queries to keep keys and query functions together.
- Never use `useEffect` for data fetching.
- Implement **Optimistic Updates** for mutations that have a high impact on perceived performance (e.g., Drag-and-Drop task status change).

### TanStack Router Rules

- Keep the URL as the single source of truth for filters and search queries.
- Use `validateSearch` with Zod schemas to parse and validate search parameters.

---

## Tailwind CSS & Styling

- Use Tailwind CSS utility classes exclusively. Avoid inline styles or custom CSS unless absolutely necessary.
- Follow a consistent color palette: dark background `#09090b`, surface `#18181b`, borders `#27272a`, primary `#3b82f6`.
- Keep layout responsive and mobile-friendly.

---

## Accessibility (A11y)

- Use semantic HTML tags (`<main>`, `<header>`, `<aside>`, `<nav>`, `<button>`).
- All icon-only buttons MUST have an `aria-label` attribute.
- Ensure proper keyboard navigation (e.g., closing modals with `Escape`).
