---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/jam/index.ts#L114-L168'
title: bin/jam/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 1
chunk_total: 2
content_sha: 530d4fbe23c9da20e5ffec7ffa91666142238cc8c60a9e179e60384b61a8f024
language: typescript
---
`bin/jam/index.ts` (lines 114–168)

```typescript
  const jamNodeConfig = await prepareConfigFile(args, blake2b, withRelPath);

  // Initialize OpenTelemetry before anything else
  const telemetry = Telemetry.initialize({
    isMain: true,
    nodeName: jamNodeConfig.nodeName,
    worker: "main",
  });

  // Start fuzz-target
  if (args.command === Command.FuzzTarget) {
    const version = args.args.version;
    const socket = args.args.socket;
    const initGenesisFromAncestry = args.args.initGenesisFromAncestry;
    return mainFuzz({ jamNodeConfig, version, socket, initGenesisFromAncestry }, withRelPath);
  }

  // Just import a bunch of blocks
  if (args.command === Command.Import) {
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
