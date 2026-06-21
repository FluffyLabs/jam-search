---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/epoch-authoring-slots.ts#L94-L123
title: packages/workers/block-authorship/epoch-authoring-slots.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 1
chunk_total: 2
content_sha: fef766de7607f3f65c15c3e1b02978f9a58ff3527664ec87d6822d71aa0085e4
language: typescript
---
`packages/workers/block-authorship/epoch-authoring-slots.ts` (lines 94–123)

```typescript
          ownTickets.set(ticketId, {
            key,
            sealPayload,
            logId: `ticket ${ticketId} (attempt ${attempt})`,
          });
        }
      }
    }
    return ownTickets;
  }
}

function derivePublicKeys(keys: readonly ValidatorSecrets[]) {
  return Promise.all(
    keys.map(async (secrets) => ({
      bandersnatchSecret: secrets.bandersnatch,
      bandersnatchPublic: deriveBandersnatchPublicKey(secrets.bandersnatch),
      ed25519Secret: secrets.ed25519,
      ed25519Public: await deriveEd25519PublicKey(secrets.ed25519),
    })),
  );
}

function getTicketSealPayload(entropy: EntropyHash, attempt: number): BlockSealInput {
  return asOpaqueType(BytesBlob.blobFromParts(JAM_TICKET_SEAL, entropy.raw, new Uint8Array([attempt])));
}

function getFallbackSealPayload(entropy: EntropyHash): BlockSealInput {
  return asOpaqueType(BytesBlob.blobFromParts(JAM_FALLBACK_SEAL, entropy.raw));
}
```
