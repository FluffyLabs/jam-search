---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/core/result.ts#L1-L86'
title: sdk/core/result.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-28T15:07:03+02:00'
last_modified: '2026-05-28T15:07:03+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 2aaaa34ed125ef1a8fa3f9897351efce5fe383418a789e39f9a74ff4f4ad6c66
language: typescript
---
`sdk/core/result.ts` (lines 1–86)

```typescript
/** Optional for nullable types. */
export class Optional<T> {
  static some<T>(some: T): Optional<T> {
    return new Optional(true, some);
  }

  static none<T>(): Optional<T> {
    return new Optional(false, null);
  }

  private constructor(
    public readonly isSome: boolean,
    public readonly val: T | null,
  ) {}
}

/** Optional for non-nullable types. */
export class OptionalN<T> {
  static some<T>(some: T): OptionalN<T> {
    return new OptionalN(true, some);
  }

  static none<T>(): OptionalN<T> {
    if (isReference<T>()) {
      return new OptionalN(false, changetype<T>(0));
    }
    return new OptionalN(false, <T>0);
  }

  private constructor(
    public readonly isSome: boolean,
    public readonly val: T,
  ) {}
}

/** Result for nullable okay and numeric error. */
export class Result<Ok, Err> {
  static ok<Ok, Err>(ok: Ok): Result<Ok, Err> {
    return new Result(true, ok, changetype<Err>(0));
  }

  static err<Ok, Err>(error: Err): Result<Ok, Err> {
    return new Result(false, changetype<Ok>(0), error);
  }

  public readonly isError: boolean;

  private constructor(
    public readonly isOkay: boolean,
    public readonly okay: Ok | null,
    public readonly error: Err,
  ) {
    this.isError = !isOkay;
  }
}

/**
 * Result for non-nullable types.
 *
 * Use `Optional` if you need to mix nullable and non-nullable.
 */
export class ResultN<Ok, Err> {
  static ok<Ok, Err>(ok: Ok): ResultN<Ok, Err> {
    if (isReference<Err>()) {
      return new ResultN(true, ok, changetype<Err>(0));
    }
    return new ResultN(true, ok, <Err>0);
  }

  static err<Ok, Err>(error: Err): ResultN<Ok, Err> {
    if (isReference<Ok>()) {
      return new ResultN(false, changetype<Ok>(0), error);
    }
    return new ResultN(false, <Ok>0, error);
  }

  public readonly isError: boolean;

  private constructor(
    public readonly isOkay: boolean,
    public readonly okay: Ok,
    public readonly error: Err,
  ) {
    this.isError = !isOkay;
  }
}
```
