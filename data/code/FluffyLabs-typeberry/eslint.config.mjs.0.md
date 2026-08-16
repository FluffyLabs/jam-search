---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/eslint.config.mjs#L1-L36'
title: eslint.config.mjs
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: cbb255f3dc51e7cae5a010cc595345a853d0a9530b2cf4b23e16af889e64ecbb
language: javascript
---
`eslint.config.mjs` (lines 1–36)

```javascript
// @ts-check

import * as pluginImport from "eslint-plugin-import";
import tseslint from "typescript-eslint";

const baseImport = pluginImport.flatConfigs?.recommended;

export default tseslint.config(
  tseslint.configs.base,
  { plugins: baseImport.plugins },
  {
    ignores: [".context/**", "dist/**", "docs/**", "packages/misc/builder/pkg.ts", "./web/docs/**"],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "no-unused-expressions": ["error", { allowTaggedTemplates: true }],
      "import/no-extraneous-dependencies": "error",
      "@typescript-eslint/strict-boolean-expressions": [
        "error",
        {
          allowNullableObject: false,
          allowNullableNumber: false,
          allowString: false,
        },
      ],
      "import/no-relative-packages": "error",
    },
  },
);
```
