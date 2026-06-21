---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-fjall/root.ts#L1-L110
title: packages/jam/database-fjall/root.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: 1b4f77986d72754b7b047e32e6c32d8395870d3ad1ba33889d64643df801f17d
language: typescript
---
`packages/jam/database-fjall/root.ts` (lines 1–110)

```typescript
import * as fs from "node:fs";
import * as path from "node:path";
import { type Keyspace, open, type Partition } from "@fjall-js/fjall";

export type { Partition };

/**
 * Normalize a value read from fjall (a Node `Buffer`) into a plain `Uint8Array`.
 */
export function toUint8Array(value: Buffer | null): Uint8Array | null {
  if (value === null) {
    return null;
  }
  return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
}

export type FjallRootOptions = {
  /**
   * When set, we skip the durability flush (`persist`) and `close()` does not
   * do the sync-all fsync.
   *
   * Only safe for throwaway databases, like the fuzz target that wipes on every
   * reset.
   */
  ephemeral?: boolean;
  /**
   * Cache size in bytes, shared by all partitions of the keyspace. fjall reads
   * through this cache, so it bounds how much we keep in memory. When not set,
   * fjall uses its own default.
   */
  cacheSizeBytes?: number;
};

/**
 * Thin wrapper over the fjall keyspace.
 *
 * fjall is an LSM-tree: it reads and writes through normal file i/o and keeps
 * only a bounded block cache in memory, so the resident set stays bounded even
 * when the store on disk is big.
 */
export class FjallRoot {
  private constructor(
    private readonly keyspace: Keyspace,
    /** Path of the underlying keyspace directory, used to report on-disk usage. */
    private readonly dbPath: string,
    private readonly options: FjallRootOptions,
  ) {}

  /** Open (or create) a fjall keyspace at the given path. */
  static async open(dbPath: string, options: FjallRootOptions): Promise<FjallRoot> {
    // Forward our options to the binding: `ephemeral` makes `close()` skip the
    // sync-all fsync, `cacheSizeBytes` bounds how much we keep in memory.
    const keyspace = await open(dbPath, {
      ephemeral: options.ephemeral,
      cacheSizeBytes: options.cacheSizeBytes,
    });
    return new FjallRoot(keyspace, dbPath, options);
  }

  /** Open (or create) a partition under this keyspace. */
  async partition(name: string): Promise<Partition> {
    return this.keyspace.partition(name);
  }

  /**
   * Flush the journal to disk so prior writes survive a crash.
   *
   * Call after a logically-complete unit of work (one block, one state commit).
   * A no-op for ephemeral databases.
   */
  async persist(): Promise<void> {
    if (this.options.ephemeral === true) {
      return;
    }
    await this.keyspace.persist();
  }

  /**
   * Size of the keyspace directory on disk, in bytes.
   *
   * Returns `null` when the directory cannot be walked (e.g. not created yet).
   * A fjall keyspace is a directory of partition and journal files, so we sum
   * them recursively.
   */
  sizeInBytes(): number | null {
    try {
      return dirSizeInBytes(this.dbPath);
    } catch {
      return null;
    }
  }

  /** Persist with `sync-all` and release the keyspace handle. */
  async close(): Promise<void> {
    await this.keyspace.close();
  }
}

function dirSizeInBytes(dir: string): number {
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      total += dirSizeInBytes(full);
    } else if (entry.isFile()) {
      total += fs.statSync(full).size;
    }
  }
  return total;
}
```
