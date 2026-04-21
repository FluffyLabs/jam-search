import * as fs from "node:fs";
import * as path from "node:path";
import matter from "gray-matter";
import { CONTENT_KINDS, type ContentKind } from "../../../shared/pages.js";
import { generateEmbeddings } from "./embeddings.js";
import {
  countDocs,
  insertDocs,
  type SearchDB,
  type SearchDoc,
} from "./searchIndex.js";

// Regex to parse individual chat messages from a daily markdown file
// Format: **sender** (2025-04-20T10:23:00.000Z) [msgid:$abc123]:
const MESSAGE_PATTERN =
  /^\*\*(.+?)\*\* \((\d{4}-\d{2}-\d{2}T[\d:.]+Z)\) \[msgid:(.+?)\]:/gm;

interface ParsedMessage {
  sender: string;
  timestamp: string;
  messageId: string;
  content: string;
}

function parseMessages(body: string): ParsedMessage[] {
  const messages: ParsedMessage[] = [];
  const matches = [...body.matchAll(MESSAGE_PATTERN)];

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const sender = match[1];
    const timestamp = match[2];
    const messageId = match[3];

    // Content starts after the match and goes until the next message or end
    const contentStart = (match.index ?? 0) + match[0].length;
    const contentEnd =
      i + 1 < matches.length
        ? (matches[i + 1].index ?? body.length)
        : body.length;
    const content = body.slice(contentStart, contentEnd).trim();

    if (content) {
      messages.push({ sender, timestamp, messageId, content });
    }
  }

  return messages;
}

function loadMatrixFile(
  filePath: string,
  frontmatter: Record<string, unknown>,
  body: string
): SearchDoc[] {
  const messages = parseMessages(body);
  return messages.map((msg) => ({
    type: "matrix" as const,
    content: msg.content,
    sender: msg.sender,
    messageId: msg.messageId,
    roomId: frontmatter.room_id as string,
    roomName: frontmatter.room_name as string,
    timestamp: new Date(msg.timestamp).getTime(),
    filePath,
  }));
}

function loadDiscordFile(
  filePath: string,
  frontmatter: Record<string, unknown>,
  body: string
): SearchDoc[] {
  const messages = parseMessages(body);
  return messages.map((msg) => ({
    type: "discord" as const,
    content: msg.content,
    sender: msg.sender,
    messageId: msg.messageId,
    channelId: frontmatter.channel_id as string,
    threadId: (frontmatter.thread_id as string) || undefined,
    serverId: frontmatter.server_id as string,
    channelName: frontmatter.channel_name as string,
    authorId: undefined,
    timestamp: new Date(msg.timestamp).getTime(),
    filePath,
  }));
}

function loadPageFile(
  filePath: string,
  frontmatter: Record<string, unknown>,
  body: string
): SearchDoc[] {
  const contentKindRaw = frontmatter.content_kind as string | undefined;
  const contentKind = (CONTENT_KINDS as readonly string[]).includes(
    contentKindRaw ?? ""
  )
    ? (contentKindRaw as ContentKind)
    : undefined;

  return [
    {
      type: "page" as const,
      content: body,
      title: frontmatter.title as string,
      url: frontmatter.url as string,
      site: frontmatter.site as string,
      contentKind,
      language: frontmatter.language as string | undefined,
      timestamp: frontmatter.created_at
        ? new Date(frontmatter.created_at as string).getTime()
        : undefined,
      filePath,
    },
  ];
}

function loadGraypaperSectionFile(
  filePath: string,
  frontmatter: Record<string, unknown>,
  body: string
): SearchDoc[] {
  return [
    {
      type: "graypaper_section" as const,
      content: body,
      title: frontmatter.title as string,
      filePath,
    },
  ];
}

function loadGraypaperVersionsFile(
  frontmatter: Record<string, unknown>
): SearchDoc[] {
  const versions = frontmatter.versions as
    | Array<{ version: string; timestamp: string }>
    | undefined;
  if (!versions) return [];

  return versions.map((v) => ({
    type: "graypaper_version" as const,
    content: `Graypaper version ${v.version}`,
    title: v.version,
    timestamp: new Date(v.timestamp).getTime(),
    filePath: "graypaper/versions.md",
  }));
}

function loadMarkdownFile(dataDir: string, filePath: string): SearchDoc[] {
  const fullPath = path.join(dataDir, filePath);
  const raw = fs.readFileSync(fullPath, "utf-8");
  const { data: frontmatter, content: body } = matter(raw);
  const type = frontmatter.type as string;

  switch (type) {
    case "matrix":
      return loadMatrixFile(filePath, frontmatter, body);
    case "discord":
      return loadDiscordFile(filePath, frontmatter, body);
    case "page":
      return loadPageFile(filePath, frontmatter, body);
    case "graypaper_section":
      return loadGraypaperSectionFile(filePath, frontmatter, body);
    case "graypaper_versions":
      return loadGraypaperVersionsFile(frontmatter);
    default:
      console.warn(`Unknown document type "${type}" in ${filePath}`);
      return [];
  }
}

function findMarkdownFiles(dir: string, base: string = ""): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(path.join(dir, base), { withFileTypes: true });

  for (const entry of entries) {
    const relative = path.join(base, entry.name);
    if (entry.isDirectory()) {
      files.push(...findMarkdownFiles(dir, relative));
    } else if (entry.name.endsWith(".md")) {
      files.push(relative);
    }
  }

  return files;
}

export async function loadAllData(
  db: SearchDB,
  dataDir: string,
  cacheDir: string,
  openaiApiKey: string,
  embeddingsEnabled: boolean = true
): Promise<void> {
  console.log(`Loading data from ${dataDir}...`);

  // Find all markdown files
  const files = findMarkdownFiles(dataDir);
  console.log(`Found ${files.length} markdown files`);

  // Parse all files into documents
  const allDocs: SearchDoc[] = [];
  for (const file of files) {
    try {
      const docs = loadMarkdownFile(dataDir, file);
      allDocs.push(...docs.filter((d) => d.content.trim()));
    } catch (error) {
      console.error(`Error loading ${file}:`, error);
    }
  }

  console.log(`Parsed ${allDocs.length} documents`);

  if (embeddingsEnabled) {
    // Generate embeddings (uses cache, only calls OpenAI for new docs)
    await generateEmbeddings(allDocs, cacheDir, openaiApiKey);
  } else {
    console.log("Skipping embedding generation (EMBEDDINGS_ENABLED=false)");
  }

  // Batch insert into Orama
  if (allDocs.length > 0) {
    insertDocs(db, allDocs);
  }

  console.log(`Indexed ${countDocs(db)} documents into Orama`);
}
