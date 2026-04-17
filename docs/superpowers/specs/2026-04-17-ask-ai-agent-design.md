# Ask AI — Agentic Knowledge Assistant

**Status:** Draft
**Date:** 2026-04-17
**Author:** Tomasz Drwięga (brainstormed with Claude)

## Summary

Add an "Ask AI" feature to JAM Search that lets users ask natural-language questions about the indexed knowledge base (graypaper, Discord, Matrix, web pages) and get deeply-researched answers with citations. The feature uses an agentic loop: the LLM has access to search tools and can iterate — searching, fetching full documents, reasoning — until it has enough context to answer.

The existing MCP server is removed as part of this work; its purpose (exposing search tools to an LLM) is superseded by this in-app agent.

## Goals

- Enable **knowledge extraction**, not search ranking. Users ask questions; they do not specify queries.
- Prioritize **answer depth over cost**. The agent may make many tool calls per question.
- Present full transparency of the agent's work: show each search step, then stream the synthesized answer.
- Reuse the existing result-card UI for citations so users see familiar, clickable result components in AI answers.
- Keep the backend stateless; no chat persistence in v1.

## Non-goals

- Persistent chat history across sessions or devices.
- Conversation branching, edit-and-resend, or threading.
- File uploads, image attachments, or multimodal input.
- Arbitrary user-supplied OpenRouter model IDs (v1 uses a curated list).
- Rate limiting beyond what the existing backend enforces; OpenRouter billing is the user's responsibility.
- E2E browser tests; the repo has none today and adding them is scope creep.
- Keeping the MCP server available. Any external MCP consumers must migrate off before this ships.

## Architecture

A new backend endpoint orchestrates an agentic RAG loop. The frontend sends the user's question along with prior conversation turns and the user's OpenRouter API key. The backend calls OpenRouter with tool definitions, executes any tool calls against the existing Orama index, loops until the model produces a final answer, and streams both intermediate steps and the final answer back to the frontend via Server-Sent Events.

```
┌──────────────┐      SSE stream     ┌──────────────┐    tool calls    ┌─────────────┐
│   Frontend   │  ◄─────────────────│   Backend    │  ◄────────────►  │ OpenRouter  │
│  (React)     │  ─────────────────►│   /ask       │                  │   (LLM)     │
└──────────────┘  question+history  └──────────────┘                  └─────────────┘
                                           │
                                           │ search_all / get_full_document
                                           ▼
                                    ┌──────────────┐
                                    │ Orama index  │
                                    │   + /data    │
                                    └──────────────┘
```

### Key components

- **`POST /ask`** — new Hono endpoint. Accepts `{ messages, model, openrouterKey }`. Responds with `text/event-stream`.
- **Agent loop** — calls OpenRouter with tools until `finish_reason === "stop"`. Unbounded iteration (depth over cost).
- **Tools** — exactly two:
  - `search_all(query, limit)` — reuses the existing unified search logic across all sources. Returns an array of result chunks, each with a stable `id` (same ID used by the existing search UI) and a `sourceType` (`graypaper` | `discord` | `matrix` | `page`).
  - `get_full_document(id)` — loads the full markdown of a single document by the `id` returned from `search_all`.
- **MCP server removal** — `/mcp` routes and `backend/src/mcp/` are deleted. The `/search/*` endpoints remain for the regular search UI.

## Backend: agent loop & streaming

### Request shape

```
POST /ask
Content-Type: application/json

{
  "messages": [
    { "role": "user", "content": "How does the accumulate function work?" },
    { "role": "assistant", "content": "..." },
    { "role": "user", "content": "What about the validator selection?" }
  ],
  "model": "anthropic/claude-sonnet-4.5",
  "openrouterKey": "sk-or-v1-..."
}
```

### Loop (pseudocode)

Simplified for clarity; streaming chunks for tool calls accumulate into complete calls before execution. The assistant's response (content + tool_calls) is appended to `messages` once per iteration, followed by one `tool` message per executed tool call.

```
messages = [systemPrompt, ...userMessages]
while true:
  stream = openrouter.chat.completions.create({
    model, messages, tools, stream: true
  })
  assistantMsg = { role: "assistant", content: "", tool_calls: [] }
  for chunk in stream:
    if chunk has content:
      assistantMsg.content += chunk.content
      emit SSE { type: "content_delta", text: chunk.content }
    if chunk has tool_call delta:
      accumulate into assistantMsg.tool_calls
  messages.push(assistantMsg)
  if assistantMsg.tool_calls is empty (finish_reason = "stop"):
    emit SSE { type: "done" }
    break
  for toolCall in assistantMsg.tool_calls:
    emit SSE { type: "tool_call", name, args }
    result = executeTool(toolCall.name, toolCall.args)
    emit SSE { type: "tool_result", name, resultCount }
    messages.push({ role: "tool", tool_call_id: toolCall.id, content: result })
```

### SSE event types

| Event           | Payload                                | Purpose                                                                                 |
| --------------- | -------------------------------------- | --------------------------------------------------------------------------------------- |
| `tool_call`     | `{ name, args }`                       | Frontend renders a "Searching for X..." step in the chat.                               |
| `tool_result`   | `{ name, resultCount }`                | Frontend renders "Found N results". Full results withheld from this event.              |
| `content_delta` | `{ text }`                             | Appended to the currently-streaming assistant message.                                  |
| `citation`      | `{ n, docId, sourceType }`             | Emitted when the model emits a new citation tag. Tells the frontend which doc to render in the citations panel. |
| `done`          | `{}`                                   | Terminates the stream.                                                                  |
| `error`         | `{ message }`                          | Shown in chat if OpenRouter fails or a tool throws unrecoverably.                       |

### Citation detection

The system prompt instructs the model to cite with `[N]` markers and to emit a `<cite n="N" doc="..." />` tag the first time each number is used. The backend parses these tags out of the stream, emits a `citation` event, and strips the tag from the `content_delta` text seen by the frontend. Users see clean `[N]` markers; the frontend maps them to panel cards via the `citation` events.

If the model fails to emit a `<cite>` tag, the `[N]` marker renders as plain text with no linked card. This is a graceful degradation — the answer still reads correctly.

### System prompt (outline)

- Describes the knowledge base: four sources (graypaper, discord, matrix, pages) and what each contains.
- Instructs the model to prefer searching first; to fetch full documents when chunks are insufficient; to iterate as many times as needed for a thorough answer.
- Instructs the model to cite using `[N]` markers and emit `<cite n="N" doc="..." />` the first time each number is used.
- Reminds the model that the user's question may build on prior conversation turns.

### Error handling

| Condition                                       | Behavior                                                                     |
| ----------------------------------------------- | ---------------------------------------------------------------------------- |
| Invalid OpenRouter key                          | `error` event with a message like "Check your API key in Settings."          |
| Tool failure (e.g., `get_full_document` of a missing ID) | Pass error as the tool result to the agent; the agent decides how to recover. |
| Network drop / stream interruption              | Frontend shows the partial answer plus a retry button. No resume logic in v1. |
| Model emits malformed `<cite>` tag              | Ignored; citation panel simply does not show a card for that `[N]`.          |

## Frontend: chat page & citation reuse

### Route and layout

New route: `/ask` — React Router route rendering a two-column layout on wide screens.

```
┌───────────────────────────────────────────────────────────────┐
│ Header (logo | Search | Ask AI | Settings)                    │
├─────────────────────────────────┬─────────────────────────────┤
│   Chat conversation             │   Citations panel           │
│   ─────────────────             │   ─────────────────         │
│   [User] How does accumulate…   │   [1] Graypaper §9          │
│                                 │       (reused ResultCard)   │
│   [AI]  ▸ Searching graypaper…  │                             │
│         ▸ Found 5 results       │   [2] Discord #implementers │
│         ▸ Fetching §9 full doc  │       (reused ResultCard)   │
│                                 │                             │
│         The accumulate function │   [3] Matrix #jam-research  │
│         processes work results  │       (reused ResultCard)   │
│         [1]. Discussion on      │                             │
│         validator selection     │                             │
│         was extensive [2][3]…   │                             │
│                                 │                             │
│   [Input: Ask a follow-up…]     │                             │
└─────────────────────────────────┴─────────────────────────────┘
```

Below the `md` breakpoint, the citations panel becomes a collapsible drawer triggered by a "Sources" button and by clicking `[N]` markers.

The citations panel scrolls with the chat (no scroll-pinning).

### Components

| File                                          | Purpose                                                                                     |
| --------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `pages/ask.tsx`                               | New page. Manages conversation state in `sessionStorage`. Opens SSE on submit.              |
| `components/chat/Message.tsx`                 | Renders user or assistant messages. Assistant messages render tool steps (collapsed) plus streamed answer. |
| `components/chat/ToolStep.tsx`                | "▸ Searching graypaper..." row. Collapsed by default; click to expand full args.            |
| `components/chat/CitationsPanel.tsx`          | Right-side panel. Renders each citation as the matching existing `ResultCard` from `components/results/`. |
| `components/chat/ModelPicker.tsx`             | Dropdown of curated OpenRouter models. Selection stored in `sessionStorage`. Sensible default (e.g., `anthropic/claude-sonnet-4.5`). |

### Conversation state

- Stored in `sessionStorage` under a stable key.
- Gone when the tab closes. Rationale: the underlying dataset changes, so past answers become stale. Fresh each tab.
- Model selection also stored in `sessionStorage`.

### OpenRouter key

- Read from Supabase user data via the existing `useUserData` hook (`openrouter-api-key`).
- If the user is signed in and has a key: use it automatically.
- If not: render an inline prompt in the chat UI with a link to Settings. No fallback to environment variables — the key belongs to the user.

### Entry points

1. **Header nav** — add "Ask AI" alongside the existing nav items.
2. **Home page (`SearchForm.tsx`)** — add "Ask AI" as a third mode beside Regular and Extended. Submitting in Ask AI mode navigates to `/ask?q=<encoded question>` and auto-submits.
3. **Results page pivot** — add an "Ask AI about these results" button. Clicking navigates to `/ask?q=<current search query>` and **pre-fills** the chat input (does not auto-send; the user reviews before sending).

### Curated model list (v1)

A small set of OpenRouter models known to support tool use well. Example set (exact IDs verified against OpenRouter's catalog at implementation time):

- `anthropic/claude-sonnet-4.5` (default)
- `anthropic/claude-opus-4.5`
- `openai/gpt-5`
- `google/gemini-2.5-pro`

Maintained as a constant in the frontend. Adding/removing a model is a one-line change.

## Testing

### Backend (Vitest)

- **Unit: tool executors.** `executeTool("search_all", ...)` and `executeTool("get_full_document", ...)` against a small markdown fixture in the test directory.
- **Unit: SSE event formatting.** Given a sequence of fake OpenRouter chunks (tool_call, content, done), verify the correct sequence of SSE events is emitted.
- **Integration: full `/ask` request.** Mock the OpenRouter HTTP endpoint with a scripted tool-call-then-answer sequence; assert the end-to-end SSE stream.

### Frontend

- **Unit: `Message.tsx`.** Renders tool steps (collapsed), renders `[N]` markers as interactive links mapped to citation events.
- **Unit: `CitationsPanel.tsx`.** Renders each of the four source types using the correct existing `ResultCard` component.
- **Unit: `ModelPicker.tsx`.** Defaults correctly; selection persists to `sessionStorage`.

### Manual QA

- Ask a representative question across each of the four sources.
- Verify tool steps render, citations appear on the right, cards match the existing search-result cards.
- Verify mobile drawer works below `md` breakpoint.
- Verify "invalid key" path shows a link to Settings.

## Rollout sequence

For the implementation plan:

1. Remove MCP server: delete `/mcp` routes, `backend/src/mcp/` directory, and MCP-related dependencies. Update README to remove MCP documentation.
2. Add `get_full_document` helper; wire `search_all` and `get_full_document` as tool-callable functions using the existing search logic.
3. Add `POST /ask` endpoint with the agent loop and SSE streaming. Cover with unit + integration tests.
4. Add the `/ask` route in the frontend with chat UI, citations panel, and result card reuse. Cover with unit tests.
5. Add entry points: header nav item, `SearchForm.tsx` third mode, results-page "Ask AI about these results" button.
6. Add curated model list and picker.

## Open questions

None blocking. The following are worth revisiting after v1 ships based on usage:

- Whether single-shot Q&A would be preferred (currently multi-turn).
- Whether to persist chats to Supabase (currently session-only).
- Whether to expose `search_pages`, `search_discord`, etc. as separate tools (currently only `search_all`).
- Whether to allow arbitrary OpenRouter model IDs (currently curated).
