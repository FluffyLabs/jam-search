# Custom Code Sources Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `fluffylabs/typeberry`, `tomusdrw/as-lan`, and `tomusdrw/anan-as` as searchable sources, indexing both issues/PRs/discussions (existing pipeline) and source code files from each repo's default branch (new pipeline).

**Architecture:** Add three enum entries wired through existing GitHub-issues ingestion for "free" issue/PR/discussion indexing, plus a new `fetchCodeFiles` script that shallow-clones each repo, filters files by allow/block lists, splits into ~4000-char line-based chunks, and writes markdown chunks using the existing `page` doc type with a new `content_kind: code` frontmatter field. Embeddings cache is keyed by content SHA so wipe-and-rewrite stays cheap. A new weekly GitHub Actions workflow runs the code job.

**Tech Stack:** TypeScript + tsx, Node 22, vitest, `git` CLI (system-installed), `simple-git`-free (use `child_process`), existing `gray-matter` for frontmatter, existing `@orama/orama` schema.

---

## File Structure

### New files

| Path | Responsibility |
|------|---------------|
| `shared/code.ts` | `CodeRepository` type and `CODE_REPOSITORIES` list |
| `backend/src/scripts/fetchCodeFiles.ts` | Clone, walk, filter, chunk, write one repo |
| `backend/src/scripts/codeChunker.ts` | Pure chunking helpers (tested in isolation) |
| `backend/src/scripts/codeFileFilters.ts` | Path/extension filters + language map (pure, tested) |
| `backend/src/jobs/codeFilesJob.ts` | Job entrypoint; iterates `CODE_REPOSITORIES` |
| `backend/src/__tests__/scripts/codeChunker.test.ts` | Chunker unit tests |
| `backend/src/__tests__/scripts/codeFileFilters.test.ts` | Filter / language-map unit tests |
| `.github/workflows/index-code.yml` | Weekly workflow |
| `data/code/.gitkeep` | Ensures directory is tracked |

### Modified files

| Path | Change |
|------|--------|
| `shared/sources.ts` | +3 enum entries |
| `shared/github.ts` | +3 `REPOSITORIES` entries |
| `shared/index.ts` | export `code` namespace |
| `client/src/lib/sources.ts` | +3 `SOURCE_OPTIONS` + `initialSources` entries |
| `backend/src/scripts/fetchGithubPages.ts` | Emit `content_kind: issue \| pr \| discussion` |
| `backend/src/data/searchIndex.ts` | Add `contentKind` + `language` to schema + `SearchDoc` |
| `backend/src/data/loader.ts` | Map `content_kind`/`language` from frontmatter |
| `backend/src/data/embeddings.ts` | Content-SHA-aware `embeddingKey` for code chunks |
| `backend/src/api/searchPages.ts` | Accept `contentKind` + `language` query params; return them |
| `client/src/lib/api.ts` | Add `contentKind`/`language` fields to `PageSearchResponse` |
| `client/src/components/results/PageResultCards.tsx` | Render code chunks with language badge + monospaced block |
| `backend/package.json` | Add `fetch-code` script |
| `README.md` | Add Index: Code badge + `npm run fetch-code` bullet |

---

## Task 1: Add new `Source` enum entries

**Files:**
- Modify: `shared/sources.ts`

- [ ] **Step 1: Add the three new enum entries**

Edit `shared/sources.ts` by inserting new entries, preserving existing alphabetical-ish ordering:

```ts
/** When adding here, make sure to check SOURCE_OPTIONS in client. */
export enum Source {
  GithubDavxyJamConformance = "GithubDavxyJamConformance",
  GithubDavxyJamTestVectors = "GithubDavxyJamTestVectors",
  GithubFluffyLabsJamTesting = "GithubFluffyLabsJamTesting",
  GithubFluffyLabsTypeberry = "GithubFluffyLabsTypeberry",
  GithubTomusdrwAnanAs = "GithubTomusdrwAnanAs",
  GithubTomusdrwAsLan = "GithubTomusdrwAsLan",
  GithubW3fJamMilestoneDelivery = "githubW3fJamMilestoneDelivery",
  GithubW3fJamTestVectors = "githubW3fJamTestVectors",
  Graypaper = "graypaper",
  JamDaoDiscord = "jamDaoDiscord",
  JamWeb3Foundation = "jamWeb3Foundation",
  Jamchain = "jamchain",
  Matrix = "matrix",
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck -w backend && npm -C client run typecheck 2>/dev/null || npm -w client run typecheck`
Expected: PASS. (If the client typecheck script name differs, use `tsc --noEmit` directly in `client/`.)

- [ ] **Step 3: Commit**

```bash
git add shared/sources.ts
git commit -m "Add Source enum entries for typeberry, as-lan, anan-as"
```

---

## Task 2: Register the three repos for the existing GitHub-issues pipeline

**Files:**
- Modify: `shared/github.ts`

- [ ] **Step 1: Append entries**

Add to the `REPOSITORIES` array in `shared/github.ts`:

```ts
  {
    source: Source.GithubFluffyLabsTypeberry,
    dbId: "github.com/fluffylabs/typeberry",
    owner: "fluffylabs",
    repo: "typeberry",
  },
  {
    source: Source.GithubTomusdrwAsLan,
    dbId: "github.com/tomusdrw/as-lan",
    owner: "tomusdrw",
    repo: "as-lan",
  },
  {
    source: Source.GithubTomusdrwAnanAs,
    dbId: "github.com/tomusdrw/anan-as",
    owner: "tomusdrw",
    repo: "anan-as",
  },
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck -w backend`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add shared/github.ts
git commit -m "Add typeberry, as-lan, anan-as to GitHub repositories"
```

---

## Task 3: Create `shared/code.ts` with `CodeRepository` list + export

**Files:**
- Create: `shared/code.ts`
- Modify: `shared/index.ts`

- [ ] **Step 1: Create `shared/code.ts`**

```ts
import { Source } from "./sources.js";

export type CodeRepository = {
  source: Source;
  dbId: string;
  owner: string;
  repo: string;
  /** Override default branch (auto-detected from clone if omitted). */
  defaultBranch?: string;
};

export const CODE_REPOSITORIES: CodeRepository[] = [
  {
    source: Source.GithubFluffyLabsTypeberry,
    dbId: "github.com/fluffylabs/typeberry",
    owner: "fluffylabs",
    repo: "typeberry",
  },
  {
    source: Source.GithubTomusdrwAsLan,
    dbId: "github.com/tomusdrw/as-lan",
    owner: "tomusdrw",
    repo: "as-lan",
  },
  {
    source: Source.GithubTomusdrwAnanAs,
    dbId: "github.com/tomusdrw/anan-as",
    owner: "tomusdrw",
    repo: "anan-as",
  },
];
```

- [ ] **Step 2: Export namespace from `shared/index.ts`**

Change `shared/index.ts` to:

```ts
export * as code from "./code.js";
export * as discord from "./discord.js";
export * as github from "./github.js";
export * as matrix from "./matrix.js";
export * as pages from "./pages.js";
```

- [ ] **Step 3: Typecheck**

Run: `npm run typecheck -w backend`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add shared/code.ts shared/index.ts
git commit -m "Add CODE_REPOSITORIES config for code ingestion"
```

---

## Task 4: Create pure chunker with tests

**Files:**
- Create: `backend/src/scripts/codeChunker.ts`
- Test: `backend/src/__tests__/scripts/codeChunker.test.ts`

- [ ] **Step 1: Write failing tests**

Create `backend/src/__tests__/scripts/codeChunker.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { chunkCodeFile } from "../../scripts/codeChunker.js";

describe("chunkCodeFile", () => {
  it("returns a single chunk when file is small", () => {
    const text = "line 1\nline 2\nline 3\n";
    const chunks = chunkCodeFile(text, { maxChars: 4000, overlapChars: 200 });
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toMatchObject({
      startLine: 1,
      endLine: 3,
      text,
      chunkIndex: 0,
      chunkTotal: 1,
    });
  });

  it("splits when adding next line exceeds maxChars, with line-based overlap", () => {
    const line = `${"x".repeat(99)}\n`; // 100 chars incl newline
    const text = line.repeat(50); // 5000 chars total, 50 lines
    const chunks = chunkCodeFile(text, { maxChars: 1000, overlapChars: 200 });

    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks[0].startLine).toBe(1);
    expect(chunks[0].endLine).toBeLessThanOrEqual(10);

    // Overlap: next chunk should start at a line <= end of previous chunk
    for (let i = 1; i < chunks.length; i++) {
      expect(chunks[i].startLine).toBeLessThanOrEqual(chunks[i - 1].endLine);
      expect(chunks[i].startLine).toBeGreaterThan(1);
    }

    // Chunk index and total are populated
    for (let i = 0; i < chunks.length; i++) {
      expect(chunks[i].chunkIndex).toBe(i);
      expect(chunks[i].chunkTotal).toBe(chunks.length);
    }
  });

  it("emits an oversized single line as its own chunk untouched", () => {
    const hugeLine = "z".repeat(10_000);
    const text = `short\n${hugeLine}\nshort again\n`;
    const chunks = chunkCodeFile(text, { maxChars: 1000, overlapChars: 200 });

    const hugeChunk = chunks.find((c) => c.text.includes(hugeLine));
    expect(hugeChunk).toBeDefined();
    expect(hugeChunk?.text).toContain(hugeLine);
  });

  it("never returns an empty chunk", () => {
    const chunks = chunkCodeFile("", { maxChars: 1000, overlapChars: 200 });
    expect(chunks).toEqual([]);
  });

  it("preserves line endings so start/end line numbers are 1-based and inclusive", () => {
    const text = "a\nb\nc\nd\ne\n";
    const chunks = chunkCodeFile(text, { maxChars: 4, overlapChars: 0 });
    expect(chunks[0].startLine).toBe(1);
    // With maxChars=4 and no overlap, greedy packing should produce multiple chunks
    expect(chunks.length).toBeGreaterThan(1);
    // Last chunk ends at line 5
    expect(chunks[chunks.length - 1].endLine).toBe(5);
  });
});
```

- [ ] **Step 2: Run failing test**

Run: `npm -w backend test -- codeChunker`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `codeChunker.ts`**

Create `backend/src/scripts/codeChunker.ts`:

```ts
export interface CodeChunk {
  /** 1-based inclusive line where chunk starts. */
  startLine: number;
  /** 1-based inclusive line where chunk ends. */
  endLine: number;
  /** Chunk text (original line endings preserved). */
  text: string;
  chunkIndex: number;
  chunkTotal: number;
}

export interface ChunkOptions {
  maxChars: number;
  overlapChars: number;
}

/**
 * Split a text file into line-based chunks. Greedy: pack whole lines into the
 * current chunk until adding the next line would exceed maxChars. When emitting
 * a chunk, rewind by approximately overlapChars worth of trailing lines so the
 * next chunk re-includes them as overlap. A line longer than maxChars becomes
 * its own chunk untouched.
 */
export function chunkCodeFile(text: string, opts: ChunkOptions): CodeChunk[] {
  if (text.length === 0) return [];

  // Split preserving newline endings. `match` with /[^\n]*\n?/g handles the
  // trailing line-without-newline case.
  const rawLines = text.match(/[^\n]*\n?/g) ?? [];
  // The regex always appends one empty trailing match; drop it if present.
  const lines = rawLines[rawLines.length - 1] === "" ? rawLines.slice(0, -1) : rawLines;
  if (lines.length === 0) return [];

  const chunks: Omit<CodeChunk, "chunkIndex" | "chunkTotal">[] = [];

  let i = 0;
  while (i < lines.length) {
    let j = i;
    let size = 0;

    // Pack whole lines until the next one would exceed maxChars
    while (j < lines.length) {
      const next = lines[j];
      if (size > 0 && size + next.length > opts.maxChars) break;
      size += next.length;
      j++;
      // Oversized single line: emit it alone
      if (j === i + 1 && next.length > opts.maxChars) break;
    }

    const chunkLines = lines.slice(i, j);
    chunks.push({
      startLine: i + 1,
      endLine: j,
      text: chunkLines.join(""),
    });

    if (j >= lines.length) break;

    // Rewind by overlapChars worth of trailing lines
    let overlapSize = 0;
    let overlapStart = j;
    while (overlapStart > i + 1 && overlapSize < opts.overlapChars) {
      overlapStart--;
      overlapSize += lines[overlapStart].length;
    }
    i = overlapStart;
  }

  return chunks.map((c, idx) => ({
    ...c,
    chunkIndex: idx,
    chunkTotal: chunks.length,
  }));
}
```

- [ ] **Step 4: Run tests**

Run: `npm -w backend test -- codeChunker`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add backend/src/scripts/codeChunker.ts backend/src/__tests__/scripts/codeChunker.test.ts
git commit -m "Add line-based code chunker with overlap"
```

---

## Task 5: Create file filter + language map helpers with tests

**Files:**
- Create: `backend/src/scripts/codeFileFilters.ts`
- Test: `backend/src/__tests__/scripts/codeFileFilters.test.ts`

- [ ] **Step 1: Write failing tests**

Create `backend/src/__tests__/scripts/codeFileFilters.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  isBinary,
  languageFor,
  shouldIndexPath,
} from "../../scripts/codeFileFilters.js";

describe("shouldIndexPath", () => {
  it("keeps allowed extensions at repo root", () => {
    expect(shouldIndexPath("README.md")).toBe(true);
    expect(shouldIndexPath("Cargo.toml")).toBe(true);
    expect(shouldIndexPath("src/main.rs")).toBe(true);
    expect(shouldIndexPath("src/index.ts")).toBe(true);
  });

  it("rejects disallowed extensions", () => {
    expect(shouldIndexPath("logo.png")).toBe(false);
    expect(shouldIndexPath("bundle.min.js.map")).toBe(false);
    expect(shouldIndexPath("archive.zip")).toBe(false);
  });

  it("rejects blocklisted directories even with allowed extension", () => {
    expect(shouldIndexPath("node_modules/foo/index.ts")).toBe(false);
    expect(shouldIndexPath("target/release/build.rs")).toBe(false);
    expect(shouldIndexPath("dist/main.js")).toBe(false);
    expect(shouldIndexPath("build/out.ts")).toBe(false);
    expect(shouldIndexPath(".git/config")).toBe(false);
  });

  it("rejects blocklisted filenames", () => {
    expect(shouldIndexPath("package-lock.json")).toBe(false);
    expect(shouldIndexPath("Cargo.lock")).toBe(false);
    expect(shouldIndexPath("pnpm-lock.yaml")).toBe(false);
    expect(shouldIndexPath("yarn.lock")).toBe(false);
    expect(shouldIndexPath("subdir/package-lock.json")).toBe(false);
  });

  it("is case-insensitive for extensions", () => {
    expect(shouldIndexPath("README.MD")).toBe(true);
    expect(shouldIndexPath("Main.TS")).toBe(true);
  });
});

describe("languageFor", () => {
  it("maps known extensions", () => {
    expect(languageFor("src/main.ts")).toBe("typescript");
    expect(languageFor("ui/app.tsx")).toBe("typescript");
    expect(languageFor("x.js")).toBe("javascript");
    expect(languageFor("x.rs")).toBe("rust");
    expect(languageFor("a.py")).toBe("python");
    expect(languageFor("README.md")).toBe("markdown");
    expect(languageFor("Cargo.toml")).toBe("toml");
    expect(languageFor("config.yml")).toBe("yaml");
    expect(languageFor("script.sh")).toBe("bash");
  });

  it("falls back to empty string for unknown extension", () => {
    expect(languageFor("mystery")).toBe("");
  });
});

describe("isBinary", () => {
  it("detects null byte in first 8KB", () => {
    const buf = Buffer.concat([Buffer.from("hello\0world"), Buffer.alloc(100)]);
    expect(isBinary(buf)).toBe(true);
  });

  it("considers plain text as non-binary", () => {
    const buf = Buffer.from("export const a = 1;\n// comment\n");
    expect(isBinary(buf)).toBe(false);
  });
});
```

- [ ] **Step 2: Run failing test**

Run: `npm -w backend test -- codeFileFilters`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `codeFileFilters.ts`**

Create `backend/src/scripts/codeFileFilters.ts`:

```ts
import path from "node:path";

const EXT_ALLOWLIST = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
  ".rs", ".toml", ".json",
  ".md", ".mdx",
  ".yml", ".yaml",
  ".go", ".py", ".sh",
  ".cpp", ".cc", ".hpp", ".h", ".c",
]);

const DIR_BLOCKLIST = new Set([
  "node_modules", "target", "dist", "build",
  ".git", ".next", "out", "coverage", "vendor",
]);

const FILENAME_BLOCKLIST = new Set([
  "package-lock.json", "Cargo.lock",
  "yarn.lock", "pnpm-lock.yaml",
]);

const LANGUAGE_MAP: Record<string, string> = {
  ".ts": "typescript", ".tsx": "typescript",
  ".js": "javascript", ".jsx": "javascript",
  ".mjs": "javascript", ".cjs": "javascript",
  ".rs": "rust",
  ".py": "python",
  ".go": "go",
  ".sh": "bash",
  ".toml": "toml",
  ".json": "json",
  ".yml": "yaml", ".yaml": "yaml",
  ".md": "markdown", ".mdx": "markdown",
  ".cpp": "cpp", ".cc": "cpp", ".hpp": "cpp",
  ".h": "cpp", ".c": "cpp",
};

export function shouldIndexPath(relativePath: string): boolean {
  const norm = relativePath.replace(/\\/g, "/");
  const parts = norm.split("/");
  for (const part of parts.slice(0, -1)) {
    if (DIR_BLOCKLIST.has(part)) return false;
  }
  const base = parts[parts.length - 1];
  if (FILENAME_BLOCKLIST.has(base)) return false;
  const ext = path.extname(base).toLowerCase();
  return EXT_ALLOWLIST.has(ext);
}

export function languageFor(relativePath: string): string {
  const ext = path.extname(relativePath).toLowerCase();
  return LANGUAGE_MAP[ext] ?? "";
}

export function isBinary(buf: Buffer): boolean {
  const slice = buf.subarray(0, Math.min(buf.length, 8192));
  return slice.includes(0);
}
```

- [ ] **Step 4: Run tests**

Run: `npm -w backend test -- codeFileFilters`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add backend/src/scripts/codeFileFilters.ts backend/src/__tests__/scripts/codeFileFilters.test.ts
git commit -m "Add file filters and language map for code indexing"
```

---

## Task 6: Create `fetchCodeFiles.ts` (clone + walk + write)

**Files:**
- Create: `backend/src/scripts/fetchCodeFiles.ts`

- [ ] **Step 1: Implement the script**

Create `backend/src/scripts/fetchCodeFiles.ts`:

```ts
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import matter from "gray-matter";
import { chunkCodeFile } from "./codeChunker.js";
import {
  isBinary,
  languageFor,
  shouldIndexPath,
} from "./codeFileFilters.js";

const MAX_FILE_BYTES = 200 * 1024;
const CHUNK_MAX_CHARS = 4000;
const CHUNK_OVERLAP_CHARS = 200;

export interface FetchCodeOptions {
  owner: string;
  repo: string;
  /** Optional default-branch override; auto-detected otherwise. */
  defaultBranch?: string;
  dataDir: string;
  githubToken?: string;
}

function run(cmd: string, args: string[], cwd?: string): string {
  return execFileSync(cmd, args, {
    cwd,
    stdio: ["ignore", "pipe", "pipe"],
    encoding: "utf-8",
  }).trim();
}

function cloneUrl(owner: string, repo: string, token?: string): string {
  if (token) {
    return `https://x-access-token:${token}@github.com/${owner}/${repo}.git`;
  }
  return `https://github.com/${owner}/${repo}.git`;
}

function detectDefaultBranch(repoDir: string): string {
  // Example output: "refs/remotes/origin/main"
  const ref = run("git", ["symbolic-ref", "refs/remotes/origin/HEAD"], repoDir);
  return ref.replace(/^refs\/remotes\/origin\//, "");
}

function walkFiles(rootDir: string): string[] {
  const out: string[] = [];
  const stack: string[] = [""];
  while (stack.length > 0) {
    const rel = stack.pop() as string;
    const abs = path.join(rootDir, rel);
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(abs, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      const entryRel = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        if (entry.name === ".git") continue;
        stack.push(entryRel);
      } else if (entry.isFile()) {
        out.push(entryRel);
      }
    }
  }
  return out;
}

function rmDirIfExists(p: string): void {
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true, force: true });
  }
}

function ensureDir(p: string): void {
  fs.mkdirSync(p, { recursive: true });
}

function sha256Hex(s: string): string {
  return createHash("sha256").update(s, "utf-8").digest("hex");
}

export async function fetchCodeFiles(opts: FetchCodeOptions): Promise<number> {
  const { owner, repo, dataDir, githubToken } = opts;
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), `jam-code-${owner}-${repo}-`));
  const clonePath = path.join(tmpRoot, "repo");

  try {
    run("git", ["clone", "--depth", "1", cloneUrl(owner, repo, githubToken), clonePath]);

    const defaultBranch = opts.defaultBranch ?? detectDefaultBranch(clonePath);
    const headDate = run("git", ["log", "-1", "--format=%cI"], clonePath);

    const destDir = path.join(dataDir, "code", `${owner}-${repo}`);
    rmDirIfExists(destDir);
    ensureDir(destDir);

    const relFiles = walkFiles(clonePath);
    let written = 0;

    for (const relPath of relFiles) {
      if (!shouldIndexPath(relPath)) continue;
      const abs = path.join(clonePath, relPath);
      const stat = fs.statSync(abs);
      if (stat.size > MAX_FILE_BYTES) continue;
      const buf = fs.readFileSync(abs);
      if (isBinary(buf)) continue;

      const text = buf.toString("utf-8");
      const chunks = chunkCodeFile(text, {
        maxChars: CHUNK_MAX_CHARS,
        overlapChars: CHUNK_OVERLAP_CHARS,
      });

      const language = languageFor(relPath);
      const site = `github.com/${owner}/${repo}`;

      for (const chunk of chunks) {
        const url = `https://github.com/${owner}/${repo}/blob/${defaultBranch}/${relPath}#L${chunk.startLine}-L${chunk.endLine}`;
        const body = [
          "`" + relPath + "` (lines " + chunk.startLine + "–" + chunk.endLine + ")",
          "",
          "```" + language,
          chunk.text.endsWith("\n") ? chunk.text.slice(0, -1) : chunk.text,
          "```",
          "",
        ].join("\n");

        const frontmatter = {
          type: "page",
          content_kind: "code",
          url,
          title: relPath,
          site,
          created_at: headDate,
          last_modified: headDate,
          chunk_index: chunk.chunkIndex,
          chunk_total: chunk.chunkTotal,
          content_sha: sha256Hex(chunk.text),
          language,
        };

        const outPath = path.join(
          destDir,
          `${relPath}.${chunk.chunkIndex}.md`,
        );
        ensureDir(path.dirname(outPath));
        fs.writeFileSync(outPath, matter.stringify(body, frontmatter), "utf-8");
        written++;
      }
    }

    console.log(
      `Wrote ${written} code chunks from ${owner}/${repo} (branch ${defaultBranch})`,
    );
    return written;
  } finally {
    rmDirIfExists(tmpRoot);
  }
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck -w backend`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add backend/src/scripts/fetchCodeFiles.ts
git commit -m "Add fetchCodeFiles script: clone, filter, chunk, write"
```

---

## Task 7: Create `codeFilesJob.ts`

**Files:**
- Create: `backend/src/jobs/codeFilesJob.ts`

- [ ] **Step 1: Implement the job**

Create `backend/src/jobs/codeFilesJob.ts`:

```ts
import { code } from "../../../shared/index.js";
import { env } from "../env.js";
import { fetchCodeFiles } from "../scripts/fetchCodeFiles.js";

const DATA_DIR = process.env.DATA_DIR || "./data";

try {
  await main();
  process.exit(0);
} catch (error) {
  console.error("Error in code files job:", error);
  process.exit(1);
}

async function main() {
  console.log("Running code files fetch job at", new Date().toISOString());

  const errors: unknown[] = [];
  for (const config of code.CODE_REPOSITORIES) {
    try {
      console.log(`Fetching code from ${config.owner}/${config.repo}...`);
      const count = await fetchCodeFiles({
        owner: config.owner,
        repo: config.repo,
        defaultBranch: config.defaultBranch,
        dataDir: DATA_DIR,
        githubToken: env.GITHUB_TOKEN,
      });
      console.log(`Successfully processed ${config.owner}/${config.repo}: ${count} chunks`);
    } catch (error) {
      console.error(`Error processing ${config.owner}/${config.repo}:`, error);
      errors.push(error);
    }
  }

  console.log("Code files fetch job completed");
  if (errors.length) {
    throw errors;
  }
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck -w backend`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add backend/src/jobs/codeFilesJob.ts
git commit -m "Add codeFilesJob iterating CODE_REPOSITORIES"
```

---

## Task 8: Extend search schema with `contentKind` and `language`

**Files:**
- Modify: `backend/src/data/searchIndex.ts`

- [ ] **Step 1: Update `SCHEMA` and `SearchDoc`**

Edit `backend/src/data/searchIndex.ts`. Add two schema entries after the existing `enum` block and two optional fields to the interface:

```ts
export const SCHEMA = {
  type: "enum",
  content: "string",
  title: "string",
  sender: "string",
  embedding: "vector[1536]",
  roomId: "enum",
  channelId: "enum",
  threadId: "enum",
  serverId: "enum",
  authorId: "enum",
  messageId: "enum",
  url: "enum",
  site: "enum",
  filePath: "enum",
  roomName: "enum",
  channelName: "enum",
  contentKind: "enum",
  language: "enum",
  timestamp: "number",
} as const;
```

And in `SearchDoc`:

```ts
export interface SearchDoc {
  id?: string;
  type: DocType;
  content: string;
  title?: string;
  sender?: string;
  embedding?: number[];
  roomId?: string;
  channelId?: string;
  threadId?: string;
  serverId?: string;
  authorId?: string;
  messageId?: string;
  url?: string;
  site?: string;
  filePath?: string;
  roomName?: string;
  channelName?: string;
  contentKind?: "issue" | "pr" | "discussion" | "code";
  language?: string;
  timestamp?: number;
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck -w backend`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add backend/src/data/searchIndex.ts
git commit -m "Add contentKind and language to search schema"
```

---

## Task 9: Loader reads `content_kind` and `language` from frontmatter

**Files:**
- Modify: `backend/src/data/loader.ts`

- [ ] **Step 1: Update `loadPageFile`**

Replace the existing `loadPageFile` in `backend/src/data/loader.ts` with:

```ts
function loadPageFile(
  filePath: string,
  frontmatter: Record<string, unknown>,
  body: string
): SearchDoc[] {
  const contentKindRaw = frontmatter.content_kind as string | undefined;
  const contentKind =
    contentKindRaw === "issue" ||
    contentKindRaw === "pr" ||
    contentKindRaw === "discussion" ||
    contentKindRaw === "code"
      ? contentKindRaw
      : undefined;

  return [
    {
      type: "page" as const,
      content: body,
      title: frontmatter.title as string,
      url: frontmatter.url as string,
      site: frontmatter.site as string,
      contentKind,
      language: (frontmatter.language as string | undefined) || undefined,
      timestamp: frontmatter.created_at
        ? new Date(frontmatter.created_at as string).getTime()
        : undefined,
      filePath,
    },
  ];
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck -w backend`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add backend/src/data/loader.ts
git commit -m "Read content_kind and language from page frontmatter"
```

---

## Task 10: Embedding cache keyed by content SHA for code chunks

**Files:**
- Modify: `backend/src/data/embeddings.ts`

- [ ] **Step 1: Extend `embeddingKey`**

Edit `backend/src/data/embeddings.ts`. We don't have the content SHA in `SearchDoc` today. The simplest stable key that survives wipes is `filePath + sha256(content)` for code docs. Replace `embeddingKey`:

```ts
import { createHash } from "node:crypto";

function embeddingKey(doc: SearchDoc): string {
  if (doc.messageId && doc.filePath) {
    return `${doc.filePath}:${doc.messageId}`;
  }
  if (doc.contentKind === "code" && doc.content) {
    const sha = createHash("sha256").update(doc.content, "utf-8").digest("hex");
    return `code:${sha}`;
  }
  return doc.filePath || doc.url || doc.id || "";
}
```

The `createHash` import goes at the top of the file.

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck -w backend`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add backend/src/data/embeddings.ts
git commit -m "Key code embeddings by content SHA so cache survives wipes"
```

---

## Task 11: Accept `contentKind` and `language` query params in `/search/pages`

**Files:**
- Modify: `backend/src/api/searchPages.ts`

- [ ] **Step 1: Extend request schema and response**

Replace the file with:

```ts
import { z } from "zod";
import type { EmbeddingCache } from "../cache/embeddingCache.js";
import type { SearchDB } from "../data/searchIndex.js";
import { searchDocs } from "../data/searchIndex.js";
import { embeddingSchema, resolveEmbedding } from "./common.js";

export const searchPagesRequestSchema = z.object({
  q: z.string(),
  e: embeddingSchema,
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().lte(100).default(10),
  site: z.string().optional(),
  contentKind: z.enum(["issue", "pr", "discussion", "code"]).optional(),
  language: z.string().optional(),
});

export async function searchPages(
  data: z.infer<typeof searchPagesRequestSchema>,
  cache: EmbeddingCache,
  db: SearchDB,
  _dataDir: string
) {
  const embedding = resolveEmbedding(data.e, cache);

  if (data.q.trim().length === 0) {
    return {
      results: [],
      total: 0,
      page: data.page,
      pageSize: data.pageSize,
      error: "No query provided.",
    };
  }

  const where: Record<string, unknown> = {};
  if (data.site) where.site = { eq: data.site };
  if (data.contentKind) where.contentKind = { eq: data.contentKind };
  if (data.language) where.language = { eq: data.language };

  const results = searchDocs(db, {
    term: data.q,
    embedding: embedding.length > 0 ? embedding : undefined,
    type: "page",
    limit: data.pageSize,
    offset: (data.page - 1) * data.pageSize,
    where,
    properties: ["content", "title"] as const,
    boost: { title: 2, content: 1 },
  });

  console.log(`Pages search query found ${results.count} results`);

  return {
    results: results.hits.map((hit) => ({
      id: hit.id,
      url: hit.document.url,
      title: hit.document.title,
      content: hit.document.content,
      site: hit.document.site,
      contentKind: hit.document.contentKind,
      language: hit.document.language,
      lastModified: hit.document.timestamp
        ? new Date(hit.document.timestamp)
        : null,
      createdAt: hit.document.timestamp
        ? new Date(hit.document.timestamp)
        : null,
      similarity: hit.score,
      score: hit.score,
    })),
    total: results.count,
    page: data.page,
    pageSize: data.pageSize,
  };
}
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck -w backend`
Expected: PASS.

- [ ] **Step 3: Run existing tests**

Run: `npm -w backend test`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add backend/src/api/searchPages.ts
git commit -m "Support contentKind and language filters on /search/pages"
```

---

## Task 12: Emit `content_kind` from existing GitHub pages ingestion

**Files:**
- Modify: `backend/src/scripts/fetchGithubPages.ts`

- [ ] **Step 1: Update `storeContentInMarkdown`**

We need the frontmatter writer to accept an extra `content_kind` field. `writePageFile` in `backend/src/data/writer.ts` writes a fixed `frontmatter`; extend its `PageData` and writer to accept optional `contentKind`.

Edit `backend/src/data/writer.ts`:

```ts
export interface PageData {
  url: string;
  title: string;
  content: string;
  site: string;
  createdAt: Date;
  lastModified: Date;
  contentKind?: "issue" | "pr" | "discussion" | "code";
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

  const frontmatter: Record<string, unknown> = {
    type: "page",
    url: page.url,
    title: page.title,
    site: page.site,
    created_at: page.createdAt.toISOString(),
    last_modified: page.lastModified.toISOString(),
  };
  if (page.contentKind) {
    frontmatter.content_kind = page.contentKind;
  }

  const content = matter.stringify(page.content, frontmatter);
  fs.writeFileSync(filePath, content, "utf-8");
  return relativePath;
}
```

Edit `backend/src/scripts/fetchGithubPages.ts`. In `storeContentInMarkdown`, set `contentKind` on the `pageData`:

```ts
    const pageData: PageData = {
      url: item.html_url,
      content: markdownContent,
      title: item.title,
      site,
      createdAt: new Date(item.created_at),
      lastModified,
      contentKind:
        item.type === "pull_request"
          ? "pr"
          : item.type === "discussion"
            ? "discussion"
            : "issue",
    };
```

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck -w backend`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add backend/src/data/writer.ts backend/src/scripts/fetchGithubPages.ts
git commit -m "Emit content_kind on GitHub issue/PR/discussion pages"
```

---

## Task 13: Add `fetch-code` npm script

**Files:**
- Modify: `backend/package.json`

- [ ] **Step 1: Add script**

Edit `backend/package.json` scripts:

```json
    "fetch-code": "tsx ./src/jobs/codeFilesJob.ts",
```

(Insert alongside the other scripts, preserving JSON syntax.)

- [ ] **Step 2: Verify it parses**

Run: `node -e "require('./backend/package.json')"`
Expected: exits 0 with no output.

- [ ] **Step 3: Commit**

```bash
git add backend/package.json
git commit -m "Add fetch-code npm script"
```

---

## Task 14: Add `data/code/.gitkeep`

**Files:**
- Create: `data/code/.gitkeep`

- [ ] **Step 1: Create the file**

```bash
mkdir -p data/code
: > data/code/.gitkeep
```

- [ ] **Step 2: Commit**

```bash
git add data/code/.gitkeep
git commit -m "Add data/code directory placeholder"
```

---

## Task 15: Add `index-code.yml` workflow

**Files:**
- Create: `.github/workflows/index-code.yml`

- [ ] **Step 1: Create the workflow**

```yaml
name: "Index: Code"

on:
  workflow_dispatch:
  schedule:
    # Run weekly on Sunday at 05:00 UTC
    - cron: '0 5 * * 0'

permissions:
  contents: write

jobs:
  run-code-files-job:
    name: Update source code index
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v6
        with:
          token: ${{ secrets.GH_INDEX_TOKEN }}

      - name: Setup Node.js with cache
        uses: actions/setup-node@v6
        with:
          node-version-file: .nvmrc
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run code files job
        run: npm exec tsx -w backend -- ./src/jobs/codeFilesJob.ts
        env:
          GITHUB_TOKEN: ${{ secrets.GH_INDEX_TOKEN }}
          DISCORD_TOKEN: ${{ secrets.DISCORD_TOKEN }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          DATA_DIR: ./data

      - uses: ./.github/actions/commit-data
        with:
          commit-message: "index: update code files"
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/index-code.yml
git commit -m "Add weekly workflow for indexing code files"
```

---

## Task 16: Update README with code indexing docs

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add badge row entry**

In the "Indexing Job Status" section of `README.md`, add after the existing badges:

```markdown
[![Index: Code](https://github.com/FluffyLabs/jam-search/actions/workflows/index-code.yml/badge.svg)](https://github.com/FluffyLabs/jam-search/actions/workflows/index-code.yml)
```

- [ ] **Step 2: Add npm script entry**

In the "Data Indexing" section, add to the code block:

```bash
npm run fetch-code            # Index source code from configured repos
```

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "Document fetch-code job in README"
```

---

## Task 17: Wire up frontend source options

**Files:**
- Modify: `client/src/lib/sources.ts`

- [ ] **Step 1: Add to `SOURCE_OPTIONS` and `initialSources`**

Edit `client/src/lib/sources.ts`:

```ts
export const SOURCE_OPTIONS = [
  { label: "Matrix channels", value: Source.Matrix },
  { label: "Graypaper.pdf", value: Source.Graypaper },
  { label: "docs.jamcha.in", value: Source.Jamchain },
  { label: "github.com/w3f/jamtestvectors", value: Source.GithubW3fJamTestVectors },
  { label: "JAM DAO Discord", value: Source.JamDaoDiscord },
  { label: "github.com/w3f/jam-milestone-delivery", value: Source.GithubW3fJamMilestoneDelivery },
  { label: "github.com/davxy/jam-conformance", value: Source.GithubDavxyJamConformance },
  { label: "github.com/davxy/jam-test-vectors", value: Source.GithubDavxyJamTestVectors },
  { label: "github.com/FluffyLabs/jam-testing", value: Source.GithubFluffyLabsJamTesting },
  { label: "github.com/fluffylabs/typeberry", value: Source.GithubFluffyLabsTypeberry },
  { label: "github.com/tomusdrw/as-lan", value: Source.GithubTomusdrwAsLan },
  { label: "github.com/tomusdrw/anan-as", value: Source.GithubTomusdrwAnanAs },
  { label: "jam.web3.foundation", value: Source.JamWeb3Foundation },
];

export const initialSources = [
  Source.Matrix,
  Source.Graypaper,
  Source.Jamchain,
  Source.GithubDavxyJamConformance,
  Source.GithubDavxyJamTestVectors,
  Source.GithubW3fJamTestVectors,
  Source.JamDaoDiscord,
  Source.GithubW3fJamMilestoneDelivery,
  Source.JamWeb3Foundation,
  Source.GithubFluffyLabsJamTesting,
  Source.GithubFluffyLabsTypeberry,
  Source.GithubTomusdrwAsLan,
  Source.GithubTomusdrwAnanAs,
];
```

- [ ] **Step 2: Typecheck client**

Run: `cd client && npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add client/src/lib/sources.ts
git commit -m "Add new source options to client"
```

---

## Task 18: Extend `PageSearchResponse` with `contentKind` and `language`

**Files:**
- Modify: `client/src/lib/api.ts`

- [ ] **Step 1: Add fields**

In `client/src/lib/api.ts`, update `PageSearchResponse.results` items to include the new fields:

```ts
export interface PageSearchResponse {
  results: Array<{
    id: number;
    url: string;
    site: string;
    title: string;
    content: string;
    contentKind?: "issue" | "pr" | "discussion" | "code";
    language?: string;
    lastModified: string;
    createdAt: string;
    similarity: number;
    score: number;
  }>;
  total: number;
  page: number;
  pageSize: number;
  error?: string;
}
```

- [ ] **Step 2: Typecheck**

Run: `cd client && npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add client/src/lib/api.ts
git commit -m "Expose contentKind and language on PageSearchResponse"
```

---

## Task 19: Render code chunks distinctly in `PageResultCards`

**Files:**
- Modify: `client/src/components/results/PageResultCards.tsx`

- [ ] **Step 1: Branch on `contentKind === "code"`**

Replace the entire body of `client/src/components/results/PageResultCards.tsx` with:

```tsx
import type { useResults } from "@/hooks/useResults";
import { cn, formatDate } from "@/lib/utils";
import { PageResultHighlighter } from "../PageResultHighlighter";
import { ViewEmbedded } from "../ViewEmbedded";
import { NoResults } from "./NoResults";
import { ResultCard } from "./ResultCard";

interface PageResultCardsProps {
  queryResult: ReturnType<typeof useResults>["pagesResults"][0]["results"];
  searchQuery: string;
}

export const PageResultCards = ({
  queryResult,
  searchQuery,
}: PageResultCardsProps) => {
  const { isLoading, isError, results } = queryResult;

  if (results.length === 0 && !isLoading) {
    return <NoResults isError={isError} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {isLoading && queryResult.results.length === 0 ? (
        <>
          <ResultCard.Skeleton />
          <ResultCard.Skeleton />
          <ResultCard.Skeleton />
          <ResultCard.Skeleton />
        </>
      ) : null}
      {results.map((result) => {
        const isCode = result.contentKind === "code";
        const isGithub = result.site.includes("github");
        const githubNumber = Number(result.url.split("/").pop());
        const githubId =
          isGithub && !isCode && Number.isFinite(githubNumber)
            ? `#${githubNumber}`
            : "";

        const header = isCode ? (
          <>
            <span className="font-mono text-sm truncate">{result.title}</span>
            {result.language ? (
              <span className="text-xs text-muted-foreground ml-2 uppercase tracking-wide">
                {result.language}
              </span>
            ) : null}
          </>
        ) : (
          <>
            <span>
              {result.title}{" "}
              <span className="text-muted-foreground">{githubId}</span>
            </span>
            <span
              className={cn(
                "text-xs text-muted-foreground ml-2",
                !isGithub ? "font-mono" : ""
              )}
            >
              {isGithub ? (
                <>
                  {result.url.includes("/pull/") ||
                  result.url.includes("/issues/") ? (
                    <>
                      {result.url.includes("/pull/") ? "PR" : "Issue"}
                      {githubId}
                      {" - "}
                    </>
                  ) : null}
                  {formatDate(result.createdAt)}
                </>
              ) : (
                result.url
                  .replace(/http[s]:\/\//, "")
                  .replace(result.site, "")
              )}
            </span>
          </>
        );

        const content = isCode ? (
          <div className="font-mono text-xs whitespace-pre-wrap break-words">
            <PageResultHighlighter
              result={result}
              searchQuery={searchQuery}
              options={{ maxLength: 400, contextLength: 120 }}
            />
          </div>
        ) : (
          <PageResultHighlighter
            result={result}
            searchQuery={searchQuery}
            options={{ maxLength: 250, contextLength: 75 }}
          />
        );

        return (
          <ResultCard
            key={result.id}
            header={header}
            footer={
              <ViewEmbedded
                noEmbed={isGithub}
                label={isCode ? "Open on GitHub" : isGithub ? "Open Github" : "Open page"}
                url={result.url}
                results={results}
                searchQuery={searchQuery}
              />
            }
            content={content}
          />
        );
      })}
    </div>
  );
};
```

- [ ] **Step 2: Typecheck**

Run: `cd client && npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/results/PageResultCards.tsx
git commit -m "Render code chunks with language badge and monospaced block"
```

---

## Task 20: End-to-end smoke test of the code ingestion pipeline

**Files:**
- (none — manual verification only)

- [ ] **Step 1: Run the job locally against the real repos**

Run:
```bash
GITHUB_TOKEN=$GITHUB_TOKEN DISCORD_TOKEN="" DATA_DIR=./data EMBEDDINGS_ENABLED=false npm -w backend run fetch-code
```
Expected: logs for each repo, no errors, exit 0.

- [ ] **Step 2: Verify output structure**

Run:
```bash
ls data/code/fluffylabs-typeberry | head
ls data/code/tomusdrw-as-lan | head
ls data/code/tomusdrw-anan-as | head
```
Expected: at least a few `.md` files per repo.

- [ ] **Step 3: Spot-check one chunk**

Run:
```bash
find data/code -name "*.md" | head -n 1 | xargs head -n 15
```
Expected output contains frontmatter with `type: page`, `content_kind: code`, a `url: https://github.com/<owner>/<repo>/blob/<branch>/...#L<start>-L<end>`, and a fenced code block below.

- [ ] **Step 4: Run the API to confirm indexing**

Run:
```bash
EMBEDDINGS_ENABLED=false npm -w backend run start
```
In another shell:
```bash
curl 'http://localhost:3000/search/pages?q=typeberry&site=github.com/fluffylabs/typeberry&contentKind=code&pageSize=3' | jq .
```
Expected: JSON response with `results` array whose items have `contentKind: "code"` and `language` set.

- [ ] **Step 5: Verify UI**

Run: `cd client && npm run dev`. Open http://localhost:5173 in a browser. Search for a known identifier from typeberry (e.g. a function name). Confirm:
- The three new repos appear as checkboxes in the source list.
- Results include both issue/PR cards and code chunks (code chunks shown with monospace styling and a language badge).

- [ ] **Step 6: Commit nothing, but remove any temporary `data/code/` noise from the local run**

```bash
git restore --source=HEAD -- data/code || true
git status
```
The working tree should be clean (the repo's normal `data/` content intact).

---

## Self-Review Notes

**Spec coverage:**
- Sources/config (spec §Sources and Configuration) → Tasks 1–3, 17.
- Code ingestion pipeline (spec §Code Ingestion Pipeline) → Tasks 4–7.
- Schema, loader, embeddings (spec §Schema, Loader, and Embeddings) → Tasks 8–10, 12.
- Search API (spec §Search API) → Task 11.
- Frontend (spec §Frontend) → Tasks 18–19; Task 17 covers `sources.ts`.
- CI/tooling (spec §CI and Tooling) → Tasks 13–16.
- Smoke verification → Task 20.

**Type consistency check:**
- `CodeRepository` fields (Task 3) align with `fetchCodeFiles` options (Task 6) and `codeFilesJob` usage (Task 7).
- `contentKind` string union is identical in `SearchDoc` (Task 8), loader (Task 9), API schema (Task 11), `PageData` (Task 12), `PageSearchResponse` (Task 18), and component (Task 19): `"issue" | "pr" | "discussion" | "code"`.
- `writePageFile` contract (Task 12) adds optional `contentKind`; existing callers in `fetchGithubPages.ts` (Task 12) supply it, other callers (`writeDocsPage`) are unaffected because it's optional.
- `embeddingKey` signature unchanged (Task 10); only internal behavior extended for `contentKind === "code"`.
