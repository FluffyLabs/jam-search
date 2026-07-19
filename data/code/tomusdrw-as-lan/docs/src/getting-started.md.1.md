---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/docs/src/getting-started.md#L92-L122
title: docs/src/getting-started.md
site: github.com/tomusdrw/as-lan
created_at: '2026-07-15T12:15:02+02:00'
last_modified: '2026-07-15T12:15:02+02:00'
chunk_index: 1
chunk_total: 2
content_sha: e328305d96c1ef9ac60f0ea6e4c1e1fe1e9c0cf5f4a3da33a37df4f504ca7ea0
language: markdown
---
`docs/src/getting-started.md` (lines 92–122)

```markdown
See the [Testing](./testing.md) guide for details on writing tests and configuring ecalli mocks.

## Manual Setup (without the script)

If you prefer to set things up yourself:

1. Add the SDK as a git submodule:
   ```bash
   git submodule add https://github.com/tomusdrw/as-lan.git sdk
   ```

2. Add dependencies to `package.json`:
   ```json
   {
     "devDependencies": {
       "@fluffylabs/as-lan": "file:./sdk",
       "assemblyscript": "^0.28.9",
       "ecalli": "file:./sdk/sdk-ecalli-mocks"
     }
   }
   ```

3. Build the ecalli mocks before first use:

   ```bash
   cd sdk/sdk-ecalli-mocks && npm install && npm run build && cd ../..
   ```

4. Follow the patterns in the scaffolded project for `assembly/index.ts`, `asconfig.json`, etc.

See the [SDK API](./sdk-api.md) reference for the full list of available types and utilities.
```
