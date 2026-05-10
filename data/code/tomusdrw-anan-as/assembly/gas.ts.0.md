---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/assembly/gas.ts#L1-L30'
title: assembly/gas.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-05-08T13:25:50+02:00'
last_modified: '2026-05-08T13:25:50+02:00'
chunk_index: 0
chunk_total: 1
content_sha: b0fcbb0a25f7e6155bb69188d0d1f6dbe079e6c2f1004a35342fa040127a34e8
language: typescript
---
`assembly/gas.ts` (lines 1–30)

```typescript
/** Gas type. */
export type Gas = u64;

/** Create a new gas counter instance. */
export function gasCounter(gas: Gas): GasCounter {
  return new GasCounter(gas);
}

export class GasCounter {
  constructor(private gas: Gas) {}

  set(g: Gas): void {
    this.gas = g;
  }

  get(): Gas {
    return this.gas;
  }

  @inline
  sub(g: u32): boolean {
    const cost = u64(g);
    if (cost > this.gas) {
      this.gas = u64(0);
      return true;
    }
    this.gas = this.gas - cost;
    return false;
  }
}
```
