---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/library/assembly/refine.ts#L1-L101
title: examples/library/assembly/refine.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-24T22:53:46+01:00'
last_modified: '2026-04-24T22:53:46+01:00'
chunk_index: 0
chunk_total: 2
content_sha: 5dee80cb08a2a8b5ffa2cd65fcc77d983099c0f14c212b1a00c91e80145e5866
language: typescript
---
`examples/library/assembly/refine.ts` (lines 1–101)

```typescript
import { BytesBlob, Decoder, Encoder, ExitReason, Logger, RefineContext, SpiError } from "@fluffylabs/as-lan";
import { AdminCommandCodec } from "./admin";
import { LibraryEntryCodec, libraryKeyFromBlob } from "./storage";

/**
 * Error codes returned in `Response.result` (decoded by the caller).
 *
 * Values live in the `-100..-107` range to avoid overlap with `EcalliResult`
 * sentinels (NONE=-1, OOB=-3, WHO=-4, FULL=-5, HUH=-9) that may appear in the
 * same field when raw ecalli results leak through.
 */
export enum LibraryError {
  UnknownLib = -100,
  PreimageMiss = -101,
  InvalidEntryPoint = -102,
  InvokeFailure = -103,
  Oob = -104,
  AdminMalformed = -105,
  Parse = -106,
  MalformedPreimage = -107,
}

// Cap on the output length the inner PVM may report in r7. Bounds the
// response-buffer allocation so a buggy or malicious library cannot force
// a multi-GB allocation before peek() gets a chance to surface the error.
const MAX_OUTPUT_LEN: u32 = 64 * 1024;

const logger: Logger = Logger.create("library");

export function refine(ptr: u32, len: u32): u64 {
  const ctx = RefineContext.create();
  const args = ctx.parseArgs(ptr, len);
  const payload = args.payload;
  logger.info(`refine: service=${args.serviceId} payloadLen=${payload.length}`);

  if (payload.length < 1) {
    logger.warn("refine: empty payload");
    return ctx.respond(i64(LibraryError.Parse));
  }

  const tag = payload.raw[0];
  const rest = BytesBlob.wrap(payload.raw.subarray(1));

  if (tag === 0) return handleDemo(ctx, rest);
  if (tag === 1) return handleAdmin(ctx, rest);
  logger.warn(`refine: unknown tag ${tag}`);
  return ctx.respond(i64(LibraryError.Parse));
}

function handleDemo(ctx: RefineContext, rest: BytesBlob): u64 {
  const d = Decoder.fromBytesBlob(rest);
  const name = d.bytesVarLen();
  const gas = d.u64();
  const callPayload = d.bytesVarLen();
  if (d.isError) {
    logger.warn("refine demo: input decode failure");
    return ctx.respond(i64(LibraryError.Parse));
  }
  if (!d.isFinished()) {
    logger.warn("refine demo: input trailing bytes");
    return ctx.respond(i64(LibraryError.Parse));
  }
  logger.info(`refine demo: name=${name.toString()} gas=${gas} payloadLen=${callPayload.length}`);

  // Resolve name → LibraryEntry via storage.
  const storage = ctx.serviceData();
  const stored = storage.read(libraryKeyFromBlob(name));
  if (!stored.isSome) {
    logger.warn(`refine demo: unknown library ${name.toString()}`);
    return ctx.respond(i64(LibraryError.UnknownLib));
  }
  const entryDecoder = Decoder.fromBlob(stored.val!.raw);
  const entryR = LibraryEntryCodec.create().decode(entryDecoder);
  if (entryR.isError || !entryDecoder.isFinished()) {
    logger.warn(`refine demo: malformed stored entry for ${name.toString()}`);
    return ctx.respond(i64(LibraryError.UnknownLib));
  }
  const entry = entryR.okay!;
  logger.debug(`refine demo: entry hash=${entry.hash.toString()} len=${entry.length}`);

  // Fetch preimage (historical lookup — required in refine context).
  // Pre-size the helper's buffer to the known preimage length to avoid
  // an initial short-read + auto-expand round trip.
  const preimageOpt = ctx.preimages(entry.length).historicalLookup(entry.hash);
  if (!preimageOpt.isSome) {
    logger.warn(`refine demo: preimage missing for ${name.toString()}`);
    return ctx.respond(i64(LibraryError.PreimageMiss));
  }
  const spiBlob = preimageOpt.val!;
  logger.debug(`refine demo: preimage fetched ${spiBlob.length} bytes`);

  // Preimages are peer-controlled input, so use the Result-returning
  // variant rather than panicking on a malformed blob.
  const vmR = ctx.nestedPvmFromSpiChecked(spiBlob, callPayload, gas);
  if (vmR.isError) {
    const e = vmR.error;
    if (e === SpiError.InvalidEntryPoint) {
      logger.warn("refine demo: invalid entry point");
      return ctx.respond(i64(LibraryError.InvalidEntryPoint));
    }
    logger.warn(`refine demo: malformed SPI preimage error=${e}`);
```
