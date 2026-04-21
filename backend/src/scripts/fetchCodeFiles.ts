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

function redactToken(error: unknown, token: string | undefined): unknown {
  if (!token || !(error instanceof Error)) return error;
  error.message = error.message.replaceAll(token, "***");
  const maybeStderr = (error as { stderr?: unknown }).stderr;
  if (typeof maybeStderr === "string") {
    (error as unknown as { stderr: string }).stderr = maybeStderr.replaceAll(token, "***");
  } else if (Buffer.isBuffer(maybeStderr)) {
    (error as unknown as { stderr: Buffer }).stderr = Buffer.from(
      maybeStderr.toString("utf-8").replaceAll(token, "***"),
      "utf-8",
    );
  }
  return error;
}

function detectDefaultBranch(repoDir: string): string {
  try {
    const ref = run("git", ["symbolic-ref", "refs/remotes/origin/HEAD"], repoDir);
    return ref.replace(/^refs\/remotes\/origin\//, "");
  } catch {
    throw new Error(
      `Could not detect default branch in ${repoDir}. Set defaultBranch explicitly in CODE_REPOSITORIES.`,
    );
  }
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

function encodePathForUrl(relPath: string): string {
  return relPath.split("/").map(encodeURIComponent).join("/");
}

function sha256Hex(s: string): string {
  return createHash("sha256").update(s, "utf-8").digest("hex");
}

export async function fetchCodeFiles(opts: FetchCodeOptions): Promise<number> {
  const { owner, repo, dataDir, githubToken } = opts;
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), `jam-code-${owner}-${repo}-`));
  const clonePath = path.join(tmpRoot, "repo");

  try {
    try {
      run("git", ["clone", "--depth", "1", cloneUrl(owner, repo, githubToken), clonePath]);
    } catch (e) {
      throw redactToken(e, githubToken);
    }

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
        const url = `https://github.com/${owner}/${repo}/blob/${defaultBranch}/${encodePathForUrl(relPath)}#L${chunk.startLine}-L${chunk.endLine}`;
        const body = [
          "`" + relPath + "` (lines " + chunk.startLine + "–" + chunk.endLine + ")",
          "",
          "```" + (language ?? ""),
          chunk.text.endsWith("\n") ? chunk.text.slice(0, -1) : chunk.text,
          "```",
          "",
        ].join("\n");

        const frontmatter: Record<string, unknown> = {
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
        };
        if (language) frontmatter.language = language;

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
