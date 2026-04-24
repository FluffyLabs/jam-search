---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/rpc-validation/validation.ts#L1-L123
title: packages/jam/rpc-validation/validation.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 2
content_sha: ba723607f62aa57dec084f6d7c48629f57116beef40456404b4c7974020196a2
language: typescript
---
`packages/jam/rpc-validation/validation.ts` (lines 1–123)

```typescript
import { HASH_SIZE } from "@typeberry/hash";
import z from "zod";

export const JSON_RPC_VERSION = "2.0";
export namespace validation {
  const u16 = z.number().int().min(0).max(0xffff);
  const u32 = z.number().int().min(0).max(0xffff_ffff);

  const uint8Array = z.custom<Uint8Array>((v) => v instanceof Uint8Array); // this is needed because a simple z.instanceof(Uint8Array) automatically narrows the type down to Uint8Array<ArrayBuffer> whereas our Bytes.raw are effectively Uint8Array<ArrayBufferLike>

  export const hash = z.codec(
    z.base64(),
    uint8Array.refine((v) => v.length === HASH_SIZE, "Invalid hash length."),
    {
      decode: (v) => Uint8Array.from(Buffer.from(v, "base64")),
      encode: (v) => Buffer.from(v).toString("base64"),
    },
  );
  export const slot = u32;
  export const coreIndex = u16;
  export const blobArray = z.codec(z.base64(), uint8Array, {
    decode: (v) => Uint8Array.from(Buffer.from(v, "base64")),
    encode: (v) => Buffer.from(v).toString("base64"),
  });
  export const serviceId = u32;
  export const preimageLength = u32;
  export const noArgs = z.tuple([]);
  export const blockDescriptor = z.object({
    header_hash: hash,
    slot: slot,
  });

  export const refineResult = z.object({
    report: blobArray,
    exports: blobArray,
  });

  export const parameters = z.object({
    V1: z.object({
      deposit_per_account: z.number(),
      deposit_per_item: z.number(),
      deposit_per_byte: z.number(),
      min_turnaround_period: z.number(),
      epoch_period: z.number(),
      max_accumulate_gas: z.number(),
      max_is_authorized_gas: z.number(),
      max_refine_gas: z.number(),
      block_gas_limit: z.number(),
      recent_block_count: z.number(),
      max_work_items: z.number(),
      max_dependencies: z.number(),
      max_tickets_per_block: z.number(),
      max_lookup_anchor_age: z.number(),
      tickets_attempts_number: z.number(),
      auth_window: z.number(),
      auth_queue_len: z.number(),
      rotation_period: z.number(),
      max_extrinsics: z.number(),
      availability_timeout: z.number(),
      val_count: z.number(),
      max_input: z.number(),
      max_refine_code_size: z.number(),
      basic_piece_len: z.number(),
      max_imports: z.number(),
      max_is_authorized_code_size: z.number(),
      max_exports: z.number(),
      max_refine_memory: z.number(),
      max_is_authorized_memory: z.number(),
      segment_piece_count: z.number(),
      max_report_elective_data: z.number(),
      transfer_memo_size: z.number(),
      epoch_tail_start: z.number(),
      core_count: z.number(),
      slot_period_sec: z.number(),
      max_authorizer_code_size: z.number(),
      max_service_code_size: z.number(),
    }),
  });

  export const notImplementedSchema = {
    input: z.tuple([]),
    output: z.any(),
  };

  export const unsubscribeSchema = {
    input: z.tuple([z.string()]),
    output: z.boolean(),
  };

  /** Non-standard typeberry extension methods. */
  export const customSchemas = {
    typeberry_refineWorkPackage: {
      input: z.tuple([coreIndex, blobArray, z.array(blobArray)]),
      output: refineResult,
    },
  };

  /** JIP-2 (standardized) methods */
  export const jip2Schemas = {
    beefyRoot: notImplementedSchema,
    submitPreimage: notImplementedSchema,
    submitWorkPackage: notImplementedSchema,
    workReport: notImplementedSchema,
    submitWorkPackageBundle: notImplementedSchema,
    workPackageStatus: notImplementedSchema,
    subscribeWorkPackageStatus: notImplementedSchema,
    fetchWorkPackageSegments: notImplementedSchema,
    fetchSegments: notImplementedSchema,
    syncState: notImplementedSchema,
    subscribeSyncStatus: notImplementedSchema,
    bestBlock: {
      input: noArgs,
      output: blockDescriptor,
    },
    finalizedBlock: {
      input: noArgs,
      output: blockDescriptor,
    },
    listServices: {
      input: z.tuple([hash]),
      output: z.array(serviceId),
    },
    parameters: {
```
