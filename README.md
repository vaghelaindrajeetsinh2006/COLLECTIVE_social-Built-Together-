# COLLECTIVE — Social, Built Together

COLLECTIVE is a frontend-only social experience built around **collective creation instead of feed-based consumption**. People join a shared goal, contribute ideas, build on each other, challenge assumptions, remix contributions, and finish with one shared outcome.

## Core Flow

**Shared Goal → Join → Contribute → Build → Challenge → Remix → Collective Result → AI Collective Insight**

The AI layer is a deterministic, client-side prototype analysis. It does not require a backend, database, secret API key, or external AI service.

## Features

- Collaborative Collective workspaces
- Spatial idea / contribution visualization
- Build, challenge, and remix interactions
- Collective progress and staged completion
- Client-side AI Collective Insight
- Create and join Collectives
- LocalStorage persistence
- Responsive mobile/tablet/desktop UI
- Keyboard and ARIA-friendly interactions
- GitHub Pages deployment via GitHub Actions

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- LocalStorage
- Mock/static data

## Run Locally

```bash
npm install
npm run dev
```

Open the URL shown by Vite (normally `http://localhost:3000`).

## Validate Before Deployment

```bash
npm test
npm run typecheck
npm run build
```

## Frontend-only Architecture

This project intentionally does not use Node/Express APIs, databases, authentication servers, payment services, or exposed AI API keys. Application state and the prototype AI insight are handled entirely in the browser.

## Deployment

GitHub Pages base path:

```text
/collective_social-built-together-/
```

Workflow:

```text
main → install → test → typecheck → build → upload Pages artifact → deploy
```

## Author

Vaghela Indrajeetsinh
