import path from "node:path";

const EXT_ALLOWLIST = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".rs",
  ".toml",
  ".json",
  ".md",
  ".mdx",
  ".yml",
  ".yaml",
  ".go",
  ".py",
  ".sh",
  ".cpp",
  ".cc",
  ".hpp",
  ".h",
  ".c",
]);

const DIR_BLOCKLIST = new Set([
  "node_modules",
  "target",
  "dist",
  "build",
  ".git",
  ".next",
  "out",
  "coverage",
  "vendor",
]);

const FILENAME_BLOCKLIST = new Set([
  "package-lock.json",
  "Cargo.lock",
  "yarn.lock",
  "pnpm-lock.yaml",
]);

const LANGUAGE_MAP: Record<string, string> = {
  ".ts": "typescript",
  ".tsx": "typescript",
  ".js": "javascript",
  ".jsx": "javascript",
  ".mjs": "javascript",
  ".cjs": "javascript",
  ".rs": "rust",
  ".py": "python",
  ".go": "go",
  ".sh": "bash",
  ".toml": "toml",
  ".json": "json",
  ".yml": "yaml",
  ".yaml": "yaml",
  ".md": "markdown",
  ".mdx": "markdown",
  ".cpp": "cpp",
  ".cc": "cpp",
  ".hpp": "cpp",
  ".h": "cpp",
  ".c": "cpp",
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

export function languageFor(relativePath: string): string | undefined {
  const ext = path.extname(relativePath).toLowerCase();
  return LANGUAGE_MAP[ext];
}

export function isBinary(buf: Buffer): boolean {
  const slice = buf.subarray(0, Math.min(buf.length, 8192));
  return slice.includes(0);
}
