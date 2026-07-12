---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/jam/index.ts#L100-L238'
title: bin/jam/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 00afb34cb00b54bf9e683fa255202be4f52052860c81ec849f2af188f91dee35
language: typescript
---
`bin/jam/index.ts` (lines 100–238)

```typescript
          }),
        )
      : [];

  const isDevMode = args.command === Command.Dev;
  const devIndex = isDevMode ? args.args.index : null;
  const isFastForward = isDevMode ? args.args.isFastForward : false;

  const rpcPort = nodeConfig.rpc !== undefined ? nodeConfig.rpc.port + devPortShift : null;

  return JamConfig.new({
    isAuthoring: isDevMode,
    isFastForward,
    nodeName,
    nodeConfig,
    pvmBackend: args.args.pvm,
    networkConfig: {
      key: devNetworkingSeed(blake2b, nodeName),
      host: "127.0.0.1",
      port: devPort(devPortShift),
      bootnodes: devBootnodes.concat(nodeConfig.chainSpec.bootnodes ?? []),
    },
    rpcPort,
    devValidatorIndex: devIndex,
  });
}

async function startNode(
  args: Arguments,
  withRelPath: (p: string) => string,
  setCloser: (c: Closer) => void,
): Promise<void> {
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
    const { close } = await mainFuzz({ jamNodeConfig, version, socket, initGenesisFromAncestry }, withRelPath);
    setCloser(close);
    return;
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
    let closePromise: Promise<void> | null = null;
    const closeNode = () => {
      closePromise ??= node.close();
      return closePromise;
    };
    setCloser(closeNode);
    try {
      await importBlocks(node, args.args.files);
    } finally {
      // Drain workers/db on both happy-path completion and signal-driven
      // shutdown — otherwise the process would hang on the still-active workers.
      await closeNode();
      setCloser(async () => {});
    }
    return;
  }

  if (args.command === Command.Export) {
    await exportBlocks(jamNodeConfig, args.args.output, withRelPath);
    return;
  }

  // Run regular node.
  const node = await main(jamNodeConfig, withRelPath, telemetry);
  setCloser(() => node.close());

  // Start in-process RPC server if configured.
  const closeRpc = await startRpcServer(jamNodeConfig, blake2b, withRelPath);

  if (closeRpc !== null) {
    setCloser(async () => {
      await closeRpc();
      await node.close();
    });
  }
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

const logger = Logger.new(import.meta.filename, "rpc");

async function startRpcServer(
  config: JamConfig,
  blake2b: Blake2b,
  withRelPath: (p: string) => string,
): Promise<Closer | null> {
  const rpcPort = config.rpcPort;
  if (rpcPort === null) {
    return null;
  }

  if (config.node.databaseBasePath === undefined) {
    logger.warn`RPC server requires a persistent database; skipping (in-memory mode).`;
    return null;
  }

  const chainSpec = getChainSpec(config.node.flavor);
  const { dbPath } = getDatabasePath(
    blake2b,
    config.nodeName,
    config.node.chainSpec.genesisHeader,
```
