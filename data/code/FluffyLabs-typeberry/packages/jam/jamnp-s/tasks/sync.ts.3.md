---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/tasks/sync.ts#L325-L373
title: packages/jam/jamnp-s/tasks/sync.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 3
chunk_total: 4
content_sha: b2a060b0a6c3c0cf88fa24becaeb8f45d1d65a276f64f0d21c3ae1b37c9892e7
language: typescript
---
`packages/jam/jamnp-s/tasks/sync.ts` (lines 325–373)

```typescript
            const blocks = await handler.requestBlockSequence(
              sender,
              bestHash,
              ce128.Direction.DescIncl,
              tryAsU32(bestSlot - ourBestSlot),
            );
            blocks.reverse();
            this.onNewBlocks(blocks, peerInfo.peerId);
          },
          (e) => {
            logger.warn`[${peerInfo.peerId}] <-- requesting blocks to import: ${e}`;
          },
        );
        return OK;
      });
    }

    return {
      kind: SyncResult.BlocksRequested,
      ours: ourBestSlot,
      requested,
    };
  }
}

/** Some extra details about how maintaining sync went. */
export enum SyncResult {
  /** We didn't find our best header? */
  OurBestHeaderMissing = 1,
  /** There is no new blocks that we can sync. */
  NoNewBlocks = 2,
  /** Sent request to some peers. */
  BlocksRequested = 3,
}

/** Information about blocks requested from other peers. */
export type RequestedBlocks = {
  /** Peer id we sent the request to. */
  peerId: PeerId;
  /* Their best time slot. */
  theirs: TimeSlot;
  /** Number of blocks requested. */
  count: number;
};

function hashHeader(blake2b: Blake2b, header: Header, spec: ChainSpec): WithHash<HeaderHash, Header> {
  const encoded = Encoder.encodeObject(Header.Codec, header, spec);
  return WithHash.new(blake2b.hashBytes(encoded).asOpaque(), header);
}
```
