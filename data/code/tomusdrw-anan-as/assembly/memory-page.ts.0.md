---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/assembly/memory-page.ts#L1-L82'
title: assembly/memory-page.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-07-15T12:24:45+02:00'
last_modified: '2026-07-15T12:24:45+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 7d184671d55d764517c69b386acb4a0d4d2f17596a73e6c4b5980b275974a3e4
language: typescript
---
`assembly/memory-page.ts` (lines 1–82)

```typescript
import { portable } from "./portable";

export type PageIndex = u32;
export type ArenaId = u32;

/** `Z_P`: https://graypaper.fluffylabs.dev/#/ab2cdbd/44d20044d200?v=0.7.2 */
export const PAGE_SIZE: u32 = 2 ** 12; // 4_096
export const PAGE_SIZE_SHIFT: u32 = 12;

/** `Z_Z`: https://graypaper.fluffylabs.dev/#/ab2cdbd/2daf002daf00?v=0.7.2 */
export const SEGMENT_SIZE: u32 = 2 ** 16; //65_536
export const SEGMENT_SIZE_SHIFT: u32 = 16;

/** https://graypaper.fluffylabs.dev/#/ab2cdbd/254401254a01?v=0.7.2 */
export const RESERVED_MEMORY: u32 = 2 ** 16;
export const RESERVED_PAGES: u32 = RESERVED_MEMORY / PAGE_SIZE; // 16

export enum Access {
  None = 0,
  Read = 1,
  Write = 2,
}

export class Page {
  constructor(
    public readonly access: Access,
    public readonly raw: RawPage,
  ) {}

  @inline
  can(access: Access): boolean {
    return this.access === Access.Write || this.access === access;
  }
}

export class RawPage {
  constructor(
    public readonly id: ArenaId,
    public page: Uint8Array,
  ) {}

  @inline
  get data(): Uint8Array {
    return this.page;
  }
}

export class Arena {
  private free: RawPage[];
  private readonly arenaBytes: u32;
  private extraPageIndex: ArenaId;

  constructor(pageCount: u32) {
    this.arenaBytes = PAGE_SIZE * pageCount;
    this.free = [];
    this.extraPageIndex = pageCount;
    const data = new ArrayBuffer(this.arenaBytes);
    for (let i = 0; i < <i32>pageCount; i++) {
      this.free.unshift(new RawPage(i, portable.uint8ArrayView(data, i * PAGE_SIZE, PAGE_SIZE)));
    }
  }

  acquire(): RawPage {
    if (this.free.length > 0) {
      return this.free.pop();
    }
    // no pages!
    const allocatedMemory = this.extraPageIndex * PAGE_SIZE;
    // print warning only once
    if (allocatedMemory === this.arenaBytes) {
      console.log("Warning: Run out of pages! Allocating.");
    }

    const data = new Uint8Array(PAGE_SIZE);
    this.extraPageIndex += 1;
    return new RawPage(this.extraPageIndex, data);
  }

  release(page: RawPage): void {
    this.free.push(page);
  }
}
```
