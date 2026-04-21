# Custom Code Sources — Design

Date: 2026-04-20
Status: Approved (pending implementation plan)

## Goal

Add three GitHub repositories as first-class sources in JAM Search, indexing both:

1. Issues / pull requests / discussions (existing pipeline).
2. Source code files from the default branch (new pipeline).

Target repositories:

- `https://github.com/fluffylabs/typeberry`
- `https://github.com/tomusdrw/as-lan`
- `https://github.com/tomusdrw/anan-as`

## Non-Goals

- AST-aware / symbol-aware chunking.
- Indexing non-default branches, tags, or commit history.
- A new top-level "Code" results section in the UI — code chunks surface inside the existing per-repo GitHub section.
- Filter UI for `contentKind` or `language` in v1; query params only.

## Sources and Configuration

### `shared/sources.ts`

Add three enum entries:

```ts
GithubFluffyLabsTypeberry = "GithubFluffyLabsTypeberry",
GithubTomusdrwAsLan = "GithubTomusdrwAsLan",
GithubTomusdrwAnanAs = "GithubTomusdrwAnanAs",
```

### `shared/github.ts`

Extend the existing `Repository` type with three optional per-repo flags, and append three new entries. A single consolidated list drives both the issues/PRs/discussions job and the new code job, filtered by flag — this replaces the original design's plan to keep a separate `CODE_REPOSITORIES` list.

```ts
export type Repository = {
  source: Source;
  dbId: string;
  owner: string;
  repo: string;
  /** Index issues, pull requests, and discussions. Default: true. */
  indexIssues?: boolean;
  /** Clone and index source code files. Default: false. */
  indexCode?: boolean;
  /** Override default branch for code indexing (auto-detected if omitted). */
  defaultBranch?: string;
};
```

Existing repos keep their current shape (both flags defaulting as above). The three new repos opt into code indexing:

```ts
{
  source: Source.GithubFluffyLabsTypeberry,
  dbId: "github.com/FluffyLabs/typeberry",
  owner: "FluffyLabs",
  repo: "typeberry",
  indexCode: true,
},
// plus tomusdrw/as-lan and tomusdrw/anan-as with the same flag
```

- The GitHub pages job iterates `REPOSITORIES` and skips entries where `indexIssues === false`.
- The code job iterates `REPOSITORIES` and skips entries where `!indexCode`.
- `defaultBranch` is left undefined; `fetchCodeFiles` auto-detects via `git symbolic-ref`.

### `client/src/lib/sources.ts`

- Add three entries to `SOURCE_OPTIONS`, labels: `github.com/fluffylabs/typeberry`, `github.com/tomusdrw/as-lan`, `github.com/tomusdrw/anan-as`.
- Add all three to `initialSources` so the checkboxes are on by default.

## Code Ingestion Pipeline

### `backend/src/scripts/fetchCodeFiles.ts` (new)

Per-repo flow:

1. Create an OS temp directory.
2. `git clone --depth 1 <url> <tmpDir>`. If `GITHUB_TOKEN` is set, rewrite URL as `https://x-access-token:$GITHUB_TOKEN@github.com/<owner>/<repo>.git` to improve rate limits on the clone.
3. Resolve the default branch by parsing `git symbolic-ref refs/remotes/origin/HEAD` (returns e.g. `refs/remotes/origin/main`). If the `Repository.defaultBranch` override is present, use that instead. If both fail, throw a descriptive error telling the operator to set `defaultBranch` explicitly in `REPOSITORIES` — we deliberately do NOT guess `main`/`master`, because a silent default would ship broken `#L` URLs for any repo whose default branch is something else.
4. Capture the HEAD commit date (`git log -1 --format=%cI`) for `created_at` / `last_modified`. Same date is written to every chunk from a given run — per-file commit dates would need extra `git log` invocations per file and are not worth the indexing cost for v1.
5. Recursively walk the tree applying filters (see below). Directories in the blocklist are pruned at walk time, not just per-file, to avoid scanning large build artifacts.
6. For each surviving file: split into line-based chunks. Greedy algorithm: append whole lines to the current chunk until adding the next line would push the chunk past 4000 characters, emit the chunk, then start the next chunk by re-including the trailing ~200 characters' worth of whole lines from the previous chunk as overlap. Never split in the middle of a line. If a single line exceeds 4000 characters, emit it as its own chunk untouched — even if that single line exceeds 20000 characters. The full chunk text is stored in the markdown body (so full-text search covers it), and the embedding for that chunk is generated from the first 20000 characters, matching existing `embeddingText` behaviour in `embeddings.ts`.
7. For each chunk compute `sha256(utf8_bytes(chunk_text))`, encoded as lowercase hex — matches `createHash("sha256").update(s, "utf-8").digest("hex")` in Node.
8. Write one markdown file per chunk to `data/code/<owner>-<repo>/<path>.<chunkIdx>.md` (path directories created as needed).
9. Remove the temp clone.

### File Filters

**Directory blocklist** (prefix match on repo-relative path):

```
node_modules, target, dist, build, .git, .next, out, coverage, vendor
```

**Filename blocklist:**

```
package-lock.json, Cargo.lock, yarn.lock, pnpm-lock.yaml
```

**Extension allowlist (case-insensitive):**

```
.ts .tsx .js .jsx .mjs .cjs .rs .toml .json .md .mdx .yml .yaml
.go .py .sh .cpp .h .hpp .c .cc
```

**Size cap:** skip files larger than 200 KB.

**Binary detection:** read the first 8 KB; skip if a `0x00` byte is present.

### Chunk Frontmatter

Each generated markdown file uses:

```yaml
---
type: page
content_kind: code
url: https://github.com/<owner>/<repo>/blob/<defaultBranch>/<path>#L<startLine>-L<endLine>
title: <path-relative-to-repo>
site: github.com/<owner>/<repo>
created_at: <head-commit-iso>
last_modified: <head-commit-iso>
chunk_index: N
chunk_total: M
content_sha: <sha256-of-chunk-body>
language: <resolved-from-extension>
---
```

The body of the markdown is:

```
`<path>` (lines <start>–<end>)

```<language>
<chunk contents>
```
```

The one-line header gives full-text search a hit on the path, and the fenced block keeps the chunk content tokenised as code.

### Language Resolution

Map extension → language slug used for the `language` field and the fenced code block info string:

- `.ts/.tsx` → `typescript`, `.js/.jsx/.mjs/.cjs` → `javascript`, `.rs` → `rust`, `.py` → `python`, `.go` → `go`, `.sh` → `bash`, `.toml` → `toml`, `.json` → `json`, `.yml/.yaml` → `yaml`, `.md/.mdx` → `markdown`, `.cpp/.cc/.hpp/.h/.c` → `cpp`.

### Wipe-and-Rewrite

At the start of each repo's processing, delete `data/code/<owner>-<repo>/` before writing new chunks. This handles renames and deletions cleanly. If a repo's processing throws, the job skips to the next repo (same pattern as `githubPagesJob.ts`) and re-throws at the end.

### `backend/src/jobs/codeFilesJob.ts` (new)

Iterates `CODE_REPOSITORIES`, calls `fetchCodeFiles` for each, aggregates errors, exits non-zero if any failed. Structured to match `githubPagesJob.ts`.

## Schema, Loader, and Embeddings

### `backend/src/data/searchIndex.ts`

Extend `SCHEMA`:

```ts
contentKind: "enum",
language: "enum",
```

Extend `SearchDoc`:

```ts
contentKind?: "issue" | "pr" | "discussion" | "code";
language?: string;
```

### `backend/src/data/loader.ts`

`loadPageFile` reads `content_kind` → `contentKind` and `language` → `language` from frontmatter.

### `backend/src/scripts/fetchGithubPages.ts`

`storeContentInMarkdown` emits `content_kind: "issue" | "pr" | "discussion"` into the frontmatter so the field is populated consistently for all GitHub pages, not just code chunks.

### `backend/src/data/embeddings.ts`

Extend `embeddingKey`: for code chunks (detected by `contentKind === "code"`), key on `filePath:content_sha` pulled from frontmatter. Content hash in the key means unchanged chunks re-use cached embeddings across wipe-and-rewrite runs, keeping OpenAI costs low.

## Search API

### `backend/src/api/searchPages.ts`

Add two optional query params to `searchPagesRequestSchema`:

```ts
contentKind: z.string().optional(),
language: z.string().optional(),
```

Apply them to the `where` clause when present. Response items gain:

```ts
contentKind: hit.document.contentKind,
language: hit.document.language,
```

## Frontend

### `client/src/components/PageResultCards`

Branch on `contentKind === "code"`:

- Title renders as `<code>{path}</code>` plus a small language badge (`typescript`, `rust`, …).
- Snippet renders inside a monospaced block with soft wrap; no markdown parsing for the fenced content so code stays verbatim.
- Existing issue/PR/discussion rendering unchanged.

### `client/src/pages/results.tsx`

No structural changes. The new repos appear in the existing GitHub repo sections automatically via the shared `REPOSITORIES` list, and code chunks mix into those sections since they share `site: github.com/<owner>/<repo>`.

## CI and Tooling

### `.github/workflows/index-code.yml` (new)

- Triggers: `workflow_dispatch` and `schedule: cron: '0 5 * * 0'` (weekly, Sunday 05:00 UTC).
- Checkout with `GH_INDEX_TOKEN`, setup Node from `.nvmrc`, install deps.
- `npm exec tsx -w backend -- ./src/jobs/codeFilesJob.ts` with env `GITHUB_TOKEN`, `DATA_DIR=./data`.
- `./.github/actions/commit-data` with message `"index: update code files"`.

Git is preinstalled on `ubuntu-latest`; no extra setup needed.

### `backend/package.json`

Add script:

```json
"fetch-code": "tsx src/jobs/codeFilesJob.ts"
```

### `README.md`

- Add `[![Index: Code](...index-code.yml/badge.svg)](...)` to the badge row.
- Add `npm run fetch-code  # Index source code from configured repos` to the Data Indexing section.

## Data Layout Summary

```
data/
  code/
    fluffylabs-typeberry/
      src/
        foo.ts.0.md
        foo.ts.1.md
        ...
    tomusdrw-as-lan/
      ...
    tomusdrw-anan-as/
      ...
  pages/
    github/
      fluffylabs-typeberry/
        pr-1.md
        issue-2.md
        ...
      ...
```

Each `.md` file carries the same `type: page` frontmatter so the existing loader consumes both pipelines without branching.

## Risks / Edge Cases

- **Large repos.** typeberry may produce many thousands of chunks. Embedding cache keyed by content SHA absorbs the cost after the first full run; daily incremental cost stays small.
- **Repo unavailable / 404.** Per-repo error isolation in the job: one failure doesn't block the others.
- **Default branch renames.** Auto-detect each run, so renames are picked up automatically on the next index.
- **URL stability.** URLs point to `blob/<defaultBranch>/<path>#Lstart-Lend`. If a file is moved, the URL 404s until the next index run — acceptable for a weekly cadence, and the chunk content stays searchable in the meantime.
- **Binary/minified files that slip the allowlist.** A `.json` minified blob can still be huge; the 200 KB size cap bounds blast radius.

## Out-of-Scope Follow-Ups

- Per-file-type weighting in search ranking.
- Syntax highlighting in the UI (would need a highlighter library).
- Symbol search (`func Foo`, `class Bar`).
- A dedicated `code` `DocType` split from `page` if the data later demands distinct storage semantics.
