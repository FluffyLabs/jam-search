---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/portable/tsconfig.json#L1-L20'
title: portable/tsconfig.json
site: github.com/tomusdrw/anan-as
created_at: '2026-04-27T09:49:56+01:00'
last_modified: '2026-04-27T09:49:56+01:00'
chunk_index: 0
chunk_total: 1
content_sha: cd717f9e780eec2cf1e635e01b733746f15e48e632f75847b7953c464f0a9692
language: json
---
`portable/tsconfig.json` (lines 1–20)

```json
{
  "include": ["./index.ts", "./types/**/*.d.ts"],
  "compilerOptions": {
    "experimentalDecorators": true,
    "module": "ESNext",
    "target": "ES2020",
    "moduleResolution": "bundler",
    "rootDir": "..",
    "outDir": "../dist/build/js",
    "declaration": true,
    "lib": ["ES2020", "DOM"],
    "skipLibCheck": true,
    "strict": false,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "noImplicitThis": false,
    "noUnusedLocals": false,
    "noUnusedParameters": false
  }
}
```
