---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/disputes/verification-utils.ts#L1-L77
title: packages/jam/transition/disputes/verification-utils.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 9e8afeb3671fb055a8b7c959ea08a76d31601467d586bab915db83397e848f2a
language: typescript
---
`packages/jam/transition/disputes/verification-utils.ts` (lines 1–77)

```typescript
import type { WorkReportHash } from "@typeberry/block";
import type { Culprit, Fault, Judgement } from "@typeberry/block/disputes.js";
import { BytesBlob } from "@typeberry/bytes";
import { type Ed25519Key, type Ed25519Signature, ed25519 } from "@typeberry/crypto";

type InputItem = ed25519.Input<BytesBlob>;

export type VerificationInput = {
  judgements: InputItem[];
  culprits: InputItem[];
  faults: InputItem[];
};
type VerificationResultItem = { signature: Ed25519Signature; isValid: boolean };

export type VerificationOutput = {
  judgements: VerificationResultItem[];
  culprits: VerificationResultItem[];
  faults: VerificationResultItem[];
};

export const JAM_VALID = BytesBlob.blobFromString("jam_valid").raw;
export const JAM_INVALID = BytesBlob.blobFromString("jam_invalid").raw;
export const JAM_GUARANTEE = BytesBlob.blobFromString("jam_guarantee").raw;

export function prepareCulpritSignature({ key, signature, workReportHash }: Culprit): InputItem {
  const message = BytesBlob.blobFromParts(JAM_GUARANTEE, workReportHash.raw);

  return {
    key,
    signature,
    message,
  };
}

export function prepareFaultSignature({ workReportHash, wasConsideredValid, signature, key }: Fault): InputItem {
  const signingContext = wasConsideredValid ? JAM_VALID : JAM_INVALID;
  const message = BytesBlob.blobFromParts(signingContext, workReportHash.raw);
  return {
    key,
    signature,
    message,
  };
}

export function prepareJudgementSignature(
  judgement: Judgement,
  workReportHash: WorkReportHash,
  key: Ed25519Key,
): InputItem {
  const { isWorkReportValid, signature } = judgement;
  const signingContext = isWorkReportValid ? JAM_VALID : JAM_INVALID;
  const message = BytesBlob.blobFromParts(signingContext, workReportHash.raw);

  return {
    key,
    signature,
    message,
  };
}

// Verification is heavy and currently it is a bottleneck so in the future it will be outsourced to Rust.
// This is why the data structure is complicated but it should allow to pass whole data to Rust at once.
export async function vefifyAllSignatures(input: VerificationInput): Promise<VerificationOutput> {
  const output: VerificationOutput = { culprits: [], faults: [], judgements: [] };
  const inputEntries = Object.entries(input) as [keyof VerificationInput, InputItem[]][];

  for (const [key, signatureGroup] of inputEntries) {
    output[key] = (await ed25519.verify(signatureGroup)).map((isValid, idx) => {
      return {
        isValid,
        signature: signatureGroup[idx].signature,
      };
    });
  }

  return Promise.resolve(output);
}
```
