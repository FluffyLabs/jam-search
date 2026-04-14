import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

import { searchDiscords } from "../api/searchDiscords.js";
import { searchGraypaper } from "../api/searchGraypapers.js";
import { searchMessages } from "../api/searchMessages.js";
import { searchPages } from "../api/searchPages.js";
import type { EmbeddingCache } from "../cache/embeddingCache.js";
import type { SearchDB } from "../data/searchIndex.js";

const SearchPagesInputSchema = z.object({
  query: z.string().describe("Search query for web pages and documentation"),
  site: z
    .string()
    .optional()
    .describe(
      "Filter by site (e.g., 'jam.web3.foundation' or 'github.com/w3f/jamtestvectors')"
    ),
  limit: z
    .number()
    .int()
    .positive()
    .max(20)
    .default(10)
    .describe("Maximum number of results to return"),
});

const SearchDiscordInputSchema = z.object({
  query: z.string().describe("Search query for Discord messages"),
  from: z.string().optional().describe("Filter by sender username"),
  channelId: z.string().optional().describe("Filter by channel ID"),
  limit: z
    .number()
    .int()
    .positive()
    .max(20)
    .default(10)
    .describe("Maximum number of results to return"),
});

const SearchMatrixInputSchema = z.object({
  query: z.string().describe("Search query for Matrix chat messages"),
  from: z.string().optional().describe("Filter by sender username"),
  channelId: z.string().optional().describe("Filter by room/channel ID"),
  limit: z
    .number()
    .int()
    .positive()
    .max(20)
    .default(10)
    .describe("Maximum number of results to return"),
});

const SearchGraypaperInputSchema = z.object({
  query: z
    .string()
    .describe("Search query for JAM Graypaper technical documentation"),
  limit: z
    .number()
    .int()
    .positive()
    .max(20)
    .default(10)
    .describe("Maximum number of results to return"),
});

const SearchAllInputSchema = z.object({
  query: z.string().describe("Search query to run across all sources"),
  limit: z
    .number()
    .int()
    .positive()
    .max(10)
    .default(5)
    .describe("Maximum number of results per source"),
});

const TOOLS = [
  {
    name: "search_pages",
    description:
      "Search indexed web pages and github issues and discussions from JAM ecosystem websites including docs.jamcha.in, jam.web3.foundation, jam-conformance, jam-test-vectors, and other technical resources.",
    inputSchema: z.toJSONSchema(SearchPagesInputSchema),
  },
  {
    name: "search_discord",
    description:
      "Search Discord messages from JAM-related Discord servers. Useful for finding community discussions, Q&A, and announcements.",
    inputSchema: z.toJSONSchema(SearchDiscordInputSchema),
  },
  {
    name: "search_matrix",
    description:
      "Search Matrix chat messages from JAM-related Matrix rooms. Useful for finding technical discussions and developer conversations.",
    inputSchema: z.toJSONSchema(SearchMatrixInputSchema),
  },
  {
    name: "search_graypaper",
    description:
      "Search the JAM Graypaper (technical specification) sections. Best for finding specific technical details, formulas, and protocol specifications.",
    inputSchema: z.toJSONSchema(SearchGraypaperInputSchema),
  },
  {
    name: "search_all",
    description:
      "Search across all sources (pages, Github, Discord, Matrix, Graypaper) simultaneously. Returns combined results from all sources.",
    inputSchema: z.toJSONSchema(SearchAllInputSchema),
  },
];

const noOpEmbeddingCache: EmbeddingCache = {
  store: () => "",
  retrieve: () => undefined,
  clear: () => {},
};

function formatPageResults(
  results: Awaited<ReturnType<typeof searchPages>>
): string {
  if (results.error) {
    return `Error: ${results.error}`;
  }
  if (results.results.length === 0) {
    return "No results found.";
  }

  return results.results
    .map((r, i) => {
      return `[${i + 1}] ${r.title}\nURL: ${r.url}\nSite: ${r.site}\n${r.content}`;
    })
    .join("\n\n---\n\n");
}

function formatDiscordResults(
  results: Awaited<ReturnType<typeof searchDiscords>>
): string {
  if (results.error) {
    return `Error: ${results.error}`;
  }
  if (results.results.length === 0) {
    return "No results found.";
  }

  return results.results
    .map((r, i) => {
      const timestamp = r.timestamp
        ? new Date(r.timestamp).toISOString()
        : "unknown";
      return `[${i + 1}] ${r.sender} (${timestamp})\nChannel: ${r.channelId}\n${r.content}`;
    })
    .join("\n\n---\n\n");
}

function formatMatrixResults(
  results: Awaited<ReturnType<typeof searchMessages>>
): string {
  if (results.error) {
    return `Error: ${results.error}`;
  }
  if (results.results.length === 0) {
    return "No results found.";
  }

  return results.results
    .map((r, i) => {
      const timestamp = r.timestamp
        ? new Date(r.timestamp).toISOString()
        : "unknown";
      return `[${i + 1}] ${r.sender} (${timestamp})\nRoom: ${r.roomId}\n${r.content}`;
    })
    .join("\n\n---\n\n");
}

function formatGraypaperResults(
  results: Awaited<ReturnType<typeof searchGraypaper>>
): string {
  if (results.error) {
    return `Error: ${results.error}`;
  }
  if (results.results.length === 0) {
    return "No results found.";
  }

  return results.results
    .map((r, i) => {
      const text =
        r.text && r.text.length > 800
          ? `${r.text.substring(0, 800)}...`
          : r.text;
      return `[${i + 1}] Section: ${r.title}\n${text}`;
    })
    .join("\n\n---\n\n");
}

export function createMcpServer(db: SearchDB, dataDir: string): Server {
  async function handleSearchPages(
    args: z.infer<typeof SearchPagesInputSchema>
  ): Promise<string> {
    const results = await searchPages(
      {
        q: args.query,
        e: "",
        page: 1,
        pageSize: args.limit,
        site: args.site,
      },
      noOpEmbeddingCache,
      db,
      dataDir
    );
    return formatPageResults(results);
  }

  async function handleSearchDiscord(
    args: z.infer<typeof SearchDiscordInputSchema>
  ): Promise<string> {
    const results = await searchDiscords(
      {
        q: args.query,
        e: "",
        page: 1,
        pageSize: args.limit,
        filter_from: args.from,
        channelId: args.channelId,
      },
      noOpEmbeddingCache,
      db,
      dataDir
    );
    return formatDiscordResults(results);
  }

  async function handleSearchMatrix(
    args: z.infer<typeof SearchMatrixInputSchema>
  ): Promise<string> {
    const results = await searchMessages(
      {
        q: args.query,
        e: "",
        page: 1,
        pageSize: args.limit,
        filter_from: args.from,
        channelId: args.channelId,
      },
      noOpEmbeddingCache,
      db,
      dataDir
    );
    return formatMatrixResults(results);
  }

  async function handleSearchGraypaper(
    args: z.infer<typeof SearchGraypaperInputSchema>
  ): Promise<string> {
    const results = await searchGraypaper(
      {
        q: args.query,
        e: "",
        page: 1,
        pageSize: args.limit,
      },
      noOpEmbeddingCache,
      db,
      dataDir
    );
    return formatGraypaperResults(results);
  }

  async function handleSearchAll(
    args: z.infer<typeof SearchAllInputSchema>
  ): Promise<string> {
    const [pages, discord, matrix, graypaper] = await Promise.all([
      searchPages(
        { q: args.query, e: "", page: 1, pageSize: args.limit },
        noOpEmbeddingCache,
        db,
        dataDir
      ),
      searchDiscords(
        { q: args.query, e: "", page: 1, pageSize: args.limit },
        noOpEmbeddingCache,
        db,
        dataDir
      ),
      searchMessages(
        { q: args.query, e: "", page: 1, pageSize: args.limit },
        noOpEmbeddingCache,
        db,
        dataDir
      ),
      searchGraypaper(
        { q: args.query, e: "", page: 1, pageSize: args.limit },
        noOpEmbeddingCache,
        db,
        dataDir
      ),
    ]);

    const sections = [
      `## Web Pages (${pages.total} total)\n${formatPageResults(pages)}`,
      `## Discord Messages (${discord.total} total)\n${formatDiscordResults(discord)}`,
      `## Matrix Messages (${matrix.total} total)\n${formatMatrixResults(matrix)}`,
      `## Graypaper Sections (${graypaper.total} total)\n${formatGraypaperResults(graypaper)}`,
    ];

    return sections.join("\n\n========================================\n\n");
  }

  const server = new Server(
    {
      name: "jam-search",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: TOOLS };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      let result: string;

      switch (name) {
        case "search_pages": {
          const parsed = SearchPagesInputSchema.parse(args);
          result = await handleSearchPages(parsed);
          break;
        }
        case "search_discord": {
          const parsed = SearchDiscordInputSchema.parse(args);
          result = await handleSearchDiscord(parsed);
          break;
        }
        case "search_matrix": {
          const parsed = SearchMatrixInputSchema.parse(args);
          result = await handleSearchMatrix(parsed);
          break;
        }
        case "search_graypaper": {
          const parsed = SearchGraypaperInputSchema.parse(args);
          result = await handleSearchGraypaper(parsed);
          break;
        }
        case "search_all": {
          const parsed = SearchAllInputSchema.parse(args);
          result = await handleSearchAll(parsed);
          break;
        }
        default:
          return {
            content: [{ type: "text", text: `Unknown tool: ${name}` }],
            isError: true,
          };
      }

      return {
        content: [{ type: "text", text: result }],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: "text", text: `Error: ${message}` }],
        isError: true,
      };
    }
  });

  return server;
}
