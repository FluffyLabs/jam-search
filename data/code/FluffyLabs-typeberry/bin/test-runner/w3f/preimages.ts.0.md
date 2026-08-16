---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/w3f/preimages.ts#L1-L152
title: bin/test-runner/w3f/preimages.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 2
content_sha: b574dc3130d05ead7dfeba42c744dd947b4a41e15bc091e39bd03dc936e6bba5
language: typescript
---
`bin/test-runner/w3f/preimages.ts` (lines 1–152)

```typescript
import { type TimeSlot, tryAsServiceGas, tryAsServiceId, tryAsTimeSlot } from "@typeberry/block";
import type { PreimageHash, PreimagesExtrinsic } from "@typeberry/block/preimage.js";
import { fromJson, preimagesExtrinsicFromJson } from "@typeberry/block-json";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { HashDictionary } from "@typeberry/collections";
import { tinyChainSpec } from "@typeberry/config";
import { Blake2b, HASH_SIZE, type OpaqueHash } from "@typeberry/hash";
import { type FromJson, json } from "@typeberry/json-parser";
import { tryAsU32, tryAsU64 } from "@typeberry/numbers";
import {
  InMemoryService,
  InMemoryState,
  LookupHistoryItem,
  PreimageItem,
  ServiceAccountInfo,
  tryAsLookupHistorySlots,
} from "@typeberry/state";
import { Preimages, type PreimagesErrorCode } from "@typeberry/transition";
import { Compatibility, deepEqual, GpVersion, OK, Result } from "@typeberry/utils";

class Input {
  static fromJson: FromJson<Input> = {
    preimages: preimagesExtrinsicFromJson,
    slot: "number",
  };

  preimages!: PreimagesExtrinsic;
  slot!: TimeSlot;
}

class TestPreimagesItem {
  static fromJson: FromJson<TestPreimagesItem> = {
    hash: fromJson.bytes32(),
    blob: json.fromString(BytesBlob.parseBlob),
  };

  hash!: OpaqueHash;
  blob!: BytesBlob;
}

class TestHistoryItem {
  static fromJson: FromJson<TestHistoryItem> = {
    key: {
      hash: fromJson.bytes32(),
      length: "number",
    },
    value: ["array", "number"],
  };
  key!: {
    hash: PreimageHash;
    length: number;
  };
  value!: number[];
}

type JsonTestAccountPre072 = {
  id: number;
  data: {
    preimages: TestPreimagesItem[];
    lookup_meta: TestHistoryItem[];
  };
};

type JsonTestAccount = {
  id: number;
  data: {
    preimage_blobs: TestPreimagesItem[];
    preimage_requests: TestHistoryItem[];
  };
};

const testAccountFromJson = Compatibility.isGreaterOrEqual(GpVersion.V0_7_2)
  ? json.object<JsonTestAccount, TestAccountsMapEntry>(
      {
        id: "number",
        data: {
          preimage_blobs: json.array(TestPreimagesItem.fromJson),
          preimage_requests: json.array(TestHistoryItem.fromJson),
        },
      },
      ({ data, id }) => TestAccountsMapEntry.create({ id, data }),
    )
  : json.object<JsonTestAccountPre072, TestAccountsMapEntry>(
      {
        id: "number",
        data: {
          preimages: json.array(TestPreimagesItem.fromJson),
          lookup_meta: json.array(TestHistoryItem.fromJson),
        },
      },
      ({ data, id }) =>
        TestAccountsMapEntry.create({
          id,
          data: { preimage_blobs: data.preimages, preimage_requests: data.lookup_meta },
        }),
    );

class TestAccountsMapEntry {
  static create({
    id,
    data,
  }: {
    id: number;
    data: { preimage_blobs: TestPreimagesItem[]; preimage_requests: TestHistoryItem[] };
  }): TestAccountsMapEntry {
    const entry = new TestAccountsMapEntry();
    entry.id = id;
    entry.data = data;
    return entry;
  }

  id!: number;
  data!: {
    preimage_blobs: TestPreimagesItem[];
    preimage_requests: TestHistoryItem[];
  };
}

class TestState {
  static fromJson: FromJson<TestState> = {
    accounts: json.array(testAccountFromJson),
  };
  accounts!: TestAccountsMapEntry[];
}

export class Output {
  static fromJson: FromJson<Output> = {
    ok: json.optional(json.fromAny(() => OK)),
    err: json.optional("string"),
  };

  ok?: OK;
  err?: PreimagesErrorCode;
}

export class PreImagesTest {
  static fromJson: FromJson<PreImagesTest> = {
    input: Input.fromJson,
    pre_state: TestState.fromJson,
    output: Output.fromJson,
    post_state: TestState.fromJson,
  };
  input!: Input;
  pre_state!: TestState;
  output!: Output;
  post_state!: TestState;
}

export async function runPreImagesTest(testContent: PreImagesTest) {
  const blake2b = await Blake2b.createHasher();
  const preState = InMemoryState.partial(tinyChainSpec, {
    services: new Map(
```
