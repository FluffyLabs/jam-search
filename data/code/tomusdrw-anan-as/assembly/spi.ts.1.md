---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/assembly/spi.ts#L118-L178'
title: assembly/spi.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-06-12T09:48:57+02:00'
last_modified: '2026-06-12T09:48:57+02:00'
chunk_index: 1
chunk_total: 2
content_sha: d87283a1be91d620ba5e97d4d60709b40f9ea8adccd747846cdf5f48a835043a
language: typescript
---
`assembly/spi.ts` (lines 118–178)

```typescript
 *   Address          Region                    Access   Notes
 *  ─────────────────────────────────────────────────────────────────
 *  0x0000_0000  ┌─────────────────────────┐
 *               │                         │
 *               │   Reserved / Guard      │   None    64 KB (Z_Z)
 *               │   (inaccessible)        │
 *               │                         │
 *  0x0001_0000  ├─────────────────────────┤  ◄─── SEGMENT_SIZE
 *               │                         │
 *               │   Read-Only Data (RO)   │   Read    Code constants,
 *               │                         │           string literals
 *               │                         │
 *  0x0002_0000+ ├─────────────────────────┤  ◄─── 2*SEGMENT_SIZE + align(roLen)
 *               │                         │
 *               │   Read-Write Data (RW)  │   Write   Initialized globals
 *               │                         │
 *               ├ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤  ◄─── heapStart + align(rwLen)
 *               │                         │
 *               │   Heap (Zero-init)      │   Write   Dynamic allocation
 *               │   (heapPages * 4KB)     │           sbrk grows here
 *               │                         │
 *               ├─────────────────────────┤  ◄─── sbrk pointer
 *               │                         │
 *               │         ░░░░░░░         │
 *               │    Unmapped / Guard     │   None    Grows towards each other
 *               │         ░░░░░░░         │
 *               │                         │
 *  stackStart   ├─────────────────────────┤  ◄─── STACK_SEGMENT_END - stackLen
 *               │                         │
 *               │        Stack            │   Write   Grows downward (↓)
 *               │    (stackSize aligned)  │           r1 = stack pointer
 *               │                         │
 *  0xFEFE_0000  ├─────────────────────────┤  ◄─── STACK_SEGMENT_END
 *               │                         │
 *               │   Guard (64 KB)         │   None    Separates stack/args
 *               │                         │
 *  0xFEFF_0000  ├─────────────────────────┤  ◄─── ARGS_SEGMENT_START
 *               │                         │
 *               │   Arguments (RO)        │   Read    r7 = args pointer
 *               │   (up to 16 MB)         │           r8 = args length
 *               │                         │
 *               ├─────────────────────────┤  ◄─── ARGS_SEGMENT_START + argsLen
 *               │                         │
 *               │   Guard (64 KB)         │   None    Top guard region
 *               │                         │
 *  0xFFFF_FFFF  └─────────────────────────┘
 *
 *  Initial Register State:
 *  ┌──────┬──────────────────┬─────────────────────────┐
 *  │  r0  │  0xFFFF_0000     │  (reserved)             │
 *  │  r1  │  STACK_SEG_END   │  Stack pointer (SP)     │
 *  │  r7  │  ARGS_SEG_START  │  Arguments pointer      │
 *  │  r8  │  args.length     │  Arguments length       │
 *  └──────┴──────────────────┴─────────────────────────┘
 *
 *  Key Constants:
 *    Z_Z (SEGMENT_SIZE) = 2^16 = 64 KB
 *    Z_P (PAGE_SIZE)    = 2^12 =  4 KB
 *    Z_I (MAX_ARGS_LEN) = 2^24 = 16 MB
 * ```
 */
```
