# JAM Search

A search engine aggregating content from multiple sources including Discord servers, Matrix chat, web pages, GitHub repositories, and technical documentation.

## Live Instances

- **Production**: https://search.fluffylabs.dev
- **Beta**: https://jam-search.netlify.app

## Tech Stack

### Frontend
- React 19 + TypeScript
- Vite
- TailwindCSS 4
- React Query
- React Router 7

### Backend
- Node.js 22
- Hono
- Drizzle ORM + PostgreSQL
- OpenAI (embeddings & vector search)
- Discord.js, Matrix SDK, Firecrawl

## Project Structure

```
├── client/         Frontend application
└── backend/        API server and data indexing
```

## Development

### Backend

```bash
cd backend
npm install
npm run dev
```

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `OPENAI_API_KEY` - OpenAI API key
- `DISCORD_TOKEN` - Discord bot token
- `MATRIX_ACCESS_TOKEN` - Matrix access token
- Additional configuration in `backend/src/env.ts`

### Frontend

```bash
cd client
npm install
npm run dev
```

Configure API endpoint in `client/src/consts.ts`

## Data Indexing

The backend includes scripts for indexing content:

```bash
npm run fetch-discord         # Index Discord messages
npm run fetch-github          # Index GitHub pages
npm run fetch-pages           # Index web pages
npm run generate-embeddings   # Generate vector embeddings
```

Automated jobs run daily to keep content updated.

## Deployment

- **Backend**: Deployed to Heroku
- **Frontend**: Deployed to Netlify (beta) and custom domain (production)

## License

MIT
