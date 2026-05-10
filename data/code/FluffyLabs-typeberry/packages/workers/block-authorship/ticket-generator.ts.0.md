---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/ticket-generator.ts#L1-L67
title: packages/workers/block-authorship/ticket-generator.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: 60d19dd96930b4397d8e1b9824ea44281819b33e8cc932bef2efbb7d8c95efe4
language: typescript
---
`packages/workers/block-authorship/ticket-generator.ts` (lines 1–67)

```typescript
import type { EntropyHash } from "@typeberry/block";
import type { SignedTicket } from "@typeberry/block/tickets.js";
import type { BandersnatchKey, BandersnatchSecretSeed } from "@typeberry/crypto";
import { Logger } from "@typeberry/logger";
import bandersnatchVrf from "@typeberry/safrole/bandersnatch-vrf.js";
import type { BandernsatchWasm } from "@typeberry/safrole/bandersnatch-wasm.js";
import { Result } from "@typeberry/utils";

const logger = Logger.new(import.meta.filename, "tickets-generator");

export enum TicketGeneratorError {
  TicketGenerationFailed = "TicketGenerationFailed",
  ValidatorNotInRing = "ValidatorNotInRing",
}

export type ValidatorKey = {
  secret: BandersnatchSecretSeed;
  public: BandersnatchKey;
};

/**
 * Generates tickets for all validator keys.
 *
 * Each validator key produces `ticketsPerValidator` tickets using ring VRF proofs.
 * The ring keys define the anonymous set - only members can produce valid proofs.
 */
export async function generateTickets(
  bandersnatch: BandernsatchWasm,
  ringKeys: BandersnatchKey[],
  validatorKeys: ValidatorKey[],
  entropy: EntropyHash,
  ticketsPerValidator: number,
): Promise<Result<SignedTicket[], TicketGeneratorError>> {
  const allTickets: SignedTicket[] = [];

  for (const validatorKey of validatorKeys) {
    const proverIndex = ringKeys.findIndex((k) => k.isEqualTo(validatorKey.public));
    if (proverIndex < 0) {
      logger.warn`Validator public key not found in the ring, skipping ticket generation for this key`;
      continue;
    }

    const ticketResult = await bandersnatchVrf.generateTickets(
      bandersnatch,
      ringKeys,
      proverIndex,
      validatorKey.secret,
      entropy,
      ticketsPerValidator,
    );

    if (ticketResult.isOk) {
      allTickets.push(...ticketResult.ok);
    } else {
      logger.warn`Failed to generate tickets for validator, skipping`;
    }
  }

  if (validatorKeys.length > 0 && allTickets.length === 0) {
    return Result.error(
      TicketGeneratorError.TicketGenerationFailed,
      () => "Failed to generate tickets for all validators",
    );
  }

  return Result.ok(allTickets);
}
```
