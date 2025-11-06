# JAM Search Client

Frontend application for JAM Search.

## Tech Stack

- React 19
- TypeScript
- Vite
- TailwindCSS 4
- React Query (data fetching)
- React Router 7
- Radix UI components
- Lucide icons

## Setup

```bash
npm install
```

Configure API endpoint in `src/consts.ts`:
```typescript
export const API_URL = 'http://localhost:3000'
```

## Development

```bash
npm run dev        # Start dev server (http://localhost:5173)
npm run typecheck  # Type check without building
npm run lint       # Lint code
npm run test       # Run tests
npm run test:dev   # Run tests in watch mode
```

## Build

```bash
npm run build      # Build for production (outputs to dist/)
npm run preview    # Preview production build locally
```

## Project Structure

```
src/
├── components/    # Reusable UI components
├── pages/         # Route components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
├── providers/     # React context providers
└── assets/        # Static assets
```

## Deployment

The application is deployed to:
- Production: https://search.fluffylabs.dev
- Beta: https://jam-search.netlify.app
