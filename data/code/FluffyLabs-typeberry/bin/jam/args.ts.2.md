---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/jam/args.ts#L214-L338'
title: bin/jam/args.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 016d9d053463958c61f79f37a3c6eab40e14ce718469a8a638eda4166fbb1351
language: typescript
---
`bin/jam/args.ts` (lines 214–338)

```typescript
        command: Command.Export,
        args: {
          ...data,
          output: withRelPath(output),
        },
      };
    }
    default: {
      args._.unshift(command);
      assertNoMoreArgs(args);
    }
  }

  throw new Error(`Invalid arguments: ${JSON.stringify(args)}`);
}

function parseStringOption<S extends string, T>(
  args: minimist.ParsedArgs,
  option: S,
  parser: (v: string) => T | null,
  defaultValue: T,
): Record<S, T> {
  return parseValueOption(args, option, "string", parser, defaultValue);
}

function parseValueOptionAsArray<X, S extends string, T>(
  args: minimist.ParsedArgs,
  option: S,
  typeOfX: "number" | "string",
  parser: (v: X) => T | null,
  defaultValue: T[],
): Record<S, T[]> {
  if (args[option] === undefined) {
    return {
      [option]: defaultValue,
    } as Record<S, T[]>;
  }

  const vals: unknown[] = Array.isArray(args[option]) ? args[option] : [args[option]];

  delete args[option];

  const parsedVals: T[] = vals.reduce((result: T[], val: unknown) => {
    const valType = typeof val;
    if (valType !== typeOfX) {
      throw new Error(`Option '--${option}' requires an argument of type: ${typeOfX}, got: ${valType}.`);
    }
    const parsed = parser(val as X);
    if (parsed !== null) {
      result.push(parsed);
    }
    return result;
  }, []);

  return {
    [option]: parsedVals.length > 0 ? parsedVals : defaultValue,
  } as Record<S, T[]>;
}

function parseValueOption<X, S extends string, T>(
  args: minimist.ParsedArgs,
  option: S,
  typeOfX: "number" | "string",
  parser: (v: X) => T | null,
  defaultValue: T,
): Record<S, T> {
  const val = args[option];
  if (val === undefined) {
    return {
      [option]: defaultValue,
    } as Record<S, T>;
  }

  if (Array.isArray(val)) {
    throw new Error(`Option '--${option}' has been specified more than once. Only one value was expected.`);
  }

  delete args[option];
  const valType = typeof val;
  if (valType !== typeOfX) {
    throw new Error(`Option '--${option}' requires an argument of type: ${typeOfX}, got: ${valType}.`);
  }
  try {
    const parsed = parser(val);
    return {
      [option]: parsed ?? defaultValue,
    } as Record<S, T>;
  } catch (e) {
    throw new Error(`Invalid value '${val}' for option '${option}': ${e}`);
  }
}

function assertNoMoreArgs(args: minimist.ParsedArgs) {
  const keys = Object.keys(args);
  const keysLeft = keys.filter((x) => x !== "_" && x !== "--");

  if (args._.length > 0) {
    throw new Error(`Unexpected command: '${args._[0]}'`);
  }

  if ((args["--"]?.length ?? 0) > 0) {
    throw new Error(`Unexpected parameters: '${args["--"]?.[0]}'...`);
  }

  if (keysLeft.length > 0) {
    throw new Error(`Unrecognized options: '${keysLeft}'`);
  }
}

export type CommandArgs<T extends Command, Args> = {
  command: T;
  args: Args;
};

function parseFuzzVersion(v: string | number): 1 | null {
  if (v === "") {
    return null;
  }

  const parsed = Number(v);
  if (parsed === 1) {
    return parsed;
  }
  throw new Error(`Invalid fuzzer version: ${v}. Must be 1`);
}
```
