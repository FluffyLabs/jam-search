import * as fs from "node:fs";
import * as path from "node:path";
import matter from "gray-matter";

function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// --- Chat Messages (Matrix / Discord) ---

export interface ChatMessage {
  sender: string;
  timestamp: Date;
  messageId: string;
  content: string;
}

function formatMessage(msg: ChatMessage): string {
  return `**${msg.sender}** (${msg.timestamp.toISOString()}) [msgid:${msg.messageId}]:\n${msg.content}`;
}

function formatMessages(messages: ChatMessage[]): string {
  // Sort by timestamp
  const sorted = [...messages].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );
  return sorted.map(formatMessage).join("\n\n");
}

export function writeMatrixDayFile(
  dataDir: string,
  roomName: string,
  roomId: string,
  date: string,
  messages: ChatMessage[]
): string {
  const dirName = slugify(roomName);
  const dir = path.join(dataDir, "matrix", dirName);
  ensureDir(dir);

  const filePath = path.join(dir, `${date}.md`);
  const relativePath = path.relative(dataDir, filePath);

  // If file exists, merge new messages with existing ones
  let existingMessages: ChatMessage[] = [];
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { content: body } = matter(raw);
    existingMessages = parseExistingMessages(body);
  }

  // Merge: deduplicate by messageId
  const seen = new Set(existingMessages.map((m) => m.messageId));
  const merged = [...existingMessages];
  for (const msg of messages) {
    if (!seen.has(msg.messageId)) {
      merged.push(msg);
      seen.add(msg.messageId);
    }
  }

  const frontmatter = {
    type: "matrix",
    room_id: roomId,
    room_name: roomName,
    date,
  };

  const content = matter.stringify(formatMessages(merged), frontmatter);
  fs.writeFileSync(filePath, content, "utf-8");
  return relativePath;
}

export function writeDiscordDayFile(
  dataDir: string,
  channelName: string,
  channelId: string,
  serverId: string,
  date: string,
  messages: ChatMessage[],
  threadId?: string
): string {
  const dirName = slugify(channelName);
  let dir: string;

  if (threadId) {
    dir = path.join(dataDir, "discord", dirName, "threads");
  } else {
    dir = path.join(dataDir, "discord", dirName);
  }
  ensureDir(dir);

  const fileName = threadId ? `${threadId}.md` : `${date}.md`;
  const filePath = path.join(dir, fileName);
  const relativePath = path.relative(dataDir, filePath);

  // Merge with existing
  let existingMessages: ChatMessage[] = [];
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { content: body } = matter(raw);
    existingMessages = parseExistingMessages(body);
  }

  const seen = new Set(existingMessages.map((m) => m.messageId));
  const merged = [...existingMessages];
  for (const msg of messages) {
    if (!seen.has(msg.messageId)) {
      merged.push(msg);
      seen.add(msg.messageId);
    }
  }

  const frontmatter: Record<string, string> = {
    type: "discord",
    channel_id: channelId,
    server_id: serverId,
    channel_name: channelName,
    date,
  };
  if (threadId) {
    frontmatter.thread_id = threadId;
  }

  const content = matter.stringify(formatMessages(merged), frontmatter);
  fs.writeFileSync(filePath, content, "utf-8");
  return relativePath;
}

// Parse messages from an existing daily chat file body
function parseExistingMessages(body: string): ChatMessage[] {
  const pattern =
    /^\*\*(.+?)\*\* \((\d{4}-\d{2}-\d{2}T[\d:.]+Z)\) \[msgid:(.+?)\]:/gm;
  const messages: ChatMessage[] = [];
  const matches = [...body.matchAll(pattern)];

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const contentStart = (match.index ?? 0) + match[0].length;
    const contentEnd =
      i + 1 < matches.length ? (matches[i + 1].index ?? body.length) : body.length;
    const content = body.slice(contentStart, contentEnd).trim();

    messages.push({
      sender: match[1],
      timestamp: new Date(match[2]),
      messageId: match[3],
      content,
    });
  }

  return messages;
}

// --- Pages (Docs / GitHub) ---

export interface PageData {
  url: string;
  title: string;
  content: string;
  site: string;
  createdAt: Date;
  lastModified: Date;
}

export function writePageFile(
  dataDir: string,
  subDir: string,
  fileName: string,
  page: PageData
): string {
  const dir = path.join(dataDir, "pages", subDir);
  ensureDir(dir);

  const filePath = path.join(dir, `${fileName}.md`);
  const relativePath = path.relative(dataDir, filePath);

  const frontmatter = {
    type: "page",
    url: page.url,
    title: page.title,
    site: page.site,
    created_at: page.createdAt.toISOString(),
    last_modified: page.lastModified.toISOString(),
  };

  const content = matter.stringify(page.content, frontmatter);
  fs.writeFileSync(filePath, content, "utf-8");
  return relativePath;
}

export function writeDocsPage(dataDir: string, page: PageData): string {
  const slug = slugify(
    new URL(page.url).pathname.replace(/^\/|\/$/g, "") || page.title
  );
  return writePageFile(dataDir, "docs", slug, page);
}

export function writeGithubPage(
  dataDir: string,
  owner: string,
  repo: string,
  type: string,
  number: number,
  page: PageData
): string {
  const subDir = path.join("github", `${owner}-${repo}`);
  const fileName = `${type}-${number}`;
  return writePageFile(dataDir, subDir, fileName, page);
}

// --- Graypaper ---

export interface GraypaperSection {
  title: string;
  text: string;
  index: number;
}

export function writeGraypaperSection(
  dataDir: string,
  section: GraypaperSection
): string {
  const dir = path.join(dataDir, "graypaper", "sections");
  ensureDir(dir);

  const slug = slugify(section.title);
  const paddedIndex = String(section.index).padStart(2, "0");
  const fileName = `${paddedIndex}-${slug}.md`;
  const filePath = path.join(dir, fileName);
  const relativePath = path.relative(dataDir, filePath);

  const frontmatter = {
    type: "graypaper_section",
    title: section.title,
    index: section.index,
  };

  const content = matter.stringify(section.text, frontmatter);
  fs.writeFileSync(filePath, content, "utf-8");
  return relativePath;
}

export function writeGraypaperVersions(
  dataDir: string,
  versions: Array<{ version: string; timestamp: Date }>
): string {
  const dir = path.join(dataDir, "graypaper");
  ensureDir(dir);

  const filePath = path.join(dir, "versions.md");
  const relativePath = path.relative(dataDir, filePath);

  const frontmatter = {
    type: "graypaper_versions",
    versions: versions.map((v) => ({
      version: v.version,
      timestamp: v.timestamp.toISOString(),
    })),
  };

  const body = versions
    .map((v) => `- **${v.version}** — ${v.timestamp.toISOString()}`)
    .join("\n");

  const content = matter.stringify(body, frontmatter);
  fs.writeFileSync(filePath, content, "utf-8");
  return relativePath;
}

// --- Utility ---

export function clearGraypaperSections(dataDir: string): void {
  const dir = path.join(dataDir, "graypaper", "sections");
  if (fs.existsSync(dir)) {
    for (const file of fs.readdirSync(dir)) {
      fs.unlinkSync(path.join(dir, file));
    }
  }
}

export { slugify };
