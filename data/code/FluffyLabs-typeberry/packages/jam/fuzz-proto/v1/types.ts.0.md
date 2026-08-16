---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/fuzz-proto/v1/types.ts#L1-L158
title: packages/jam/fuzz-proto/v1/types.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 2c88bb53121edfb882219c540aa53e67ee93e491c472903cda553beae670fb26
language: typescript
---
`packages/jam/fuzz-proto/v1/types.ts` (lines 1–158)

```typescript
import { Block, type BlockView, Header, type HeaderHash, type StateRootHash, type TimeSlot } from "@typeberry/block";
import type { BytesBlob } from "@typeberry/bytes";
import { type CodecRecord, codec } from "@typeberry/codec";
import { HASH_SIZE, TRUNCATED_HASH_SIZE, type TruncatedHash } from "@typeberry/hash";
import { tryAsU8, type U8, type U32 } from "@typeberry/numbers";
import { WithDebug } from "@typeberry/utils";

/**
 * Version ::= SEQUENCE {
 *     major INTEGER (0..255),
 *     minor INTEGER (0..255),
 *     patch INTEGER (0..255)
 * }
 */
export class Version extends WithDebug {
  static Codec = codec.Class(Version, {
    major: codec.u8,
    minor: codec.u8,
    patch: codec.u8,
  });

  static tryFromString(str: string): Version {
    const parse = (v: string) => tryAsU8(Number(v));
    try {
      // strip any semver pre-release / build metadata (e.g. "-15ccd70", "+build.42")
      // so that only `major.minor.patch` is parsed.
      const core = str.trim().split(/[-+]/)[0];
      const [major, minor, patch] = core.split(".").map(parse);

      return Version.create({
        major,
        minor,
        patch,
      });
    } catch (e) {
      throw new Error(`Unable to parse ${str} as Version: ${e}`);
    }
  }

  static create({ major, minor, patch }: CodecRecord<Version>) {
    return new Version(major, minor, patch);
  }

  private constructor(
    public readonly major: U8,
    public readonly minor: U8,
    public readonly patch: U8,
  ) {
    super();
  }
}

/**
 * Fuzzer Protocol V1
 * Reference: https://github.com/davxy/jam-conformance/blob/main/fuzz-proto/fuzz.asn
 */
// Feature bit constants
export enum Features {
  Ancestry = 1, // 2^0
  Fork = 2, // 2^1
  Reserved = 2147483648, // 2^31
}

/**
 * PeerInfo ::= SEQUENCE {
 *     fuzz-version U8,
 *     features     Features,
 *     jam-version  Version,
 *     app-version  Version,
 *     name         UTF8String
 * }
 */
export class PeerInfo extends WithDebug {
  static Codec = codec.Class(PeerInfo, {
    fuzzVersion: codec.u8,
    features: codec.u32,
    jamVersion: Version.Codec,
    appVersion: Version.Codec,
    name: codec.string,
  });

  static create({ fuzzVersion, features, appVersion, jamVersion, name }: CodecRecord<PeerInfo>) {
    return new PeerInfo(fuzzVersion, features, jamVersion, appVersion, name);
  }

  private constructor(
    public readonly fuzzVersion: U8,
    public readonly features: U32,
    public readonly jamVersion: Version,
    public readonly appVersion: Version,
    public readonly name: string,
  ) {
    super();
  }
}

/**
 * AncestryItem ::= SEQUENCE {
 *     slot TimeSlot,
 *     header-hash HeaderHash
 * }
 */
export class AncestryItem extends WithDebug {
  static Codec = codec.Class(AncestryItem, {
    slot: codec.u32.asOpaque<TimeSlot>(),
    headerHash: codec.bytes(HASH_SIZE).asOpaque<HeaderHash>(),
  });

  static create({ slot, headerHash }: CodecRecord<AncestryItem>) {
    return new AncestryItem(slot, headerHash);
  }

  private constructor(
    public readonly slot: TimeSlot,
    public readonly headerHash: HeaderHash,
  ) {
    super();
  }
}

/**
 * KeyValue ::= SEQUENCE {
 *     key     TrieKey,
 *     value   OCTET STRING
 * }
 */
export class KeyValue extends WithDebug {
  static Codec = codec.Class(KeyValue, {
    key: codec.bytes(TRUNCATED_HASH_SIZE),
    value: codec.blob,
  });

  static create({ key, value }: CodecRecord<KeyValue>) {
    return new KeyValue(key, value);
  }

  private constructor(
    public readonly key: TruncatedHash,
    public readonly value: BytesBlob,
  ) {
    super();
  }
}

/** State ::= SEQUENCE OF KeyValue */
export const stateCodec = codec.sequenceVarLen(KeyValue.Codec);

/**
 * Ancestry ::= SEQUENCE (SIZE(0..24)) OF AncestryItem
 * Empty when `feature-ancestry` is not supported by both parties
 */
export const ancestryCodec = codec.sequenceVarLen(AncestryItem.Codec, {
  minLength: 0,
  maxLength: 24,
});
export type Ancestry = AncestryItem[];

/**
```
