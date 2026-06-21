---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/library/assembly/accumulate.ts#L1-L83
title: examples/library/assembly/accumulate.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 02b17ec6be6440d8575a17bf7338c5caad87a9170ee7ed026cc71540210df085
language: typescript
---
`examples/library/assembly/accumulate.ts` (lines 1–83)

```typescript
import {
  AccumulateContext,
  Bytes32,
  BytesBlob,
  Decoder,
  Encoder,
  Logger,
  WorkExecResultKind,
} from "@fluffylabs/as-lan";
import { AdminCommand, AdminCommandCodec, AdminCommandKind } from "./admin";
import { LibraryEntry, LibraryEntryCodec, libraryKeyFromBlob } from "./storage";

const logger: Logger = Logger.create("library");

export function accumulate(ptr: u32, len: u32): u64 {
  const ctx = AccumulateContext.create();
  const args = ctx.parseArgs(ptr, len);
  const fetcher = ctx.fetcher();
  const adminCodec = AdminCommandCodec.create();
  logger.info(`accumulate: slot=${args.slot} service=${args.serviceId} argsLength=${args.argsLength}`);

  for (let i: u32 = 0; i < args.argsLength; i++) {
    const itemOpt = fetcher.oneTransferOrOperand(i);
    if (!itemOpt.isSome) {
      logger.warn(`accumulate[${i}]: fetch returned none, skipping`);
      continue;
    }
    const item = itemOpt.val!;
    if (!item.isOperand) {
      logger.debug(`accumulate[${i}]: transfer item, skipping`);
      continue;
    }
    const op = item.operand;
    if (op.result.kind !== WorkExecResultKind.Ok) {
      logger.warn(`accumulate[${i}]: non-ok work result kind=${op.result.kind}, skipping`);
      continue;
    }
    const body = op.result.okBlob;

    const d = Decoder.fromBytesBlob(body);
    const r = adminCodec.decode(d);
    if (r.isError) {
      logger.warn(`accumulate[${i}]: malformed operand, skipping`);
      continue;
    }
    if (!d.isFinished()) {
      logger.warn(`accumulate[${i}]: trailing bytes after admin cmd, skipping`);
      continue;
    }

    dispatch(ctx, i, r.okay!);
  }

  return ctx.yieldHash(Bytes32.zero());
}

// Admin side-effect calls intentionally ignore their return values: in
// accumulate there is no caller to surface errors to, and every failure mode
// (WriteError.Full, SolicitError.Full/Huh, ForgetError.Huh, ProvideError.Huh/Who)
// is either transient or operator-misconfiguration — both of which are better
// diagnosed from host logs than encoded into the service response.
function dispatch(ctx: AccumulateContext, i: u32, cmd: AdminCommand): void {
  if (cmd.kind === AdminCommandKind.SetMapping) {
    logger.info(
      `accumulate[${i}]: SetMapping name=${cmd.name!.toString()} hash=${cmd.hash!.toString()} len=${cmd.length}`,
    );
    const entryEnc = Encoder.create();
    LibraryEntryCodec.create().encode(LibraryEntry.create(cmd.hash!, cmd.length), entryEnc);
    ctx.serviceData().write(libraryKeyFromBlob(cmd.name!), entryEnc.finish());
  } else if (cmd.kind === AdminCommandKind.RemoveMapping) {
    logger.info(`accumulate[${i}]: RemoveMapping name=${cmd.name!.toString()}`);
    ctx.serviceData().write(libraryKeyFromBlob(cmd.name!), BytesBlob.empty());
  } else if (cmd.kind === AdminCommandKind.Solicit) {
    logger.info(`accumulate[${i}]: Solicit hash=${cmd.hash!.toString()} len=${cmd.length}`);
    ctx.preimages().solicit(cmd.hash!, cmd.length);
  } else if (cmd.kind === AdminCommandKind.Forget) {
    logger.info(`accumulate[${i}]: Forget hash=${cmd.hash!.toString()} len=${cmd.length}`);
    ctx.preimages().forget(cmd.hash!, cmd.length);
  } else if (cmd.kind === AdminCommandKind.Provide) {
    logger.info(`accumulate[${i}]: Provide preimageLen=${cmd.preimage!.length}`);
    ctx.preimages().provide(cmd.preimage!);
  }
}
```
