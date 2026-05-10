---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/convert/args.ts#L140-L261
title: bin/convert/args.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 1
chunk_total: 3
content_sha: a835c24d1b5996a49dc922499b64f9ae076b131f2cb8561ed8874387381634cd
language: typescript
---
`bin/convert/args.ts` (lines 140–261)

```typescript
      throw new Error(`Invalid output format: '${output}'.`);
  }
}

function parseProcess(processOptions: readonly string[], maybeProcess?: string): string | null {
  if (maybeProcess === undefined) {
    return null;
  }

  if (!processOptions.includes(maybeProcess)) {
    throw new Error(`Incorrect processing option: ${maybeProcess}. Expected one of: ${processOptions}.`);
  }

  return maybeProcess;
}

// TODO [ToDr] Consider sharing that?

function parseOption<S extends string, T>(
  args: minimist.ParsedArgs,
  option: S,
  parser: (v: string) => T | null,
  defaultValue: T,
): Record<S, T> {
  if (args[option] === undefined) {
    return {
      [option]: defaultValue,
    } as Record<S, T>;
  }

  const val = args[option];
  delete args[option];
  if (typeof val !== "string") {
    throw new Error(`Option '--${option}' requires an argument.`);
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

function getProcessFormatAndDestination(
  type: SupportedType,
  maybeProcess: string | undefined,
  maybeOutputFormat: string | undefined,
  maybeDestination: string | undefined,
) {
  const defaultProcess = "";
  const defaultFormat = parseOutputFormat(undefined);
  const processOptions = type.process?.options ?? [];
  // we have all three so it must be in order
  if (maybeProcess !== undefined && maybeOutputFormat !== undefined && maybeDestination !== undefined) {
    const format = parseOutputFormat(maybeOutputFormat);
    const process = parseProcess(processOptions, maybeProcess) ?? defaultProcess;
    const destination = maybeDestination;
    throwIfDumpNotSupported(format, destination);

    return { process, format, destination };
  }

  // we have either:
  // 1. process + format
  // 2. format + destination
  if (maybeProcess !== undefined && maybeOutputFormat !== undefined) {
    // we've got processing first, so easy-peasy
    if (processOptions.includes(maybeProcess)) {
      const format = parseOutputFormat(maybeOutputFormat);
      throwIfDumpNotSupported(format, null);
      return { process: maybeProcess, format, destination: null };
    }
    // first one has to be format then.
    const format = parseOutputFormat(maybeProcess);
    const destination = maybeOutputFormat;
    throwIfDumpNotSupported(format, destination);

    return { process: defaultProcess, format, destination };
  }

  // only one parameter, but it can be either output or processing.
  const destination: string | null = null;
  if (maybeProcess !== undefined) {
    if (processOptions.includes(maybeProcess)) {
      return { process: maybeProcess, format: defaultFormat, destination };
    }
    // now it should be output format, but we want to give a better error message,
    // if user mispelled processing.
    try {
      const format = parseOutputFormat(maybeProcess);
      throwIfDumpNotSupported(format, destination);
      return { process: defaultProcess, format, destination };
    } catch {
      throw new Error(`'${maybeProcess}' is neither output format nor processing parameter.`);
    }
  }

  return { process: defaultProcess, format: defaultFormat, destination };
}

function throwIfDumpNotSupported(format: OutputFormat, destination: string | null) {
  if (destination !== null) {
    if (format === OutputFormat.Print || format === OutputFormat.Repl) {
```
