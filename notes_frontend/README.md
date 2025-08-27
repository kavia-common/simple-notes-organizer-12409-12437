# Simple Notes (Vue 3 + Vite)

A minimal, modern notes SPA with create, read, update, delete, and search. Responsive layout, light/dark theme.

## Colors
- Primary: `#1976d2`
- Accent: `#82b1ff`
- Secondary: `#424242`

## Backend API
The app expects a notes backend that exposes:
- GET    `GET {VITE_NOTES_API_URL}/notes` -> Note[]
- POST   `POST {VITE_NOTES_API_URL}/notes` -> created Note
- PUT    `PUT {VITE_NOTES_API_URL}/notes/:id` -> updated Note
- DELETE `DELETE {VITE_NOTES_API_URL}/notes/:id` -> 204

Configure the base URL via environment:
- VITE_NOTES_API_URL (default: `/api`)

## Setup

```bash
npm install
npm run dev
```

Build:
```bash
npm run build
```

Environment example:
```bash
# .env
VITE_NOTES_API_URL=https://your-backend.example.com
```
