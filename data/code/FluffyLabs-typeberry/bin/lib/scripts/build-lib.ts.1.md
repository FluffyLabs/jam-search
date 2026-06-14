---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/lib/scripts/build-lib.ts#L111-L216
title: bin/lib/scripts/build-lib.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 1
chunk_total: 5
content_sha: 7bcbaeaa00f7b63f64f5cb7c91e3b93b37b9270b24297d61526d739b6732da38
language: typescript
---
`bin/lib/scripts/build-lib.ts` (lines 111–216)

```typescript
 * Reads the root package.json and discovers all workspace packages by reading each
 * workspace's package.json file. This creates a mapping used for import rewriting.
 *
 * @returns A map from package names (e.g., "@typeberry/bytes") to workspace paths
 *          (e.g., "packages/core/bytes")
 *
 * @example
 * {
 *   "@typeberry/bytes": "packages/core/bytes",
 *   "@typeberry/codec": "packages/core/codec",
 *   ...
 * }
 */
function buildPackageMap(): Record<string, string> {
  const rootPackageJsonPath = path.join(ROOT_DIR, "package.json");
  const rootPackageJson: PackageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, "utf-8"));

  if (rootPackageJson.workspaces === undefined || rootPackageJson.workspaces === null) {
    throw new Error("No workspaces found in root package.json");
  }

  const packageMap: Record<string, string> = {};

  for (const workspacePath of rootPackageJson.workspaces) {
    const packageJsonPath = path.join(ROOT_DIR, workspacePath, "package.json");

    if (!fs.existsSync(packageJsonPath)) {
      // biome-ignore lint/suspicious/noConsole: Build script requires console output
      console.warn(`Warning: No package.json found at ${workspacePath}`);
      continue;
    }

    const packageJson: PackageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    if (packageJson.name !== undefined && packageJson.name !== null && packageJson.name !== "") {
      packageMap[packageJson.name] = workspacePath;
    }
  }

  return packageMap;
}

/**
 * Extract package name from an import path
 *
 * Handles both scoped and non-scoped packages:
 * - Scoped: "@typeberry/bytes" → "@typeberry/bytes"
 * - Scoped with subpath: "@typeberry/bytes/something.js" → "@typeberry/bytes"
 * - Non-scoped: "lodash" → "lodash"
 * - Non-scoped with subpath: "lodash/map.js" → "lodash"
 *
 * @param importPath - The import path to extract from
 * @returns The package name
 */
function extractPackageName(importPath: string): string {
  if (importPath.startsWith("@")) {
    // Scoped package: take first two segments (@scope/name)
    const match = importPath.match(/^(@[^/]+\/[^/]+)/);
    return match !== null ? match[1] : importPath;
  }
  // Non-scoped package: take first segment
  const match = importPath.match(/^([^/]+)/);
  return match !== null ? match[1] : importPath;
}

/**
 * Rewrite imports in a JavaScript or TypeScript declaration file
 *
 * Searches for all import/export statements and checks if they reference
 * packages in the package map. If so, rewrites them to use # prefix
 * which is resolved via package.json "imports" field.
 *
 * Handles both import and export statements:
 * - `import { X } from "@typeberry/bytes"` → `import { X } from "#@typeberry/bytes"`
 * - `export * from "@typeberry/codec"` → `export * from "#@typeberry/codec"`
 *
 * External packages not in the package map are left unchanged.
 *
 * @param filePath - Absolute path to the file to process
 * @param packageMap - Map of package names to their workspace paths
 */
function rewriteImports(filePath: string, packageMap: Record<string, string>): void {
  let content = fs.readFileSync(filePath, "utf-8");
  let modified = false;

  // Match: import ... from "...";
  // Match: export ... from "...";
  const importRegex = /((?:import|export)\s+(?:[\s\S]*?)\s+from\s+["'])([^"']+)(["'])/g;

  content = content.replace(importRegex, (match, prefix, importPath, suffix) => {
    // Skip relative imports
    if (typeof importPath === "string" && importPath.startsWith(".")) {
      return match;
    }

    // Extract the package name from the import path
    const packageName = extractPackageName(importPath);

    // Only rewrite if this package is in our workspace
    if (packageMap[packageName] !== undefined && packageMap[packageName] !== "") {
      modified = true;
      // Prepend # to the import path
      const newImportPath = `#${importPath}`;
      return `${prefix}${newImportPath}${suffix}`;
    }

```
