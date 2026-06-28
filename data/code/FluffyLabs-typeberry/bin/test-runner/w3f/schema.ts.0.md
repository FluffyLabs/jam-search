---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/w3f/schema.ts#L1-L26
title: bin/test-runner/w3f/schema.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: cadb893f39a2b0c11c2eeed2b7478cc8d213d3dc87dee081df754ca51b7402c7
language: typescript
---
`bin/test-runner/w3f/schema.ts` (lines 1–26)

```typescript
import { type FromJson, json } from "@typeberry/json-parser";

export class JsonSchema {
  static fromJson: FromJson<JsonSchema> = {
    $schema: "string",
    type: "string",
    title: json.optional("string"),
    description: json.optional("string"),
    properties: json.fromAny(() => null),
    required: json.optional<string[]>(json.array("string")),
    additionalProperties: "boolean",
    $defs: json.optional(json.fromAny(() => null)),
  };
  $schema!: string;
  type!: string;
  title?: string;
  description?: string;
  properties!: unknown;
  required?: string[];
  additionalProperties!: boolean;
  $defs?: unknown;
}

export async function ignoreSchemaFiles(_testContent: JsonSchema) {
  // ignore schema files
}
```
