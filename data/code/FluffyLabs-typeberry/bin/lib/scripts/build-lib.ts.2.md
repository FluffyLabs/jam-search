---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/lib/scripts/build-lib.ts#L210-L331
title: bin/lib/scripts/build-lib.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 2
chunk_total: 5
content_sha: 264f0dc67d31e700d3dfb1ea5354243a2a9c0f48288fdf12734988d3f21e2353
language: typescript
---
`bin/lib/scripts/build-lib.ts` (lines 210–331)

```typescript
    if (packageMap[packageName] !== undefined && packageMap[packageName] !== "") {
      modified = true;
      // Prepend # to the import path
      const newImportPath = `#${importPath}`;
      return `${prefix}${newImportPath}${suffix}`;
    }

    // External package - leave unchanged
    return match;
  });

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✓ Rewrote imports in ${path.relative(DIST_DIR, filePath)}`);
  }
}

/**
 * Recursively process all JS and DTS files in a directory
 *
 * Walks the directory tree and rewrites imports in all .js and .d.ts files.
 *
 * @param dir - Directory to process
 * @param packageMap - Map of package names to their workspace paths
 */
function processDirectory(dir: string, packageMap: Record<string, string>): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      processDirectory(fullPath, packageMap);
    } else if (entry.isFile() && (entry.name.endsWith(".js") || entry.name.endsWith(".d.ts"))) {
      rewriteImports(fullPath, packageMap);
    }
  }
}

/**
 * Build the "imports" field for package.json
 *
 * Creates mappings from #<package-name>/* to the actual package locations in dist/lib/.
 * Each package gets two entries:
 * - Direct import: "#@typeberry/bytes" → "./packages/core/bytes/index.js"
 * - Subpath import: "#@typeberry/bytes/*" → "./packages/core/bytes/*"
 *
 * @param packageMap - Map of package names to their workspace paths
 * @returns The imports field object for package.json
 *
 * @example
 * {
 *   "#@typeberry/bytes": "./packages/core/bytes/index.js",
 *   "#@typeberry/bytes/*": "./packages/core/bytes/*",
 *   "#@typeberry/codec": "./packages/core/codec/index.js",
 *   "#@typeberry/codec/*": "./packages/core/codec/*"
 * }
 */
function buildImportsField(packageMap: Record<string, string>): Record<string, string> {
  const imports: Record<string, string> = {};

  for (const [packageName, packagePath] of Object.entries(packageMap)) {
    // Prepend # to package name
    const internalName = `#${packageName}`;

    // Direct import (e.g., import from "#@typeberry/bytes")
    imports[internalName] = `./${packagePath}/index.js`;

    // Subpath imports (e.g., import from "#@typeberry/bytes/something.js")
    imports[`${internalName}/*`] = `./${packagePath}/*`;
  }

  return imports;
}

/**
 * Create and fix the package.json at dist/lib
 *
 * Transforms the source package.json from bin/lib/ into a distribution-ready format:
 * - Updates entry points to use ./bin/lib/ prefix
 * - Adds TypeScript type declarations to exports
 * - Removes workspace dependencies
 * - Adds "imports" field to resolve #<package-name>/* references
 *
 * The resulting package.json uses the "exports" format with separate
 * type and default exports for each module, and an "imports" field for
 * internal package resolution.
 *
 * @param packageMap - Map of package names to their workspace paths
 *
 * @example
 * // Input exports (from bin/lib/package.json):
 * {
 *   "./bytes": "./exports/bytes.js"
 * }
 *
 * // Output exports (in dist/lib/package.json):
 * {
 *   "./bytes": {
 *     "types": "./bin/lib/exports/bytes.d.ts",
 *     "default": "./bin/lib/exports/bytes.js"
 *   }
 * }
 *
 * // Output imports:
 * {
 *   "imports": {
 *     "#@typeberry/bytes": "./packages/core/bytes/index.js",
 *     "#@typeberry/bytes/*": "./packages/core/bytes/*",
 *     ...
 *   }
 * }
 */
function createDistPackageJson(packageMap: Record<string, string>): void {
  const sourcePackageJsonPath = path.join(ROOT_DIR, "bin/lib/package.json");
  const targetPackageJsonPath = path.join(DIST_DIR, "package.json");

  const sourcePackageJson = JSON.parse(fs.readFileSync(sourcePackageJsonPath, "utf-8"));

  // Filter out workspace dependencies
  const filteredDeps = Object.entries(sourcePackageJson.dependencies).filter(([_key, version]) => version !== "*");

```
