---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/web/bump-version.ts#L1-L10'
title: web/bump-version.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-05-15T10:20:08+02:00'
last_modified: '2026-05-15T10:20:08+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 5f6085e38ceec8f6bfafa37cde8d2e292c3e109085db700a72ef525daeec05b1
language: typescript
---
`web/bump-version.ts` (lines 1–10)

```typescript
import fs from 'node:fs';

const META_FILE = './web/pvm-metadata.json';
const metadata = JSON.parse(fs.readFileSync(META_FILE, 'utf-8')) as { version: string };
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8')) as { version: string };
const hash = process.argv[2] || 'xxxxxx';

metadata.version = `${packageJson.version}-${hash.substring(0, 6)}`;

fs.writeFileSync(META_FILE, JSON.stringify(metadata, null, 2));
```
