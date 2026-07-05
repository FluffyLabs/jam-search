---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/config-node/node-config.ts#L1-L130
title: packages/jam/config-node/node-config.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 6e7baee355afa5ff462aecb9bdd7e07004b76c9f980b0b3fc678c91444fc0f17
language: typescript
---
`packages/jam/config-node/node-config.ts` (lines 1–130)

```typescript
import fs from "node:fs";
import os from "node:os";
import { PvmBackend } from "@typeberry/config";
import { configs } from "@typeberry/configs";
import { type FromJson, json, parseFromJson } from "@typeberry/json-parser";
import { Logger } from "@typeberry/logger";
import { isBrowser } from "@typeberry/utils";
import { AuthorshipOptions } from "./authorship.js";
import { JipChainSpec } from "./jip-chain-spec.js";

const logger = Logger.new(import.meta.filename, "config");

/** Development config. Will accept unsealed blocks for now. */
export const DEV_TINY_CONFIG = "dev";
export const DEV_FULL_CONFIG = "dev-full";

/** Default config file. */
export const DEFAULT_CONFIG = "default";

export const NODE_DEFAULTS = {
  name: isBrowser() ? "browser" : os.hostname(),
  config: [DEFAULT_CONFIG],
  pvm: PvmBackend.Ananas,
};

/** Chain spec chooser. */
export enum KnownChainSpec {
  /** Tiny chain spec. */
  Tiny = "tiny",
  /** Full chain spec. */
  Full = "full",
}

/** Persistent regular-node database backend. */
export enum RegularStateBackend {
  /** @deprecated lmdb remains available as an explicit fallback, but fjall is the default backend. */
  Lmdb = "lmdb",
  Fjall = "fjall",
}

export const knownChainSpecFromJson = json.fromString((input, ctx): KnownChainSpec => {
  switch (input) {
    case KnownChainSpec.Tiny:
      return KnownChainSpec.Tiny;
    case KnownChainSpec.Full:
      return KnownChainSpec.Full;
    default:
      throw Error(`unknown network flavor: ${input} at ${ctx}`);
  }
}) as FromJson<KnownChainSpec>;

export const regularStateBackendFromJson = json.fromString((input, ctx): RegularStateBackend => {
  switch (input) {
    case RegularStateBackend.Lmdb:
      return RegularStateBackend.Lmdb;
    case RegularStateBackend.Fjall:
      return RegularStateBackend.Fjall;
    default:
      throw Error(`unknown state backend: ${input} at ${ctx}`);
  }
}) as FromJson<RegularStateBackend>;

type NodeConfigurationJson = {
  $schema: string;
  version: number;
  flavor: KnownChainSpec;
  chain_spec: JipChainSpec;
  database_base_path?: string;
  state_backend?: RegularStateBackend;
  authorship: AuthorshipOptions;
};

export class NodeConfiguration {
  static fromJson = json.object<NodeConfigurationJson, NodeConfiguration>(
    {
      $schema: "string",
      version: "number",
      flavor: knownChainSpecFromJson,
      chain_spec: JipChainSpec.fromJson,
      database_base_path: json.optional("string"),
      state_backend: json.optional(regularStateBackendFromJson),
      authorship: AuthorshipOptions.fromJson,
    },
    NodeConfiguration.new,
  );

  static new({
    $schema,
    version,
    flavor,
    chain_spec,
    database_base_path,
    state_backend,
    authorship,
  }: NodeConfigurationJson) {
    if (version !== 1) {
      throw new Error("Only version=1 config is supported.");
    }
    return new NodeConfiguration(
      $schema,
      version,
      flavor,
      chain_spec,
      database_base_path ?? undefined,
      state_backend ?? RegularStateBackend.Fjall,
      authorship,
    );
  }

  private constructor(
    public readonly $schema: string,
    public readonly version: number,
    public readonly flavor: KnownChainSpec,
    public readonly chainSpec: JipChainSpec,
    /** If database path is not provided, we load an in-memory db. */
    public readonly databaseBasePath: string | undefined,
    /** Persistent database backend used when `databaseBasePath` is set. */
    public readonly stateBackend: RegularStateBackend,
    public readonly authorship: AuthorshipOptions,
  ) {}
}

export function loadConfig(config: string[], withRelPath: (p: string) => string): NodeConfiguration {
  logger.log`🔧 Loading config`;
  let mergedJson: AnyJsonObject = {};

  for (const entry of config) {
    logger.log`🔧 Applying '${entry}'`;

    if (entry === DEV_TINY_CONFIG) {
```
