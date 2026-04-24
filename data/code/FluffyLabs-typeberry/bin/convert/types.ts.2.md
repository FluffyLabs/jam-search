---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/convert/types.ts#L230-L265
title: bin/convert/types.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 12a01ff3491378601ed678f9dd6a0f2cd54b8df1393f09089a943ef6a418b0d8
language: typescript
---
`bin/convert/types.ts` (lines 230–265)

```typescript
          const blockHeader = test.block.header.materialize();
          const init = v1.Initialize.create({
            header: Header.empty(),
            keyvals: test.pre_state.keyvals,
            ancestry: [
              v1.AncestryItem.create({
                headerHash: blockHeader.parentHeaderHash,
                slot: tryAsTimeSlot(Math.max(0, blockHeader.timeSlotIndex - 1)),
              }),
            ],
          });
          const msg: v1.MessageData = {
            type: v1.MessageType.Initialize,
            value: init,
          };
          return looseType({
            value: msg,
            encode: v1.messageCodec,
          });
        }

        throw new Error(`Invalid processing option: ${option}`);
      },
    },
  },
  {
    name: "fuzz-message",
    encode: v1.messageCodec,
    decode: v1.messageCodec,
  },
];

const stateFromKeyvals = (spec: ChainSpec, blake2b: Blake2b, state: TestState) => {
  const entries = StateEntries.fromEntriesUnsafe(state.keyvals.map((x) => [x.key, x.value]));
  return SerializedState.fromStateEntries(spec, blake2b, entries);
};
```
