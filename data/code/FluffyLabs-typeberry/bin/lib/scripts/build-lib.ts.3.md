---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/lib/scripts/build-lib.ts#L327-L436
title: bin/lib/scripts/build-lib.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 3
chunk_total: 5
content_sha: 845f01cdc2f1f1d10583fd3e16213833f86fcb8711d7bb32080b4608686dd7d6
language: typescript
---
`bin/lib/scripts/build-lib.ts` (lines 327–436)

```typescript
  const sourcePackageJson = JSON.parse(fs.readFileSync(sourcePackageJsonPath, "utf-8"));

  // Filter out workspace dependencies
  const filteredDeps = Object.entries(sourcePackageJson.dependencies).filter(([_key, version]) => version !== "*");

  // Create the new package.json structure
  const distPackageJson: {
    name: string;
    version: string;
    description: string;
    main: string;
    types: string;
    type: string;
    exports: Record<string, unknown>;
    imports: Record<string, string>;
    dependencies: Record<string, unknown>;
    repository: { type: string; url: string };
    author: string;
    license: string;
  } = {
    name: sourcePackageJson.name,
    version: getVersion(sourcePackageJson.version),
    description: sourcePackageJson.description,
    main: "./bin/lib/index.js",
    types: "./bin/lib/index.d.ts",
    type: sourcePackageJson.type,
    exports: {},
    imports: buildImportsField(packageMap),
    dependencies: Object.fromEntries(filteredDeps),
    repository: sourcePackageJson.repository,
    author: sourcePackageJson.author,
    license: sourcePackageJson.license,
  };

  // Fix the exports paths to include bin/lib/ prefix and add types
  for (const [key, value] of Object.entries(sourcePackageJson.exports)) {
    if (typeof value === "string") {
      if (key === ".") {
        distPackageJson.exports[key] = {
          types: "./bin/lib/index.d.ts",
          default: "./bin/lib/index.js",
        };
      } else {
        // Convert path like "./exports/bytes.js" to "./bin/lib/exports/bytes.js"
        const jsPath = `./bin/lib${value.startsWith("./") ? value.slice(1) : value}`;
        // Replace .js with .d.ts for types
        const dtsPath = jsPath.replace(/\.js$/, ".d.ts");

        distPackageJson.exports[key] = {
          types: dtsPath,
          default: jsPath,
        };
      }
    }
  }

  // Write the new package.json
  fs.writeFileSync(targetPackageJsonPath, `${JSON.stringify(distPackageJson, null, 2)}\n`);
  console.log(`✓ Created ${path.relative(ROOT_DIR, targetPackageJsonPath)}`);
}

/**
 * Copy additional distribution files (README, .npmignore, etc.)
 *
 * Copies files needed for npm distribution from bin/lib/ to dist/lib/:
 * - README.md: Package documentation
 * - .npmignore: Files to exclude from npm publish
 *
 * Files are only copied if they exist in the source location. Missing files
 * are skipped without error.
 */
function copyDistributionFiles(): void {
  const binLibDir = path.join(ROOT_DIR, "bin/lib");

  // Copy README.md
  const readmeSrc = path.join(binLibDir, "README.md");
  const readmeDest = path.join(DIST_DIR, "README.md");
  if (fs.existsSync(readmeSrc)) {
    fs.copyFileSync(readmeSrc, readmeDest);
    console.log(`✓ Copied ${path.relative(ROOT_DIR, readmeDest)}`);
  }

  // Copy .npmignore if it exists
  const npmignoreSrc = path.join(binLibDir, ".npmignore");
  const npmignoreDest = path.join(DIST_DIR, ".npmignore");
  if (fs.existsSync(npmignoreSrc)) {
    fs.copyFileSync(npmignoreSrc, npmignoreDest);
    console.log(`✓ Copied ${path.relative(ROOT_DIR, npmignoreDest)}`);
  }
}

// ============================================================================
// Main Execution
// ============================================================================
//
// This script runs after TypeScript compilation (tsc) to post-process the
// output and create a distributable package.
//
// Prerequisites:
// - TypeScript must have already compiled the project to dist/lib/
// - The workspace must be properly configured in the root package.json
//
// Process:
// 1. Discover all workspace packages by reading package.json files
// 2. Rewrite all workspace package imports to #<package-name>/* in .js and .d.ts files
// 3. Create a distribution package.json with "imports" field for resolution
// 4. Copy README.md and .npmignore for npm publishing

console.log("Building package map from workspace configuration...");
const packageMap = buildPackageMap();
```
