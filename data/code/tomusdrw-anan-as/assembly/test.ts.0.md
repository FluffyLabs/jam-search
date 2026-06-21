---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/assembly/test.ts#L1-L48'
title: assembly/test.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-06-15T09:40:01+02:00'
last_modified: '2026-06-15T09:40:01+02:00'
chunk_index: 0
chunk_total: 1
content_sha: ba269aaaaac59c6e75f2a6e2efdb120bb9415dd6014ce051981853a4c15e2b2b
language: typescript
---
`assembly/test.ts` (lines 1–48)

```typescript
export class Test {
  constructor(
    public name: string,
    public ptr: (assert: Assert) => Assert,
  ) {}
}

export class Assert {
  public isOkay: boolean = true;
  public errors: string[] = [];

  static todo(): Assert {
    const r = new Assert();
    r.fail("Not implemented yet!");
    return r;
  }

  fail(msg: string): void {
    this.isOkay = false;
    this.errors.push(msg);
  }

  isArrayEqual<T>(actual: T[], expected: T[], msg: string = ""): void {
    this.isEqual(actual.length, expected.length, `length @ ${msg}`);
    this.isEqual(actual.join(",").toString(), expected.join(",").toString(), msg);
  }

  isEqual<T>(actual: T, expected: T, msg: string = ""): void {
    if (actual !== expected) {
      this.isOkay = false;
      const actualDisplay = isInteger(actual) ? `${actual} (0x${i64(actual).toString(16)})` : `${actual}`;
      const expectDisplay = isInteger(expected) ? `${expected} (0x${i64(expected).toString(16)})` : `${expected}`;
      this.errors.push(`Got: '${actualDisplay}', expected: '${expectDisplay}' @ ${msg}`);
    }
  }

  isNotEqual<T>(actual: T, unexpected: T, msg: string = ""): void {
    if (actual === unexpected) {
      this.isOkay = false;
      const actualDisplay = isInteger(actual) ? `${actual} (0x${i64(actual).toString(16)})` : `${actual}`;
      this.errors.push(`Expected value to differ from: '${actualDisplay}' @ ${msg}`);
    }
  }
}

export function test(name: string, ptr: (assert: Assert) => Assert): Test {
  return new Test(name, ptr);
}
```
