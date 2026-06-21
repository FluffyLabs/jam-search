---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/tsconfig.json#L1-L26'
title: tsconfig.json
site: github.com/tomusdrw/anan-as
created_at: '2026-06-15T09:40:01+02:00'
last_modified: '2026-06-15T09:40:01+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 54965dfefd298adb0d2469f1818d69344b09dff39e9211b9e14c2691ced55ee7
language: json
---
`tsconfig.json` (lines 1–26)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022"],
    "types": ["node"],
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "outDir": "./dist",
    "rootDir": "."
  },
  "include": [
    "bin/**/*",
    "test/**/*",
    "web/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "assembly",
    "build",
    "web/build"
  ]
}
```
