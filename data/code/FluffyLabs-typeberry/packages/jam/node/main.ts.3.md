---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/node/main.ts#L340-L358
title: packages/jam/node/main.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 3
chunk_total: 4
content_sha: 7a2388b28e89783fe5dd94df4ca843155b30b964aee76ad80ac938a5f49e7b93
language: typescript
---
`packages/jam/node/main.ts` (lines 340–358)

```typescript
          workerParams: networkingConfig,
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
