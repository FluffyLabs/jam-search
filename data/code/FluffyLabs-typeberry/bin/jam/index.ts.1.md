---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/jam/index.ts#L120-L155'
title: bin/jam/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 1
chunk_total: 2
content_sha: aa68e369c66da12045ada59532936e31b79572b14b6de0e3f5cc2ee8b0c80dd7
language: typescript
---
`bin/jam/index.ts` (lines 120–155)

```typescript
    const node = await main(
      {
        ...jamNodeConfig,
        // disable networking for import, since we close right after.
        network: null,
      },
      withRelPath,
      telemetry,
    );
    return await importBlocks(node, args.args.files);
  }

  if (args.command === Command.Export) {
    return await exportBlocks(jamNodeConfig, args.args.output, withRelPath);
  }

  // Run regular node.
  return main(jamNodeConfig, withRelPath, telemetry);
}

function devNodeName(defaultNodeName: string, idx: number | string) {
  return `${defaultNodeName}-${idx}`;
}

function devPort(idx: number) {
  return 12345 + idx;
}

function devNetworkingSeed(blake2b: Blake2b, name: string) {
  // NOTE [ToDr] in the future we should probably read the networking key
  // from some file or a database, since we want it to be consistent between runs.
  // For now, for easier testability, we use a deterministic seed.
  const seed = blake2b.hashString(name);
  const key = deriveEd25519SecretKey(seed.asOpaque(), blake2b);
  return key;
}
```
