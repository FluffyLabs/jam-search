---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/main.ts#L462-L480
title: packages/workers/block-authorship/main.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 5
chunk_total: 6
content_sha: 8c973ffeec5936f7cc0af910ad71846949d7582f4a0d1f1aac6eac6e82f9fd2c
language: typescript
---
`packages/workers/block-authorship/main.ts` (lines 462–480)

```typescript
        currentEpochTickets, // {ticket, id}[] — already verified
      );
      counter += 1;
      lastGeneratedSlot = timeSlot;
      logger.trace`Sending block ${counter}`;
      await comms.sendBlock(newBlock);
    } else if (isFastForward === true) {
      // In fast-forward mode, if this slot is not ours, wait briefly for other validators to produce blocks
      await setTimeout(10);
    }

    if (isFastForward === false) {
      await setTimeout(chainSpec.slotDuration * 1000);
    }
  }

  logger.info`🎁 Block Authorship finished. Closing channel.`;
  await db.close();
}
```
