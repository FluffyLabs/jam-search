---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/jam/index.ts#L112-L168'
title: bin/jam/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 1
chunk_total: 2
content_sha: 1134e66d76ec2eb23db69fd0c7cfe7274fa04fc466ff86b5dbd41ade5df67949
language: typescript
---
`bin/jam/index.ts` (lines 112–168)

```typescript
async function startNode(args: Arguments, withRelPath: (p: string) => string) {
  const blake2b = await Blake2b.createHasher();
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
