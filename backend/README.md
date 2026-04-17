# JAM Search Backend

API server and data indexing system for JAM Search.

## Tech Stack

- Node.js 22
- Hono (HTTP framework)
- Drizzle ORM + PostgreSQL
- OpenAI API (embeddings)
- Discord.js, Matrix SDK
- Turndown (HTML to markdown)

## Setup

```bash
npm install
```

Configure environment variables (see `src/env.ts` for required vars):
- `POSTGRES_URL` - PostgreSQL connection string
- `OPENAI_API_KEY` - OpenAI API key
- `DISCORD_TOKEN` - Discord bot token
- `GITHUB_TOKEN` - GitHub personal access token

## Development

```bash
npm run dev          # Start development server with hot reload
npm run typecheck    # Type check without building
npm run lint         # Lint and format code
npm run test         # Run tests
```

## Database

```bash
npm run db:generate  # Generate migration files
npm run db:push      # Push schema changes to database
npm run db:migrate   # Run migrations
```

## Data Indexing Scripts

```bash
npm run fetch-discord                      # Fetch Discord messages
npm run fetch-github                       # Fetch GitHub pages
npm run fetch-pages                        # Fetch web pages
npm run generate-embeddings                # Generate vector embeddings
npm run graypaper:index-search            # Index graypaper sections
npm run update-graypapers                  # Update graypaper versions
npm run fill-archived-messages-for-n-days # Backfill archived messages
```

## Production

```bash
npm run build   # Compile TypeScript
npm start       # Start production server
```

The application includes scheduled cron jobs that run daily to:
- Fetch new Matrix messages
- Check for new graypaper releases
- Index GitHub pages
- Index documentation pages

## API Endpoints

- `GET /search/messages` - Search Matrix messages
- `GET /search/pages` - Search web pages
- `GET /search/graypaper` - Search graypaper sections
- `GET /search/discords` - Search Discord messages
- `GET /embeddings` - Get embeddings for a query
