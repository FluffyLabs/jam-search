---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/tci/args.ts#L124-L144'
title: bin/tci/args.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 1
chunk_total: 2
content_sha: d53604cdecc8cd49f8af80c2531df4dfc184e4c6604e407e3ef68a790a4fa1b8
language: typescript
---
`bin/tci/args.ts` (lines 124–144)

```typescript
      [flag]: parsed,
    } as Record<S, T>;
  } catch (e) {
    throw new Error(`Invalid value '${value}' for flag '--${flag}': ${e}`);
  }
}

function assertNoMoreArgs(args: minimist.ParsedArgs): void {
  const keys = Object.keys(args);
  const keysLeft = keys.filter((k) => k !== "_" && k !== "--");

  if (args._.length > 0) {
    throw new Error(`Unexpected commands: ${args._.join(", ")}`);
  }
  if ((args["--"]?.length ?? 0) > 0) {
    throw new Error(`Unexpected parameters: ${args["--"]?.join(", ")}`);
  }
  if (keysLeft.length > 0) {
    throw new Error(`Unrecognized flags: ${keysLeft.join(", ")}`);
  }
}
```
