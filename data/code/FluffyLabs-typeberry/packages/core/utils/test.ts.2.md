---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/utils/test.ts#L230-L280
title: packages/core/utils/test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 2
chunk_total: 3
content_sha: f84f84fcb2166fae4900eae07f0bf3f7f967bc0a60ad89289e0fe1fcdb2217be
language: typescript
---
`packages/core/utils/test.ts` (lines 230–280)

```typescript
    if (this.errors.length === 0) {
      return this;
    }

    const addContext = (e: unknown, context: string[]) => {
      const preamble = `❌  DATA MISMATCH @ ${context.join(".")}\n`;
      if (e instanceof Error) {
        if (context.length > 0) {
          e.stack = `${preamble}${e.stack}`;
        }
        return e;
      }
      return new Error(`${preamble}${e}`);
    };

    if (this.errors.length === 1) {
      const { context, e } = this.errors[0];
      throw addContext(e, context);
    }

    const noOfErrors = this.errors.length;
    const stack = this.errors
      .map(({ context, e }) => addContext(e, context))
      .map((e, idx) => `===== ${idx + 1}/${noOfErrors} =====\n ${idx !== 0 ? trimStack(e.stack) : e.stack}`)
      .join("\n");

    const e = new Error();
    e.stack = stack;
    throw e;
  }
}

function trimStack(stack = "") {
  const firstAt = /([\s\S]+?)\s+at /;
  const res = stack.match(firstAt);
  if (res !== null) {
    return res[1];
  }
  return stack;
}

function isResult(x: unknown): x is Result<unknown, unknown> {
  return (
    x !== null &&
    typeof x === "object" &&
    "isOk" in x &&
    "isError" in x &&
    typeof x.isOk === "boolean" &&
    typeof x.isError === "boolean"
  );
}
```
