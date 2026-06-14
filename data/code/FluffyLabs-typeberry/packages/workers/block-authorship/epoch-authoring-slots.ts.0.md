---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/epoch-authoring-slots.ts#L1-L105
title: packages/workers/block-authorship/epoch-authoring-slots.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 2
content_sha: 4e702675341b7d77dcf05af8997303b4e57dfa83eccab47e1e5dcff8e9c216f0
language: typescript
---
`packages/workers/block-authorship/epoch-authoring-slots.ts` (lines 1–105)

```typescript
import type { EntropyHash } from "@typeberry/block";
import { BytesBlob } from "@typeberry/bytes";
import { HashDictionary } from "@typeberry/collections";
import type { ChainSpec } from "@typeberry/config";
import type { BandersnatchKey, BandersnatchSecretSeed, Ed25519Key, Ed25519SecretSeed } from "@typeberry/crypto";
import { deriveBandersnatchPublicKey, deriveEd25519PublicKey } from "@typeberry/crypto/key-derivation.js";
import bandersnatchVrf from "@typeberry/safrole/bandersnatch-vrf.js";
import type { BandernsatchWasm } from "@typeberry/safrole/bandersnatch-wasm.js";
import { JAM_FALLBACK_SEAL, JAM_TICKET_SEAL } from "@typeberry/safrole/constants.js";
import { type SafroleSealingKeys, SafroleSealingKeysKind } from "@typeberry/state";
import { asOpaqueType } from "@typeberry/utils";
import type { BlockSealInput } from "./block-generator.js";
import type { ValidatorSecrets } from "./protocol.js";

type ValidatorPrivateKeys = {
  bandersnatchSecret: BandersnatchSecretSeed;
  ed25519Secret: Ed25519SecretSeed;
};

type ValidatorPublicKeys = {
  bandersnatchPublic: BandersnatchKey;
  ed25519Public: Ed25519Key;
};

type ValidatorKeys = ValidatorPrivateKeys & ValidatorPublicKeys;

export type SlotSealData = {
  key: ValidatorKeys;
  sealPayload: BlockSealInput;
  logId: string;
};

/** A helper class to figure out in which slots in the next epoch we are authoring blocks. */
export class EpochAuthoringSlots {
  static async new(chainSpec: ChainSpec, bandersnatch: BandernsatchWasm, ownedSecrets: readonly ValidatorSecrets[]) {
    const keys = await derivePublicKeys(ownedSecrets);
    const keysDictionary = new HashDictionary<BandersnatchKey, ValidatorKeys>();
    for (const key of keys) {
      keysDictionary.set(key.bandersnatchPublic, key);
    }

    return new EpochAuthoringSlots(chainSpec.ticketsPerValidator, bandersnatch, keysDictionary);
  }

  private constructor(
    private readonly ticketsPerValidator: number,
    private readonly bandersnatch: BandernsatchWasm,
    private readonly keys: HashDictionary<BandersnatchKey, ValidatorKeys>,
  ) {}

  getValidatorKeys() {
    return Array.from(this.keys.values());
  }

  getBandersnatchPublicKeys() {
    return Array.from(this.keys.keys());
  }

  async getOurSlotsInKeySeries(
    sealingKeySeries: SafroleSealingKeys,
    entropy: EntropyHash,
  ): Promise<Array<SlotSealData | null>> {
    // Fallback (keys) mode. Just find keys that match ours.
    if (sealingKeySeries.kind === SafroleSealingKeysKind.Keys) {
      const sealPayload = getFallbackSealPayload(entropy);
      return sealingKeySeries.keys.map((author) => {
        const key = this.keys.get(author);
        if (key === undefined) {
          return null;
        }
        return {
          key,
          sealPayload,
          logId: `key ${key.bandersnatchPublic.toStringTruncated()}`,
        };
      });
    }

    // Tickets mode. Generate own VrfOutputHash for our tickets (cheap) and check if it matches.
    const ownTickets = await this.getOwnTicketIds(entropy);
    const slots = sealingKeySeries.tickets.map((ticket) => ownTickets.get(ticket.id.asOpaque<EntropyHash>()) ?? null);
    return slots;
  }

  private async getOwnTicketIds(entropy: EntropyHash) {
    // generate our own tickets first
    const ownTickets = new HashDictionary<EntropyHash, SlotSealData>();
    for (let attempt = 0; attempt < this.ticketsPerValidator; attempt++) {
      const sealPayload = getTicketSealPayload(entropy, attempt);
      for (const key of this.keys.values()) {
        const result = await bandersnatchVrf.getVrfOutputHash(this.bandersnatch, key.bandersnatchSecret, sealPayload);
        if (result.isOk) {
          const ticketId = result.ok.asOpaque<EntropyHash>();
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

```
