---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/utils/dev.ts#L1-L28
title: packages/core/utils/dev.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: df0626b8264be6e059f9167c2ed9f4686ba7e1e742fba201c66d99651227789f
language: typescript
---
`packages/core/utils/dev.ts` (lines 1–28)

```typescript
import { env } from "./env.js";

/**
 * The function will produce relative path resolver that is adjusted
 * for package location within the workspace.
 *
 * Example:
 * $ npm start -w @typeberry/jam
 *
 * The above command will run `./bin/jam/index.js`, however we would
 * still want relative paths to be resolved according to top-level workspace
 * directory.
 *
 * So the caller, passes the absolute workspace path as argument and get's
 * a function that can properly resolve relative paths.
 *
 * NOTE: the translation happens only for development build! When
 * we build a single library from our project, we no longer mangle the paths.
 */
export const workspacePathFix =
  env.NODE_ENV === "development"
    ? (workspacePath: string) => (p: string) => {
        if (p.startsWith("/")) {
          return p;
        }
        return `${workspacePath}/${p}`;
      }
    : () => (p: string) => p;
```
