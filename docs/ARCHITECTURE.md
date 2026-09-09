# COLLECTIVE Architecture

COLLECTIVE is intentionally frontend-only. UI composition is kept separate from platform state, domain data, persistence, and deterministic AI-style analysis.

## Layers

```text
App.tsx
  ↓
UI Components
  ↓
useCollectivePlatform
  ↓
Domain utilities + LocalStorage
  ↓
Static collective data
```

## Responsibilities

- `src/components/` — presentational UI and focused interaction surfaces.
- `src/hooks/useCollectivePlatform.ts` — page-level state and orchestration.
- `src/utils/storage.ts` — persistence and legacy-state normalization.
- `src/utils/aiAnalysis.ts` — deterministic client-side synthesis and analysis.
- `src/utils/avatar.ts` — local deterministic avatar generation with no third-party image requests.
- `src/data/` — curated demo content.
- `src/types/` — shared TypeScript domain contracts.

## Design Goal

The architecture supports the product idea without introducing a server, database, authentication service, or exposed AI secret. The same interaction model can later be connected to a real multi-user backend without changing the core UI contracts.
