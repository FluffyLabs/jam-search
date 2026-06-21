---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/rpc-validation/validation.ts#L113-L215
title: packages/jam/rpc-validation/validation.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 1
chunk_total: 2
content_sha: e34ead7706a68dbc8aea34c9110a01f3f7628f092fe710f34dd2a25421fe2269
language: typescript
---
`packages/jam/rpc-validation/validation.ts` (lines 113–215)

```typescript
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
      input: noArgs,
      output: parameters,
    },
    parent: {
      input: z.tuple([hash]),
      output: blockDescriptor,
    },
    serviceData: {
      input: z.tuple([hash, serviceId]),
      output: z.union([blobArray, z.null()]),
    },
    servicePreimage: {
      input: z.tuple([hash, serviceId, hash]),
      output: z.union([blobArray, z.null()]),
    },
    serviceRequest: {
      input: z.tuple([hash, serviceId, hash, preimageLength]),
      output: z.union([z.array(slot).readonly(), z.null()]),
    },
    serviceValue: {
      input: z.tuple([hash, serviceId, blobArray]),
      output: z.union([blobArray, z.null()]),
    },
    stateRoot: {
      input: z.tuple([hash]),
      output: hash,
    },
    statistics: {
      input: z.tuple([hash]),
      output: blobArray,
    },
    subscribeBestBlock: {
      input: noArgs,
      output: z.string(),
    },
    subscribeFinalizedBlock: {
      input: noArgs,
      output: z.string(),
    },
    subscribeServiceData: {
      input: z.tuple([serviceId, z.boolean()]),
      output: z.string(),
    },
    subscribeServicePreimage: {
      input: z.tuple([serviceId, hash, z.boolean()]),
      output: z.string(),
    },
    subscribeServiceRequest: {
      input: z.tuple([serviceId, hash, preimageLength, z.boolean()]),
      output: z.string(),
    },
    subscribeServiceValue: {
      input: z.tuple([serviceId, blobArray, z.boolean()]),
      output: z.string(),
    },
    subscribeStatistics: {
      input: z.tuple([z.boolean()]),
      output: z.string(),
    },
    unsubscribeBestBlock: unsubscribeSchema,
    unsubscribeFinalizedBlock: unsubscribeSchema,
    unsubscribeServiceData: unsubscribeSchema,
    unsubscribeServicePreimage: unsubscribeSchema,
    unsubscribeServiceRequest: unsubscribeSchema,
    unsubscribeServiceValue: unsubscribeSchema,
    unsubscribeStatistics: unsubscribeSchema,
  };

  export const schemas = {
    ...customSchemas,
    ...jip2Schemas,
  } as const satisfies Record<string, { input: z.ZodTypeAny; output: z.ZodTypeAny }>;

  export const jsonRpcRequest = z.object({
    jsonrpc: z.literal(JSON_RPC_VERSION),
    method: z.string(),
    params: z.unknown().optional(),
    id: z.union([z.string(), z.number(), z.null()]),
  });

  export const jsonRpcNotification = jsonRpcRequest.omit({ id: true });
}

export const SUBSCRIBABLE_METHODS = {
  subscribeBestBlock: "unsubscribeBestBlock",
  subscribeFinalizedBlock: "unsubscribeFinalizedBlock",
  subscribeServiceData: "unsubscribeServiceData",
  subscribeServicePreimage: "unsubscribeServicePreimage",
  subscribeServiceRequest: "unsubscribeServiceRequest",
  subscribeServiceValue: "unsubscribeServiceValue",
  subscribeStatistics: "unsubscribeStatistics",
} as const satisfies Partial<Record<keyof typeof validation.schemas, keyof typeof validation.schemas>>;
```
