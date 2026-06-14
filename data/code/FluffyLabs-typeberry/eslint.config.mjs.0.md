---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/eslint.config.mjs#L1-L36'
title: eslint.config.mjs
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: c4a1b8250a1c05fbbaaf2fd9ff0bbe4b97dfe8ea0e852034b8162a9c8c4efdfa
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
    ignores: ["dist/**", "packages/misc/builder/pkg.ts", "./web/docs/**"],
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
