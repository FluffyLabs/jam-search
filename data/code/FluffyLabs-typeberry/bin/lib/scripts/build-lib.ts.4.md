---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/lib/scripts/build-lib.ts#L432-L458
title: bin/lib/scripts/build-lib.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 4
chunk_total: 5
content_sha: 7e616d14bac0f1ba155ee1aed073e9ed08ffd0c53acebe9bcd1da2bebd870233
language: typescript
---
`bin/lib/scripts/build-lib.ts` (lines 432–458)

```typescript
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
