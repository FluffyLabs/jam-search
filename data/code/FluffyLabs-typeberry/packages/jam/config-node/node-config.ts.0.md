---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/config-node/node-config.ts#L1-L119
title: packages/jam/config-node/node-config.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 2
content_sha: a4bf584c98f81432bdb4199bcd6801bb3f4a25bfa1dd393cee78c5824e09c504
language: typescript
---
`packages/jam/config-node/node-config.ts` (lines 1–119)

```typescript
import fs from "node:fs";
import os from "node:os";
import type { JsonObject } from "@typeberry/block-json";
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

export class NodeConfiguration {
  static fromJson = json.object<JsonObject<NodeConfiguration>, NodeConfiguration>(
    {
      $schema: "string",
      version: "number",
      flavor: knownChainSpecFromJson,
      chain_spec: JipChainSpec.fromJson,
      database_base_path: json.optional("string"),
      authorship: AuthorshipOptions.fromJson,
    },
    NodeConfiguration.new,
  );

  static new({ $schema, version, flavor, chain_spec, database_base_path, authorship }: JsonObject<NodeConfiguration>) {
    if (version !== 1) {
      throw new Error("Only version=1 config is supported.");
    }
    return new NodeConfiguration($schema, version, flavor, chain_spec, database_base_path ?? undefined, authorship);
  }

  private constructor(
    public readonly $schema: string,
    public readonly version: number,
    public readonly flavor: KnownChainSpec,
    public readonly chainSpec: JipChainSpec,
    /** If database path is not provided, we load an in-memory db. */
    public readonly databaseBasePath: string | undefined,
    public readonly authorship: AuthorshipOptions,
  ) {}
}

export function loadConfig(config: string[], withRelPath: (p: string) => string): NodeConfiguration {
  logger.log`🔧 Loading config`;
  let mergedJson: AnyJsonObject = {};

  for (const entry of config) {
    logger.log`🔧 Applying '${entry}'`;

    if (entry === DEV_TINY_CONFIG) {
      mergedJson = structuredClone(configs.devTiny); // clone to avoid mutating the original config. not doing a merge since dev and default should theoretically replace all properties.
      continue;
    }

    if (entry === DEV_FULL_CONFIG) {
      mergedJson = structuredClone(configs.devFull); // clone to avoid mutating the original config. not doing a merge since dev and default should theoretically replace all properties.
      continue;
    }

    if (entry === DEFAULT_CONFIG) {
      mergedJson = structuredClone(configs.default);
      continue;
    }

    // try to parse as JSON
    try {
      const parsed = JSON.parse(entry);
      deepMerge(mergedJson, parsed);
      continue;
    } catch {}

    // if not, try to load as file
    if (entry.indexOf("=") === -1 && entry.endsWith(".json")) {
      try {
        const configFile = fs.readFileSync(withRelPath(entry), "utf8");
        const parsed = JSON.parse(configFile);
        deepMerge(mergedJson, parsed);
      } catch (e) {
        throw new Error(`Unable to load config from ${entry}: ${e}`);
      }
    } else {
      // finally try to process as a pseudo-jq query
      try {
        processQuery(mergedJson, entry, withRelPath);
      } catch (e) {
```
