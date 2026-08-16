---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/tsconfig.json#L1-L16'
title: tsconfig.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 8a6f1edb90b1a3f80c5ab0bbd09b87d533fe89c34bf643b0cde878968418af90
language: json
---
`tsconfig.json` (lines 1–16)

```json
{
  "compilerOptions": {
    "rootDir": ".",
    "strict": true,
    "module": "NodeNext",
    "moduleResolution": "nodenext",
    "target": "es2023",
    "outDir": "dist/",
    "noEmit": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true
  },
  "extends": "@tsconfig/node24/tsconfig.json",
  "exclude": ["dist", "node_modules"]
}
```
