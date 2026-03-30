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

## MCP (Model Context Protocol) Endpoint

The backend exposes an MCP server at `/mcp` for AI tool integration. This allows LLMs to search the JAM ecosystem knowledge base.

### Available Tools

| Tool | Description |
|------|-------------|
| `search_pages` | Search indexed web pages and documentation |
| `search_discord` | Search Discord messages from JAM servers |
| `search_matrix` | Search Matrix chat messages |
| `search_graypaper` | Search JAM Graypaper sections |
| `search_all` | Search across all sources simultaneously |

### Usage with Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "jam-search": {
      "url": "https://search-api.fluffylabs.dev/mcp"
    }
  }
}
```

### Protocol

The MCP endpoint uses the Streamable HTTP transport (protocol version 2025-06-18):
- `POST /mcp` - Send JSON-RPC requests (tool calls, initialization)
- `GET /mcp` - Establish SSE stream for server notifications
- `DELETE /mcp` - Terminate session
