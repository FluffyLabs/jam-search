---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/reports/verify-credentials.ts#L99-L124
title: packages/jam/transition/reports/verify-credentials.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 1
chunk_total: 2
content_sha: a0888f67d03202ce39090e35cceb3b550423fd828e0f8e39f1b8450cdaadc964
language: typescript
---
`packages/jam/transition/reports/verify-credentials.ts` (lines 99–124)

```typescript
            `Invalid core assignment for validator ${validatorIndex}. Expected: ${guarantorData.core}, got: ${coreIndex}`,
        );
      }

      signaturesToVerify.push({
        signature,
        key: guarantorData.ed25519,
        message: signingPayload(workReportHash),
      });
    }
  }

  return Result.ok(signaturesToVerify);
}

const JAM_GUARANTEE = BytesBlob.blobFromString("jam_guarantee").raw;

/**
 * The signature [...] whose message is the serialization of the hash
 * of the work-report.
 *
 * https://graypaper.fluffylabs.dev/#/ab2cdbd/15a20115a201?v=0.7.2
 */
function signingPayload(hash: WorkReportHash) {
  return BytesBlob.blobFromParts(JAM_GUARANTEE, hash.raw);
}
```
