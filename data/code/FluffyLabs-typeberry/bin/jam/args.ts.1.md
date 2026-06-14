---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/jam/args.ts#L78-L205'
title: bin/jam/args.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 1
chunk_total: 3
content_sha: 07753c63ca02770384a0a592179353ecccd9181ab2760bab4415ab6cae71fa2c
language: typescript
---
`bin/jam/args.ts` (lines 78–205)

```typescript
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
      SharedOptions & {
        output: string;
      }
    >;

export function parseSharedOptions(
  args: minimist.ParsedArgs,
  defaultConfig: string[] = NODE_DEFAULTS.config,
): SharedOptions {
  const { name } = parseStringOption(args, ARGS.NAME, (v) => v, NODE_DEFAULTS.name);
  const { config } = parseValueOptionAsArray(
    args,
    ARGS.CONFIG,
    "string",
    (v: string) => (v === "" ? null : v),
    defaultConfig,
  );
  const { pvm } = parseStringOption(
    args,
    ARGS.PVM,
    (v) => {
      const pvm = PvmBackendNames.indexOf(v);
      if (pvm >= 0) {
        return pvm as PvmBackend;
      }
      throw Error(`Use one of ${PvmBackendNames.join(", ")}`);
    },
    NODE_DEFAULTS.pvm,
  );

  return {
    nodeName: name,
    config,
    pvm,
  };
}

export function parseArgs(input: string[], withRelPath: (v: string) => string): Arguments | null {
  const args = minimist(input, {
    boolean: [ARGS.FAST_FORWARD, ARGS.INIT_GENESIS_FROM_ANCESTRY],
  });

  if (args[ARGS.FAST_FORWARD] === false) {
    delete args[ARGS.FAST_FORWARD];
  }
  if (args[ARGS.INIT_GENESIS_FROM_ANCESTRY] === false) {
    delete args[ARGS.INIT_GENESIS_FROM_ANCESTRY];
  }

  const command = args._.shift() ?? Command.Run;
  const isHelp = args.help !== undefined;
  if (isHelp) {
    return null;
  }

  switch (command) {
    case Command.Run: {
      const data = parseSharedOptions(args);
      assertNoMoreArgs(args);
      return { command: Command.Run, args: data };
    }
    case Command.Dev: {
      const shared = parseSharedOptions(args, [DEV_TINY_CONFIG]);
      // Dev mode always needs a base dev config. If the user only provided jq-query
      // modifiers (e.g. `--config=.database_base_path=...`), keep the tiny dev config
      // as the base and layer the modifiers on top — otherwise the query would be
      // applied to an empty config and fail. A provided base config / file replaces
      // it as usual.
      const hasBaseConfig = shared.config.some((c) => !c.startsWith("."));
      const data = hasBaseConfig ? shared : { ...shared, config: [DEV_TINY_CONFIG, ...shared.config] };
      const indexOrAll = args._.shift();
      if (indexOrAll === undefined) {
        throw new Error("Missing dev-validator index.");
      }

      const isFastForward = args[ARGS.FAST_FORWARD] === true;
      delete args[ARGS.FAST_FORWARD];

      if (indexOrAll === "all") {
        assertNoMoreArgs(args);
        return { command: Command.Dev, args: { ...data, index: indexOrAll, isFastForward } };
      }
      const numIndex = Number(indexOrAll);
      if (!isU16(numIndex)) {
        throw new Error(`Invalid dev-validator index: ${numIndex}, need U16 or "all"`);
      }
      assertNoMoreArgs(args);
      return { command: Command.Dev, args: { ...data, index: numIndex, isFastForward } };
    }
    case Command.FuzzTarget: {
      const data = parseSharedOptions(args);
      const { version } = parseValueOption(args, ARGS.VERSION, "number", parseFuzzVersion, 1);
      const initGenesisFromAncestry = args[ARGS.INIT_GENESIS_FROM_ANCESTRY] === true;
      delete args[ARGS.INIT_GENESIS_FROM_ANCESTRY];
      if (initGenesisFromAncestry) {
        logger.warn`Init genesis from ancestry is enabled. Parent hash and state root verification is skipped.`;
      }
      const socket = args._.shift() ?? null;
      assertNoMoreArgs(args);
      return {
        command: Command.FuzzTarget,
        args: {
          ...data,
          version,
          socket,
          initGenesisFromAncestry,
        },
      };
    }
    case Command.Import: {
      const data = parseSharedOptions(args);
      const files = args._.map((f) => withRelPath(f));
      args._ = [];
      assertNoMoreArgs(args);
      return {
```
