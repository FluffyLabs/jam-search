---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/tci/args.ts#L1-L131'
title: bin/tci/args.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 2a1e67e012a3e565adebf7b22c3cd193a151f5960090ed006f14488ed195baa5
language: typescript
---
`bin/tci/args.ts` (lines 1–131)

```typescript
import { Bytes } from "@typeberry/bytes";
import { type PublicKeySeed, SEED_SIZE } from "@typeberry/crypto";
import { version } from "@typeberry/utils";
import minimist from "minimist";

enum TciFlag {
  bandersnatch = "bandersnatch",
  bls = "bls",
  datadir = "datadir",
  ed25519 = "ed25519",
  genesis = "genesis",
  metadata = "metadata",
  port = "port",
  timestamp = "ts",
  validatorindex = "validatorindex",
}

export const requiredSeedFlags = [TciFlag.bandersnatch, TciFlag.bls, TciFlag.ed25519] as const;
export type RequiredFlag = (typeof requiredSeedFlags)[number];

export const HELP = `
Cross-implementation compatible CLI for typeberry ${version} by Fluffy Labs

https://docs.jamcha.in/basics/cli-args

Usage:
  typeberry [options]

Options:
  --${TciFlag.bandersnatch} hex        Bandersnatch Seed (development only)
  --${TciFlag.bls} hex                 BLS Seed (development only)
  --${TciFlag.datadir} path            Directory for blockchain, keystore, and other data
  --${TciFlag.ed25519} hex             Ed25519 Seed (development only)
  --${TciFlag.genesis} path            Genesis state JSON file
  --${TciFlag.metadata} string         Node metadata (default: "Alice")
  --${TciFlag.port} int                Network listening port (default: 9900)
  --${TciFlag.timestamp} int                  JAM genesis TimeSlot (overrides genesis config)
  --${TciFlag.validatorindex} int      Validator Index (development only)

Note:
  'hex' is 32 byte hash (64 character string), can be either '0x' prefixed or not.
`;

export type CommonArguments = {
  [TciFlag.bandersnatch]?: PublicKeySeed;
  [TciFlag.bls]?: PublicKeySeed;
  [TciFlag.datadir]?: string;
  [TciFlag.ed25519]?: PublicKeySeed;
  [TciFlag.genesis]?: string;
  [TciFlag.metadata]?: string;
  [TciFlag.port]?: number;
  [TciFlag.timestamp]?: number; // epoch0 unix timestamp
  [TciFlag.validatorindex]?: number;
};

const toBytes = (v: string): PublicKeySeed => {
  if (v.startsWith("0x")) {
    return Bytes.parseBytes(v, SEED_SIZE).asOpaque();
  }
  return Bytes.parseBytesNoPrefix(v, SEED_SIZE).asOpaque();
};
const toStr = (v: string) => v;
const toNumber = (v: string): number => {
  const val = Number(v);
  if (Number.isNaN(val)) {
    throw Error(`Cannot parse '${v}' as a number.`);
  }
  return val;
};

export function parseArgs(cliInput: string[]): CommonArguments {
  const args = minimist(cliInput, {
    string: [
      TciFlag.bandersnatch,
      TciFlag.bls,
      TciFlag.datadir,
      TciFlag.ed25519,
      TciFlag.genesis,
      TciFlag.metadata,
      TciFlag.port,
      TciFlag.timestamp,
      TciFlag.validatorindex,
    ],
  });

  const result: CommonArguments = {
    bandersnatch: parseValue(args, TciFlag.bandersnatch, toBytes).bandersnatch,
    bls: parseValue(args, TciFlag.bls, toBytes).bls,
    datadir: parseValue(args, TciFlag.datadir, toStr).datadir,
    ed25519: parseValue(args, TciFlag.ed25519, toBytes).ed25519,
    genesis: parseValue(args, TciFlag.genesis, toStr).genesis,
    metadata: parseValue(args, TciFlag.metadata, toStr, "Alice").metadata,
    port: parseValue(args, TciFlag.port, toNumber).port,
    ts: parseValue(args, TciFlag.timestamp, toNumber).ts,
    validatorindex: parseValue(args, TciFlag.validatorindex, toNumber).validatorindex,
  };

  assertNoMoreArgs(args);

  return result;
}

function parseValue<S extends string, T>(
  args: minimist.ParsedArgs,
  flag: S,
  parser: (v: string) => T,
  defaultValue?: T | undefined,
): Record<S, T | undefined> {
  const value = args[flag];
  if (value === undefined) {
    return {
      [flag]: defaultValue,
    } as Record<S, T>;
  }

  delete args[flag];
  if (value === "") {
    throw new Error(`Option --${flag} requires an argument.`);
  }

  try {
    const parsed = parser(value);
    return {
      [flag]: parsed,
    } as Record<S, T>;
  } catch (e) {
    throw new Error(`Invalid value '${value}' for flag '--${flag}': ${e}`);
  }
}

function assertNoMoreArgs(args: minimist.ParsedArgs): void {
```
