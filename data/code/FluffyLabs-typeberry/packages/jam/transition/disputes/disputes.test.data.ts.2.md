---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/disputes/disputes.test.data.ts#L199-L267
title: packages/jam/transition/disputes/disputes.test.data.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 62067f6a30670ce1b64441141ccd7ff48e11732f4851b1338e8705af38ac3d0c
language: typescript
---
`packages/jam/transition/disputes/disputes.test.data.ts` (lines 199–267)

```typescript
export const faults = [
  {
    target: "0x11da6d1f761ddf9bdb4c9d6e5303ebd41f61858d0a5647a1a7bfe089bf921be9",
    vote: false,
    key: "0x3b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da29",
    signature:
      "0x826a4bbe7ee3400ffe0f64bdd87ae65aa50d98f48ad6a60da927636cd430ae5d3914d3bc6b87c47c94a9cc5bef84bf30be5534e5c649fc2cd4434918a37a2301",
  },
].map(createFault);

export function createVerdict({
  target,
  age,
  votes,
}: {
  target: string;
  age: number;
  votes: { vote: boolean; index: number; signature: string }[];
}) {
  return Verdict.create({
    workReportHash: Bytes.parseBytes(target, HASH_SIZE).asOpaque(),
    votesEpoch: tryAsEpoch(age),
    votes: asKnownSize(votes.map(createVote)),
  });
}

export function createCulprit({ target, key, signature }: { target: string; key: string; signature: string }) {
  return Culprit.create({
    workReportHash: Bytes.parseBytes(target, HASH_SIZE).asOpaque(),
    key: Bytes.parseBytes(key, ED25519_KEY_BYTES).asOpaque(),
    signature: Bytes.parseBytes(signature, ED25519_SIGNATURE_BYTES).asOpaque(),
  });
}

export function createFault({
  target,
  vote,
  key,
  signature,
}: {
  target: string;
  vote: boolean;
  key: string;
  signature: string;
}) {
  return Fault.create({
    workReportHash: Bytes.parseBytes(target, HASH_SIZE).asOpaque(),
    wasConsideredValid: vote,
    key: Bytes.parseBytes(key, ED25519_KEY_BYTES).asOpaque(),
    signature: Bytes.parseBytes(signature, ED25519_SIGNATURE_BYTES).asOpaque(),
  });
}

export function createVote({ vote, index, signature }: { vote: boolean; index: number; signature: string }) {
  return Judgement.create({
    isWorkReportValid: vote,
    index: tryAsValidatorIndex(index),
    signature: Bytes.parseBytes(signature, ED25519_SIGNATURE_BYTES).asOpaque(),
  });
}

export function createValidatorData({ bandersnatch, ed25519 }: { bandersnatch: string; ed25519: string }) {
  return ValidatorData.create({
    bandersnatch: Bytes.parseBytes(bandersnatch, BANDERSNATCH_KEY_BYTES).asOpaque(),
    ed25519: Bytes.parseBytes(ed25519, ED25519_KEY_BYTES).asOpaque(),
    bls: Bytes.zero(BLS_KEY_BYTES).asOpaque(),
    metadata: Bytes.zero(VALIDATOR_META_BYTES),
  });
}
```
