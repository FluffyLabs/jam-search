---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-json/validator-data.ts#L1-L15
title: packages/jam/state-json/validator-data.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 366929f6c8a0c1c9b3a0d07e65d4dad39dceb501537cf551391da315cfd0f40e
language: typescript
---
`packages/jam/state-json/validator-data.ts` (lines 1–15)

```typescript
import { fromJson } from "@typeberry/block-json";
import { Bytes } from "@typeberry/bytes";
import { BLS_KEY_BYTES } from "@typeberry/crypto";
import { json } from "@typeberry/json-parser";
import { VALIDATOR_META_BYTES, ValidatorData } from "@typeberry/state";

export const validatorDataFromJson = json.object<ValidatorData>(
  {
    ed25519: fromJson.bytes32(),
    bandersnatch: fromJson.bytes32(),
    bls: json.fromString((v) => Bytes.parseBytes(v, BLS_KEY_BYTES).asOpaque()),
    metadata: json.fromString((v) => Bytes.parseBytes(v, VALIDATOR_META_BYTES)),
  },
  ({ ed25519, bandersnatch, bls, metadata }) => ValidatorData.create({ bandersnatch, ed25519, bls, metadata }),
);
```
