---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/jam/args.ts#L1-L90'
title: bin/jam/args.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 3
content_sha: 0ab0bcd9c0e3f05dbff97f2760413860771a2daa00b1c07557f56573c691ca24
language: typescript
---
`bin/jam/args.ts` (lines 1–90)

```typescript
import { type PvmBackend, PvmBackendNames } from "@typeberry/config";
import { DEFAULT_CONFIG, DEV_CONFIG, NODE_DEFAULTS } from "@typeberry/config-node";
import { logger } from "@typeberry/node";
import { isU16, type U16 } from "@typeberry/numbers";
import { version } from "@typeberry/utils";
import minimist from "minimist";

export const ARGS = {
  NAME: "name",
  CONFIG: "config",
  PVM: "pvm",
  FAST_FORWARD: "fast-forward",
  INIT_GENESIS_FROM_ANCESTRY: "init-genesis-from-ancestry",
  VERSION: "version",
} as const;

export const HELP = `
@typeberry/jam ${version} by Fluffy Labs.

Usage:
  jam [options]
  jam [options] dev <dev-validator-index> [--${ARGS.FAST_FORWARD}]
  jam [options] import <bin-or-json-blocks>
  jam [options] export <output-directory-or-file>
  jam [options] fuzz-target [--${ARGS.VERSION}=1] [--${ARGS.INIT_GENESIS_FROM_ANCESTRY}] [socket-path=/tmp/jam_target.sock]

Options:
  --${ARGS.NAME}                Override node name. Affects networking key and db location.
                        [default: ${NODE_DEFAULTS.name}]
  --${ARGS.CONFIG}              Configuration directives. If specified more than once, they are evaluated and merged from left to right.
                        A configuration directive can be a path to a config file, an inline JSON object, a pseudo-jq query or one of predefined configs ['${DEV_CONFIG}', '${DEFAULT_CONFIG}'].
                        Pseudo-jq queries are a way to modify the config using a subset of jq syntax.
                        Example: --${ARGS.CONFIG}=dev --${ARGS.CONFIG}=.chain_spec+={"bootnodes": []}      -- will modify only the bootnodes property of the chain spec (merge).
                        Example: --${ARGS.CONFIG}=dev --${ARGS.CONFIG}=.chain_spec={"bootnodes": []}       -- will replace the entire chain spec property with the provided JSON object.
                        Example: --${ARGS.CONFIG}=dev --${ARGS.CONFIG}=.chain_spec+=bootnodes.json         -- you may also use JSON files in your queries. This one will merge the contents of bootnodes.json onto the chain spec.
                        Example: --${ARGS.CONFIG}=dev --${ARGS.CONFIG}={"chain_spec": { "bootnodes": [] }} -- will merge the provided JSON object onto the "dev" config.
                        Example: --${ARGS.CONFIG}=dev --${ARGS.CONFIG}=bootnodes.json                      -- will merge the contents of bootnodes.json onto the "dev" config.
                        Example: --${ARGS.CONFIG}=custom-config.json                               -- will use the contents of custom-config.json as the config.
                        [default: ${NODE_DEFAULTS.config}]
  --${ARGS.PVM}                 PVM Backend, one of: [${PvmBackendNames.join(", ")}].
                        [default: ${PvmBackendNames[NODE_DEFAULTS.pvm]}]
  --${ARGS.FAST_FORWARD}        (dev mode only) Generate blocks as fast as possible without waiting for real time.
  --${ARGS.INIT_GENESIS_FROM_ANCESTRY}  (fuzz-target only) Skip parent hash and state root verification.
`;

/** Command to execute. */
export enum Command {
  /** Regular node operation. */
  Run = "run",
  /** Run as a development-mode validator. */
  Dev = "dev",
  /** Import the blocks from CLI and finish. */
  Import = "import",
  /** Export blocks to .bin files. */
  Export = "export",
  /** Run as a Fuzz Target. */
  FuzzTarget = "fuzz-target",
}

export type SharedOptions = {
  nodeName: string;
  config: string[];
  pvm: PvmBackend;
};

export type Arguments =
  | CommandArgs<Command.Run, SharedOptions & {}>
  | CommandArgs<
      Command.FuzzTarget,
      SharedOptions & {
        socket: string | null;
        version: 1;
        initGenesisFromAncestry: boolean;
      }
    >
  | CommandArgs<
      Command.Dev,
      SharedOptions & {
        index: U16 | "all";
        isFastForward?: boolean;
      }
    >
  | CommandArgs<
      Command.Import,
      SharedOptions & {
        files: string[];
      }
    >
  | CommandArgs<
      Command.Export,
```
