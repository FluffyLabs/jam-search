---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/library/assembly/admin.ts#L1-L105
title: examples/library/assembly/admin.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-07-15T12:15:02+02:00'
last_modified: '2026-07-15T12:15:02+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 1ab67e9190114dfba5280c030a86600c739131fa8bffaba50916583d01cecc31
language: typescript
---
`examples/library/assembly/admin.ts` (lines 1–105)

```typescript
import { Bytes32, BytesBlob, DecodeError, Decoder, Encoder, Result, TryDecode, TryEncode } from "@fluffylabs/as-lan";

export enum AdminCommandKind {
  SetMapping = 0,
  RemoveMapping = 1,
  Solicit = 2,
  Forget = 3,
  Provide = 4,
}

/**
 * Tagged union of library admin commands.
 *
 * Valid fields per kind:
 *  - SetMapping:    name, hash, length
 *  - RemoveMapping: name
 *  - Solicit:       hash, length
 *  - Forget:        hash, length
 *  - Provide:       preimage
 */
export class AdminCommand {
  static setMapping(name: BytesBlob, hash: Bytes32, length: u32): AdminCommand {
    return new AdminCommand(AdminCommandKind.SetMapping, name, hash, length, null);
  }

  static removeMapping(name: BytesBlob): AdminCommand {
    return new AdminCommand(AdminCommandKind.RemoveMapping, name, null, 0, null);
  }

  static solicit(hash: Bytes32, length: u32): AdminCommand {
    return new AdminCommand(AdminCommandKind.Solicit, null, hash, length, null);
  }

  static forget(hash: Bytes32, length: u32): AdminCommand {
    return new AdminCommand(AdminCommandKind.Forget, null, hash, length, null);
  }

  static provide(preimage: BytesBlob): AdminCommand {
    return new AdminCommand(AdminCommandKind.Provide, null, null, 0, preimage);
  }

  private constructor(
    public readonly kind: AdminCommandKind,
    public readonly name: BytesBlob | null,
    public readonly hash: Bytes32 | null,
    public readonly length: u32,
    public readonly preimage: BytesBlob | null,
  ) {}
}

export class AdminCommandCodec implements TryDecode<AdminCommand>, TryEncode<AdminCommand> {
  static create(): AdminCommandCodec {
    return new AdminCommandCodec();
  }

  private constructor() {}

  encode(value: AdminCommand, e: Encoder): void {
    e.u8(u8(value.kind));
    if (value.kind === AdminCommandKind.SetMapping) {
      e.bytesVarLen(value.name!);
      e.bytesFixLen(value.hash!.bytes);
      e.u32(value.length);
    } else if (value.kind === AdminCommandKind.RemoveMapping) {
      e.bytesVarLen(value.name!);
    } else if (value.kind === AdminCommandKind.Solicit || value.kind === AdminCommandKind.Forget) {
      e.bytesFixLen(value.hash!.bytes);
      e.u32(value.length);
    } else if (value.kind === AdminCommandKind.Provide) {
      e.bytesVarLen(value.preimage!);
    }
  }

  decode(d: Decoder): Result<AdminCommand, DecodeError> {
    const tag = d.u8();
    if (d.isError) return Result.err<AdminCommand, DecodeError>(DecodeError.MissingBytes);

    if (tag === u8(AdminCommandKind.SetMapping)) {
      const name = d.bytesVarLen();
      const hashBytes = d.bytesFixLen(32);
      const length = d.u32();
      if (d.isError) return Result.err<AdminCommand, DecodeError>(DecodeError.MissingBytes);
      return Result.ok<AdminCommand, DecodeError>(
        AdminCommand.setMapping(name, Bytes32.wrapUnchecked(hashBytes.raw), length),
      );
    }
    if (tag === u8(AdminCommandKind.RemoveMapping)) {
      const name = d.bytesVarLen();
      if (d.isError) return Result.err<AdminCommand, DecodeError>(DecodeError.MissingBytes);
      return Result.ok<AdminCommand, DecodeError>(AdminCommand.removeMapping(name));
    }
    if (tag === u8(AdminCommandKind.Solicit)) {
      const hashBytes = d.bytesFixLen(32);
      const length = d.u32();
      if (d.isError) return Result.err<AdminCommand, DecodeError>(DecodeError.MissingBytes);
      return Result.ok<AdminCommand, DecodeError>(AdminCommand.solicit(Bytes32.wrapUnchecked(hashBytes.raw), length));
    }
    if (tag === u8(AdminCommandKind.Forget)) {
      const hashBytes = d.bytesFixLen(32);
      const length = d.u32();
      if (d.isError) return Result.err<AdminCommand, DecodeError>(DecodeError.MissingBytes);
      return Result.ok<AdminCommand, DecodeError>(AdminCommand.forget(Bytes32.wrapUnchecked(hashBytes.raw), length));
    }
    if (tag === u8(AdminCommandKind.Provide)) {
      const preimage = d.bytesVarLen();
```
