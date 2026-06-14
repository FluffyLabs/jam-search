---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/refine/machine.ts#L116-L159
title: sdk/jam/refine/machine.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-12T11:39:19+02:00'
last_modified: '2026-06-12T11:39:19+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 4e6d8fa13394693b9987b7f2aeea5eb687fc1b04cd761679ac424b2caa5a35cd
language: typescript
---
`sdk/jam/refine/machine.ts` (lines 116–159)

```typescript
    const result = ecalli_peek(this.id, dest.ptr(), source, dest.length);
    if (result === EcalliResult.WHO) panic("peek: unknown machine ID (WHO)");
    if (result === EcalliResult.OOB) return ResultN.err<bool, OutOfBounds>(OutOfBounds.OutOfBounds);
    return ResultN.ok<bool, OutOfBounds>(true);
  }

  /** Write data into inner machine memory. */
  poke(dest: u32, data: BytesBlob): ResultN<bool, OutOfBounds> {
    const result = ecalli_poke(this.id, data.ptr(), dest, data.length);
    if (result === EcalliResult.WHO) panic("poke: unknown machine ID (WHO)");
    if (result === EcalliResult.OOB) return ResultN.err<bool, OutOfBounds>(OutOfBounds.OutOfBounds);
    return ResultN.ok<bool, OutOfBounds>(true);
  }

  /** Set page access permissions for inner machine memory. */
  pages(startPage: u32, pageCount: u32, access: PageAccess): void {
    const result = ecalli_pages(this.id, startPage, pageCount, access);
    if (result === EcalliResult.WHO) panic("pages: unknown machine ID (WHO)");
    if (result === EcalliResult.HUH) panic("pages: invalid access type (HUH)");
  }

  /**
   * Run the inner PVM machine.
   *
   * The InvokeIo structure is read before execution (gas limit + initial registers)
   * and written after (gas remaining + final registers). The same InvokeIo is
   * returned inside InvokeOutcome for convenience.
   */
  invoke(io: InvokeIo): InvokeOutcome {
    const outR8 = BytesBlob.zero(8);
    const result = ecalli_invoke(this.id, io.buf.ptr(), outR8.ptr());
    if (result === EcalliResult.WHO) panic("invoke: unknown machine ID (WHO)");
    const r8 = load<i64>(outR8.raw.dataStart);
    const reason: ExitReason = u32(result);
    return InvokeOutcome.create(reason, r8, io);
  }

  /** Destroy the inner machine and return the host result (hash). */
  expunge(): i64 {
    const result = ecalli_expunge(this.id);
    if (result === EcalliResult.WHO) panic("expunge: unknown machine ID (WHO)");
    return result;
  }
}
```
