---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/main.ts#L177-L283
title: packages/workers/block-authorship/main.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 2
chunk_total: 4
content_sha: baac25effd488e8d26cf2dc7934a4aa406f1dbbd44501c626b519560a2e19c6f
language: typescript
---
`packages/workers/block-authorship/main.ts` (lines 177–283)

```typescript
      const currentEpochTickets = verifiedPool.getForEpoch(epochData.epoch);
      const newBlock = await generator.nextBlockView(
        validatorIndex,
        key.bandersnatchSecret,
        sealPayload,
        newTimeSlot,
        // VerifiedTicket has the same `{ ticket, id }` shape the generator expects.
        [...currentEpochTickets],
      );
      logger.trace`${logPrefix} sending block`;
      await comms.sendBlock(newBlock);
    }

    logger.trace`${logPrefix} awaiting next slot`;
    await timeSlotHandler.waitForNextSlot(currentSlot !== null, epochPhase, ticketGeneratorDone);
  }

  logger.info`🎁 Block Authorship finished. Closing channel.`;
  await db.close();
}

function getValidatorIndex(key: BandersnatchKey, currentValidatorData: PerValidator<ValidatorData>) {
  const index = currentValidatorData.findIndex((data) => data.bandersnatch.isEqualTo(key));
  if (index < 0) {
    return null;
  }
  return tryAsValidatorIndex(index);
}

/**
 * How many slots before the end of the contest period we force-await the ticket
 * generator in fast-forward mode. Without this, blocks are produced faster than
 * tickets are generated and the accumulator never fills (→ Keys-mode fallback).
 *
 * Derived so that, after the wait completes, there are enough remaining contest
 * slots to include a full accumulator worth of tickets (`epochLength` tickets at
 * `maxTicketsPerExtrinsic` per block), plus a small buffer.
 */
function ticketInclusionMargin(chainSpec: ChainSpec): number {
  return Math.ceil(chainSpec.epochLength / chainSpec.maxTicketsPerExtrinsic) + 4;
}

function systemTimeMs(): bigint {
  return process.hrtime.bigint() / 1_000_000n;
}

class TimeSlotHandler {
  private readonly systemStartTimeMs: bigint;
  private readonly stateStartTime: bigint;

  static new(isFastForward: boolean, chainSpec: ChainSpec, stateTimeSlot: TimeSlot) {
    const slotDurationMs = BigInt(chainSpec.slotDuration) * 1_000n;
    return new TimeSlotHandler(
      stateTimeSlot,
      slotDurationMs,
      isFastForward,
      chainSpec.contestLength,
      ticketInclusionMargin(chainSpec),
    );
  }

  private constructor(
    public readonly initialStateTimeSlot: TimeSlot,
    private readonly slotDurationMs: bigint,
    private readonly isFastForward: boolean,
    private readonly contestLength: U32,
    private readonly inclusionMargin: number,
  ) {
    this.systemStartTimeMs = systemTimeMs();
    this.stateStartTime = BigInt(initialStateTimeSlot) * slotDurationMs;
  }

  /**
   * In fastForward mode, use simulated time (next slot after current state).
   * In normal mode, use wall clock time.
   * Assuming `slotDuration` is 6 sec it is safe till year 2786.
   * If `slotDuration` is 1 sec then it is safe till 2106.
   */
  getCurrentTimeSlot(stateTimeSlot: TimeSlot) {
    return this.isFastForward === true
      ? tryAsTimeSlot(stateTimeSlot + 1)
      : tryAsTimeSlot(Number(this.getVirtualTimeMs() / this.slotDurationMs));
  }

  async waitForNextSlot(wasAuthoring: boolean, epochPhase: number, ticketGeneratorDone: Promise<void>) {
    if (this.isFastForward) {
      // when we approach the end of the contest period make sure to wait for all tickets
      if (epochPhase < this.contestLength && epochPhase + this.inclusionMargin > this.contestLength) {
        await ticketGeneratorDone;
      }
      // return as fast as possible
      if (wasAuthoring) {
        return;
      }
      // or wait for other nodes to produce a block
      return await setTimeout(100);
    }
    // Sleep until the next slot boundary (not a full slot from "now") so the
    // wakeup doesn't drift later and later as block work eats into each slot.
    const elapsedInSlot = this.getVirtualTimeMs() % this.slotDurationMs;
    const waitMs = elapsedInSlot === 0n ? this.slotDurationMs : this.slotDurationMs - elapsedInSlot;
    await setTimeout(Number(waitMs));
  }

  /**
   * We assume there is no gap between system time and the initial state time.
   *
```
