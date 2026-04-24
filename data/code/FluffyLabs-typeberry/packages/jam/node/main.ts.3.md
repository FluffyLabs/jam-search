---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/node/main.ts#L339-L356
title: packages/jam/node/main.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 3
chunk_total: 4
content_sha: 396c9c4d5fa7fedefb29aadd893bd103eed513208ce6e1eed702981eda51bbc8
language: typescript
---
`packages/jam/node/main.ts` (lines 339–356)

```typescript
          ports: new Map([[AUTHORSHIP_NETWORK_PORT, params.authorshipPort]]),
        }),
      );

  // relay blocks from networking to importer
  network.setOnBlocks(async (newBlocks) => {
    for (const block of newBlocks) {
      await importer.sendImportBlock(block);
    }
  });

  // relay newly imported headers to trigger network announcements
  bestHeader.on((header) => {
    network.sendNewHeader(header);
  });

  return { closeNetwork: finish, networkApi: network, networkWorker: worker };
};
```
