---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/safrole/safrole-seal.ts#L105-L142
title: packages/jam/safrole/safrole-seal.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 59797319fe3c65a25cd8cb5b973bd7a2cbc9e59c6fc8f8d158d366d878711663
language: typescript
---
`packages/jam/safrole/safrole-seal.ts` (lines 105–142)

```typescript
  /** Fallback mode of Safrole. */
  async verifySealWithKeys(
    keys: PerEpochBlock<BandersnatchKey>,
    timeSlot: TimeSlot,
    entropy: EntropyHash,
    authorKey: ValidatorData,
    headerView: HeaderView,
  ): Promise<Result<EntropyHash, SafroleSealError>> {
    const index = timeSlot % keys.length;
    const sealingKey = keys.at(index);
    const authorBandersnatchKey = authorKey.bandersnatch;
    if (sealingKey === undefined || !sealingKey.isEqualTo(authorBandersnatchKey)) {
      return Result.error(
        SafroleSealError.InvalidValidator,
        () => `Invalid Validator. Expected: ${sealingKey}, got: ${authorKey.bandersnatch}`,
      );
    }

    // verify seal and entropy source correctness
    const payload = BytesBlob.blobFromParts(JAM_FALLBACK_SEAL, entropy.raw);
    const result = await bandersnatchVrf.verifyHeaderSeals(
      await this.bandersnatch,
      authorBandersnatchKey,
      headerView.seal.materialize(),
      payload,
      encodeUnsealedHeader(headerView),
      headerView.entropySource.materialize(),
      BytesBlob.blobFrom(JAM_ENTROPY),
    );

    if (result.isError) {
      return Result.error(SafroleSealError.IncorrectSeal, () => "Safrole: incorrect seal with keys");
    }

    const [_, entropyOutput] = result.ok;
    return Result.ok(entropyOutput);
  }
}
```
