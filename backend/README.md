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
- `POST /ask` - Streaming AI assistant (SSE). See [Ask API](#ask-api).
- `POST|GET|DELETE /mcp` - Model Context Protocol endpoint. See [MCP](#mcp).

## Ask API

`POST /ask` runs an agent loop that answers questions using the JAM knowledge
base. Responses stream back as Server-Sent Events.

Request body:

```json
{
  "messages": [{ "role": "user", "content": "What is a refinement context?" }],
  "model": "openai/gpt-4o-mini",
  "openrouterKey": "sk-or-..."
}
```

The agent has access to two tools — `search_all` (unified search across all
sources) and `get_full_document` (fetch full markdown by id). These are the
same tools exposed via [MCP](#mcp).

## MCP

The backend serves a [Model Context Protocol](https://modelcontextprotocol.io)
endpoint at `/mcp` using the Streamable HTTP transport. It exposes the same
two tools the `/ask` agent uses:

- `search_all(query, limit?)` — unified search across graypaper, discord,
  matrix and pages. Returns an array of result chunks, each with a stable `id`,
  `sourceType`, and content preview.
- `get_full_document(id)` — fetch the full markdown of a document by id
  returned from `search_all`.

### Design choices

- **Stateless.** A fresh `Server` + `Transport` is created per request. No
  session state is kept between calls; `initialize` does not return an
  `mcp-session-id` header and there is no `GET` / `DELETE` lifecycle. Any
  MCP client that supports stateless Streamable HTTP works.
- **No CORS.** `/mcp` intentionally sets no `Access-Control-Allow-Origin`
  header. It is meant for server-to-server / local MCP clients, not browser
  origins. The other endpoints still apply CORS for the frontend.
- **No embeddings.** Tool calls run fulltext-only search; the server's
  OpenAI quota is never spent on anonymous MCP traffic. `/ask` still uses
  hybrid search because the caller supplies their own OpenRouter key.

### Connecting a client

Point any MCP client at the public deployment or your local dev server:

- Production: `https://search-api.fluffylabs.dev/mcp`
- Local dev: `http://localhost:3000/mcp`

Example Claude Desktop (`claude_desktop_config.json`) entry:

```json
{
  "mcpServers": {
    "jam-search": {
      "url": "https://search-api.fluffylabs.dev/mcp"
    }
  }
}
```

### Manual probe

Stateless mode means a single POST per interaction — no session bookkeeping.

```bash
# Initialize and read the server's advertised capabilities:
curl -s -X POST http://localhost:3000/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize",
       "params":{"protocolVersion":"2025-03-26","capabilities":{},
                 "clientInfo":{"name":"probe","version":"0.0.1"}}}'

# List the two tools:
curl -s -X POST http://localhost:3000/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list"}'

# Call search_all:
curl -s -X POST http://localhost:3000/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call",
       "params":{"name":"search_all","arguments":{"query":"refine"}}}'
```
