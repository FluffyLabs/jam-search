---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/config/chain-spec.ts#L103-L153
title: packages/jam/config/chain-spec.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 1
chunk_total: 2
content_sha: 8e0488d0ef094e8c42cddc0e2dc57f4b5142fa4af100ae48d90f6996cfde9760
language: typescript
---
`packages/jam/config/chain-spec.ts` (lines 103–153)

```typescript
    this.ticketsPerValidator = data.ticketsPerValidator;
    this.maxTicketsPerExtrinsic = data.maxTicketsPerExtrinsic;
    this.numberECPiecesPerSegment = data.numberECPiecesPerSegment;
    this.preimageExpungePeriod = data.preimageExpungePeriod;
    this.erasureCodedPieceSize = tryAsU32(EC_SEGMENT_SIZE / data.numberECPiecesPerSegment);
    this.maxBlockGas = data.maxBlockGas;
    this.maxRefineGas = data.maxRefineGas;
    this.maxLookupAnchorAge = data.maxLookupAnchorAge;
  }
}

/** Set of values for "tiny" chain as defined in JAM test vectors. */
export const tinyChainSpec = ChainSpec.new({
  name: "tiny",
  validatorsCount: tryAsU16(6),
  coresCount: tryAsU16(2),
  epochLength: tryAsU32(12),
  contestLength: tryAsU32(10),
  maxTicketsPerExtrinsic: tryAsU8(3),
  rotationPeriod: tryAsU16(4),
  slotDuration: tryAsU16(6),
  ticketsPerValidator: tryAsU8(3),
  numberECPiecesPerSegment: tryAsU32(1026),
  // https://github.com/davxy/jam-test-vectors/tree/v0.6.6/traces#preimage-expunge-delay
  preimageExpungePeriod: tryAsU32(32),
  maxBlockGas: tryAsU64(20_000_000),
  maxRefineGas: tryAsU64(1_000_000_000),
  // https://github.com/davxy/jam-conformance/pull/47/files#diff-27e26142b3a96e407dab40d388b63d553f5d9cdb66dec58cd93e63dd434f9e45R260
  maxLookupAnchorAge: tryAsU32(24),
});

/**
 * Set of values for "full" chain as defined in JAM test vectors.
 * Please note that only validatorsCount and epochLength are "full", the rest is copied from "tiny".
 */
export const fullChainSpec = ChainSpec.new({
  name: "full",
  validatorsCount: tryAsU16(1023),
  coresCount: tryAsU16(341),
  epochLength: tryAsU32(600),
  contestLength: tryAsU32(500),
  maxTicketsPerExtrinsic: tryAsU8(16),
  rotationPeriod: tryAsU16(10),
  slotDuration: tryAsU16(6),
  ticketsPerValidator: tryAsU8(2),
  numberECPiecesPerSegment: tryAsU32(6),
  preimageExpungePeriod: tryAsU32(19_200),
  maxBlockGas: tryAsU64(3_500_000_000),
  maxRefineGas: tryAsU64(5_000_000_000),
  maxLookupAnchorAge: tryAsU32(14_400),
});
```
