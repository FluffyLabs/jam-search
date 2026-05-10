---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/library/assembly/refine.ts#L97-L160
title: examples/library/assembly/refine.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 6321183083da6e617562a897b5c3e7a273a4de12c3d8dfa2f3d06bcc856f6e5c
language: typescript
---
`examples/library/assembly/refine.ts` (lines 97–160)

```typescript
    if (e === SpiError.InvalidEntryPoint) {
      logger.warn("refine demo: invalid entry point");
      return ctx.respond(i64(LibraryError.InvalidEntryPoint));
    }
    logger.warn(`refine demo: malformed SPI preimage error=${e}`);
    return ctx.respond(i64(LibraryError.MalformedPreimage));
  }
  const vm = vmR.okay;

  const reason = vm.invoke();
  if (reason !== ExitReason.Halt) {
    const exitArg = vm.getExitArg();
    logger.warn(`refine demo: invoke non-halt reason=${reason} r8=${exitArg}`);
    vm.expunge();
    const errEnc = Encoder.create();
    errEnc.u8(u8(reason));
    errEnc.u64(u64(exitArg));
    return ctx.respond(i64(LibraryError.InvokeFailure), errEnc.finishRaw());
  }

  // Library output convention: on halt, r7 holds a packed `ptrAndLen`
  // (low 32 = ptr, high 32 = len) pointing at the result bytes in inner
  // memory. Caller peeks them out.
  const r7 = vm.getRegister(7);
  const outAddr: u32 = u32(r7 & 0xffffffff);
  const outLen: u32 = u32(r7 >> 32);
  if (outLen > MAX_OUTPUT_LEN) {
    logger.warn(`refine demo: output length ${outLen} exceeds cap ${MAX_OUTPUT_LEN}`);
    vm.expunge();
    return ctx.respond(i64(LibraryError.Oob));
  }

  const outBuf = BytesBlob.zero(outLen);
  if (outLen > 0) {
    const peekR = vm.peek(outAddr, outBuf);
    if (peekR.isError) {
      logger.warn(`refine demo: peek OOB addr=${outAddr} len=${outLen}`);
      vm.expunge();
      return ctx.respond(i64(LibraryError.Oob));
    }
  }
  vm.expunge();
  logger.info(`refine demo: ok, output ${outLen} bytes`);
  return ctx.respond(0, outBuf.raw);
}

function handleAdmin(ctx: RefineContext, rest: BytesBlob): u64 {
  const codec = AdminCommandCodec.create();
  const d = Decoder.fromBytesBlob(rest);
  const r = codec.decode(d);
  if (r.isError) {
    logger.warn("refine admin: decode failure");
    return ctx.respond(i64(LibraryError.AdminMalformed));
  }
  if (!d.isFinished()) {
    logger.warn("refine admin: trailing bytes");
    return ctx.respond(i64(LibraryError.AdminMalformed));
  }
  logger.info(`refine admin: ok, cmd kind=${r.okay!.kind}`);

  const enc = Encoder.create();
  codec.encode(r.okay!, enc);
  return ctx.respond(0, enc.finishRaw());
}
```
