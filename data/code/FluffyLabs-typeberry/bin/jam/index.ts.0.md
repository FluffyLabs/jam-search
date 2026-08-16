---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/jam/index.ts#L1-L107'
title: bin/jam/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 837fee41ef8c8f3a19eda36e96399917a30761a3a494ce918d68106e3b939485
language: typescript
---
`bin/jam/index.ts` (lines 1–107)

```typescript
// biome-ignore-all lint/suspicious/noConsole: bin file

import { Bootnode } from "@typeberry/config";
import { KnownChainSpec, loadConfig } from "@typeberry/config-node";
import { ed25519 } from "@typeberry/crypto";
import { deriveEd25519SecretKey } from "@typeberry/crypto/key-derivation.js";
import { Blake2b } from "@typeberry/hash";
import { Level, Logger } from "@typeberry/logger";
import { altNameRaw } from "@typeberry/networking";
import { exportBlocks, getChainSpec, getDatabasePath, importBlocks, JamConfig, main, mainFuzz } from "@typeberry/node";
import { RpcServer, rpcHandlers } from "@typeberry/rpc";
import { validation } from "@typeberry/rpc-validation";
import { Telemetry } from "@typeberry/telemetry";
import { asOpaqueType, type Closer, workspacePathFix } from "@typeberry/utils";
import { installShutdownHandlers } from "@typeberry/utils/shutdown.node.js";
import { FjallWorkerConfig } from "@typeberry/workers-api-node";
import { type Arguments, Command, HELP, parseArgs } from "./args.js";
import { readFuzzEnv, synthesizeFuzzArgs } from "./fuzz-env.js";

export * from "./args.js";

Logger.configureAll(process.env.JAM_LOG ?? "", Level.LOG);

let args: Arguments;
const withRelPath = workspacePathFix(`${import.meta.dirname}/../..`);

try {
  const fuzzEnv = readFuzzEnv(process.env);
  if (fuzzEnv !== null) {
    if (process.argv.length > 2) {
      throw new Error("When JAM_FUZZ is set, command-line arguments are not accepted.");
    }
    // In fuzz mode, the logger config is determined by JAM_FUZZ_LOG_LEVEL alone;
    // any JAM_LOG filters configured at module load are discarded so behavior is
    // deterministic regardless of which env vars happen to be present.
    Logger.configureAll("", fuzzEnv.logLevel ?? (fuzzEnv.spec === KnownChainSpec.Full ? Level.TRACE : Level.LOG));
    args = synthesizeFuzzArgs(fuzzEnv);
  } else {
    const parsed = parseArgs(process.argv.slice(2), withRelPath);
    if (parsed === null) {
      console.info(HELP);
      process.exit(0);
    }
    args = parsed;
  }
} catch (e) {
  console.error(`\n${e}\n`);
  console.info(HELP);
  process.exit(1);
}

// Install shutdown handlers as early as possible so signals during startup
// also exit cleanly. The closer is mutated by each startNode branch once it
// knows what to clean up.
let currentClose: Closer = async () => {};
installShutdownHandlers(() => currentClose(), { log: console });

const running = startNode(args, withRelPath, (c) => {
  currentClose = c;
});

running.catch((e) => {
  console.error(`${e}`);
  process.exit(-1);
});

function getPortShift(args: Arguments) {
  if (args.command !== Command.Dev) {
    return 0;
  }

  if (args.args.index === "all") {
    return -1;
  }

  return args.args.index;
}

async function prepareConfigFile(
  args: Arguments,
  blake2b: Blake2b,
  withRelPath: (p: string) => string,
): Promise<JamConfig> {
  const { nodeName: defaultNodeName } = args.args;
  const nodeConfig = loadConfig(args.args.config, withRelPath);
  const nodeName = args.command === Command.Dev ? devNodeName(defaultNodeName, args.args.index) : defaultNodeName;

  const devPortShift = getPortShift(args);

  const devBootnodes =
    args.command === Command.Dev
      ? await Promise.all(
          Array.from({ length: 5 }).map(async (_, idx) => {
            const name = devNodeName(defaultNodeName, idx + 1);
            const seed = devNetworkingSeed(blake2b, name);
            const port = devPort(idx + 1);
            // Derive the peer ID from the public key using the same method as in certificate.ts
            const peerId = altNameRaw((await ed25519.privateKey(seed)).pubKey);
            return Bootnode.new(asOpaqueType(peerId), "127.0.0.1", port);
          }),
        )
      : [];

  const isDevMode = args.command === Command.Dev;
  const devIndex = isDevMode ? args.args.index : null;
  const isFastForward = isDevMode ? args.args.isFastForward : false;

```
