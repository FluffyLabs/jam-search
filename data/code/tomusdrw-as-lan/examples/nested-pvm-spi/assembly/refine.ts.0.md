---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/nested-pvm-spi/assembly/refine.ts#L1-L94
title: examples/nested-pvm-spi/assembly/refine.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-12T11:39:19+02:00'
last_modified: '2026-06-12T11:39:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 3cc01016055d6bb3ff5ba913fddbd0e39fe0130dc573cd0d3cfef2e36c4cb53a
language: typescript
---
`examples/nested-pvm-spi/assembly/refine.ts` (lines 1–94)

```typescript
import { AccumulateContext, Bytes32, BytesBlob, Decoder, ExitReason, Logger, RefineContext } from "@fluffylabs/as-lan";
import { AS_ADD_JAM_HEX } from "./as-add-jam";

const logger: Logger = Logger.create("nested-spi");

/**
 * Embedded SPI program (as-add.jam) as a `BytesBlob`.
 *
 * Lazily parsed once and cached — `parseBlob` allocates, so doing it at
 * module scope would happen on every service load.
 */
let _asAddBlob: BytesBlob | null = null;
function asAddBlob(): BytesBlob {
  if (_asAddBlob === null) {
    _asAddBlob = BytesBlob.parseBlob(`0x${AS_ADD_JAM_HEX}`).okay!;
  }
  return _asAddBlob!;
}

/**
 * Strip the JAM Standard-Program metadata prefix, leaving the raw SPI blob.
 *
 * The format is `varU32 metadataLength` + `metadata` + remaining SPI bytes.
 * Returns the SPI portion, or `null` if the prefix is malformed.
 */
function stripMetadataPrefix(program: BytesBlob): BytesBlob | null {
  const d = Decoder.fromBytesBlob(program);
  const metadataLength = d.varU32();
  if (d.isError) return null;
  d.skip(metadataLength);
  if (d.isError) return null;
  // Remaining bytes = SPI blob. Slice the underlying buffer without copy.
  const consumed = d.bytesRead();
  return BytesBlob.wrap(program.raw.subarray(consumed));
}

/**
 * Refine entry point: load the embedded SPI program, run it until Halt,
 * and report what happened.
 *
 * This is a smoke-test: the in-process mock `invoke` ecalli does not
 * execute PVM code, so the real add never happens. Still, the exercise
 * covers end-to-end decoding, metadata stripping, `pages`/`poke` setup,
 * and the invoke loop structure.
 */
export function refine(ptr: u32, len: u32): u64 {
  const ctx = RefineContext.create();
  const args = ctx.parseArgs(ptr, len);
  logger.info(`refine: service=${args.serviceId} payloadLen=${args.payload.length}`);

  const program = asAddBlob();
  const spi = stripMetadataPrefix(program);
  if (spi === null) {
    logger.warn("refine: malformed program prefix");
    return ctx.respond(-1);
  }
  logger.debug(`refine: SPI blob ${spi.length} bytes (stripped from ${program.length})`);

  // Use the Result-returning variant because the program is embedded but
  // conceptually could be any blob — this shows the recommended API for
  // real-world use (preimages, peer input).
  const vmR = ctx.nestedPvmFromSpiChecked(spi, args.payload, /*gas=*/ 1_000_000);
  if (vmR.isError) {
    logger.warn(`refine: SPI setup failed error=${vmR.error}`);
    return ctx.respond(-1);
  }
  const vm = vmR.okay;

  // One invoke is enough for a smoke test — a real service would loop on
  // ExitReason.Host and dispatch host calls by index via vm.getExitArg().
  const reason = vm.invoke();
  if (reason === ExitReason.Halt) {
    const r7 = vm.getRegister(7);
    logger.info(`refine: halted, r7=${r7}`);
    vm.expunge();
    const out = new Uint8Array(32);
    for (let i = 0; i < 8; i++) out[i] = u8((r7 >> u64(i * 8)) & 0xff);
    return ctx.respond(0, out);
  }
  logger.warn(`refine: non-halt reason=${reason} arg=${vm.getExitArg()}`);
  vm.expunge();
  return ctx.respond(-1);
}

/**
 * Accumulate is a no-op — this example only exercises refine. We still
 * need to export it so the service ABI is complete.
 */
export function accumulate(ptr: u32, len: u32): u64 {
  const ctx = AccumulateContext.create();
  const args = ctx.parseArgs(ptr, len);
  logger.info(`accumulate: slot=${args.slot} service=${args.serviceId}`);
  return ctx.yieldHash(Bytes32.wrapUnchecked(new Uint8Array(32)));
}
```
