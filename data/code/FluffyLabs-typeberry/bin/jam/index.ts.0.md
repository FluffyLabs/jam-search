---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/jam/index.ts#L1-L116'
title: bin/jam/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 2
content_sha: 1ae8c718754742d6a2eaf560968ad60abc368078ca89d0a9e355a7fabdd15b75
language: typescript
---
`bin/jam/index.ts` (lines 1–116)

```typescript
// biome-ignore-all lint/suspicious/noConsole: bin file

import { Bootnode } from "@typeberry/config";
import { KnownChainSpec, loadConfig } from "@typeberry/config-node";
import { ed25519 } from "@typeberry/crypto";
import { deriveEd25519SecretKey } from "@typeberry/crypto/key-derivation.js";
import { Blake2b } from "@typeberry/hash";
import { Level, Logger } from "@typeberry/logger";
import { altNameRaw } from "@typeberry/networking";
import { exportBlocks, importBlocks, JamConfig, main, mainFuzz } from "@typeberry/node";
import { Telemetry } from "@typeberry/telemetry";
import { asOpaqueType, workspacePathFix } from "@typeberry/utils";
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

const running = startNode(args, withRelPath);

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
    devValidatorIndex: devIndex,
  });
}

async function startNode(args: Arguments, withRelPath: (p: string) => string) {
  const blake2b = await Blake2b.createHasher();
  const jamNodeConfig = await prepareConfigFile(args, blake2b, withRelPath);

  // Initialize OpenTelemetry before anything else
```
