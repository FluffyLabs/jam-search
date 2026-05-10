---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/lib/scripts/build-lib.ts#L431-L459
title: bin/lib/scripts/build-lib.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 4
chunk_total: 5
content_sha: ef9b4a21c4afb6cc592dd67b2d824f1173b396cac24bc547cb8b86c06a581fe4
language: typescript
---
`bin/lib/scripts/build-lib.ts` (lines 431–459)

```typescript
// 1. Discover all workspace packages by reading package.json files
// 2. Rewrite all workspace package imports to #<package-name>/* in .js and .d.ts files
// 3. Create a distribution package.json with "imports" field for resolution
// 4. Copy README.md and .npmignore for npm publishing

console.log("Building package map from workspace configuration...");
const packageMap = buildPackageMap();
console.log(`Found ${Object.keys(packageMap).length} packages in workspace`);

console.log("\nRewriting workspace imports to internal imports...");
console.log(`Processing: ${DIST_DIR}`);

if (!fs.existsSync(DIST_DIR)) {
  // biome-ignore lint/suspicious/noConsole: Build script requires console output
  console.error(`Error: Directory not found: ${DIST_DIR}`);
  // biome-ignore lint/suspicious/noConsole: Build script requires console output
  console.error("Please run TypeScript compilation (tsc) first.");
  process.exit(1);
}

processDirectory(DIST_DIR, packageMap);

console.log("\nCreating distribution package.json with imports field...");
createDistPackageJson(packageMap);

console.log("\nCopying distribution files...");
copyDistributionFiles();

console.log("\n✓ Build complete!");
```
