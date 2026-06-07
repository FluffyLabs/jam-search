---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/lib/scripts/build-lib.ts#L1-L114
title: bin/lib/scripts/build-lib.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 5
content_sha: 94150d32da534f3bb93f0356b5896ae78de604c165afe23f8673a2d8cba34de4
language: typescript
---
`bin/lib/scripts/build-lib.ts` (lines 1–114)

```typescript
#!/usr/bin/env tsx

/**
 * @typeberry/lib Build Script
 *
 * This script post-processes the TypeScript compilation output to create a distributable
 * package using package.json "imports" field for internal package resolution.
 *
 * ## Build Process Overview
 *
 * 1. **TypeScript Compilation**
 *    - First, `tsc` compiles all TypeScript files to JavaScript in `dist/lib/`
 *    - This produces .js, .d.ts, and .d.ts.map files
 *    - Imports remain as workspace references (e.g., `@typeberry/bytes`)
 *
 * 2. **Package Discovery**
 *    - Reads the root package.json to discover all workspace packages
 *    - Builds a map of package names to their filesystem paths
 *    - Example: `@typeberry/bytes` → `packages/core/bytes`
 *
 * 3. **Import Rewriting**
 *    - Recursively processes all .js and .d.ts files in dist/lib/
 *    - Converts workspace imports to internal imports by prepending #:
 *      - `@typeberry/bytes` → `#@typeberry/bytes`
 *      - `@typeberry/pvm-interpreter/ops/math-consts.js` → `#@typeberry/pvm-interpreter/ops/math-consts.js`
 *    - Preserves subpaths in imports (e.g., package/submodule)
 *
 * 4. **Package.json Generation**
 *    - Copies bin/lib/package.json and transforms it for distribution:
 *      - Updates `main` and `types` to point to `./bin/lib/index.js` and `./bin/lib/index.d.ts`
 *      - Transforms `exports` to include both types and default fields
 *      - Removes workspace dependencies
 *      - Adds `imports` field to map `#<package-name>/*` to actual package locations
 *
 * 5. **Distribution Files**
 *    - Copies README.md to dist/lib/
 *    - Copies .npmignore to dist/lib/
 *
 * ## Why Package.json Imports?
 *
 * The compiled package uses the "imports" field because:
 * - It provides a clean, maintainable way to handle internal package references
 * - No need for complex relative path calculations
 * - Node.js natively resolves these imports
 * - Easier to understand and debug
 *
 * ## Output Structure
 *
 * ```
 * dist/lib/
 * ├── package.json       (with "imports" field mapping #<package-name>/* to paths)
 * ├── README.md          (copied from bin/lib/)
 * ├── .npmignore         (copied from bin/lib/)
 * ├── bin/lib/           (compiled @typeberry/lib entry points)
 * │   ├── index.js
 * │   ├── index.d.ts
 * │   └── exports/       (re-export files with # prefixed imports)
 * └── packages/          (all compiled workspace packages)
 *     ├── core/
 *     ├── jam/
 *     └── workers/
 * ```
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, "../../..");
const DIST_DIR = path.resolve(ROOT_DIR, "dist/lib");

interface PackageJson {
  name?: string;
  version?: string;
  workspaces?: string[];
}

/**
 * Get the version string for the package
 *
 * If the VERSION_SHA environment variable is set (e.g. CI builds), appends it to
 * the base version to create a unique, non-release version. Otherwise (release
 * behavior) the base version from package.json is used as-is.
 *
 * @param baseVersion - The base version from package.json
 * @returns The version string to use for publishing
 *
 * @example
 * // When VERSION_SHA=abc1234
 * getVersion("0.5.1") // Returns "0.5.1-abc1234"
 *
 * // When VERSION_SHA is not set
 * getVersion("0.5.1") // Returns "0.5.1"
 */
function getVersion(baseVersion: string): string {
  const versionSha = process.env.VERSION_SHA;

  if (versionSha === undefined || versionSha === "") {
    return baseVersion;
  }

  return `${baseVersion}-${versionSha}`;
}

/**
 * Build a map of package names to their workspace paths
 *
 * Reads the root package.json and discovers all workspace packages by reading each
 * workspace's package.json file. This creates a mapping used for import rewriting.
 *
 * @returns A map from package names (e.g., "@typeberry/bytes") to workspace paths
```
