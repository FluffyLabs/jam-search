---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/general/fetch.ts#L378-L466
title: packages/jam/jam-host-calls/general/fetch.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 3
chunk_total: 4
content_sha: bc3b33671851f5f9780ae652d2cafc202685d8e65db2bc9a349da7d136ed81ba
language: typescript
---
`packages/jam/jam-host-calls/general/fetch.ts` (lines 378–466)

```typescript
    // Kind 8: auth configuration - IsAuthorized, Refine
    if (kind === FetchKind.AuthConfiguration) {
      if (ext.context === FetchContext.Accumulate) {
        return null;
      }
      return ext.authConfiguration();
    }

    // Kind 9: authorization token - IsAuthorized, Refine
    if (kind === FetchKind.AuthToken) {
      if (ext.context === FetchContext.Accumulate) {
        return null;
      }
      return ext.authToken();
    }

    // Kind 10: refine context - IsAuthorized, Refine
    if (kind === FetchKind.RefineContext) {
      if (ext.context === FetchContext.Accumulate) {
        return null;
      }
      return ext.refineContext();
    }

    // Kind 11: all work items - IsAuthorized, Refine
    if (kind === FetchKind.AllWorkItems) {
      if (ext.context === FetchContext.Accumulate) {
        return null;
      }
      return ext.allWorkItems();
    }

    // Kind 12: one work item - IsAuthorized, Refine
    if (kind === FetchKind.OneWorkItem) {
      if (ext.context === FetchContext.Accumulate) {
        return null;
      }
      const workItem = regs.get(11);
      return ext.oneWorkItem(workItem);
    }

    // Kind 13: work item payload - IsAuthorized, Refine
    if (kind === FetchKind.WorkItemPayload) {
      if (ext.context === FetchContext.Accumulate) {
        return null;
      }
      const workItem = regs.get(11);
      return ext.workItemPayload(workItem);
    }

    // Kind 14: all transfers and operands - Accumulate only
    if (kind === FetchKind.AllTransfersAndOperands) {
      if (ext.context !== FetchContext.Accumulate) {
        return null;
      }
      return ext.allTransfersAndOperands();
    }

    // Kind 15: one transfer or operand - Accumulate only
    if (kind === FetchKind.OneTransferOrOperand) {
      if (ext.context !== FetchContext.Accumulate) {
        return null;
      }
      const index = regs.get(11);
      return ext.oneTransferOrOperand(index);
    }

    return null;
  }
}

export enum FetchKind {
  Constants = 0,
  Entropy = 1,
  AuthorizerTrace = 2,
  OtherWorkItemExtrinsics = 3,
  MyExtrinsics = 4,
  OtherWorkItemImports = 5,
  MyImports = 6,
  WorkPackage = 7,
  AuthConfiguration = 8,
  AuthToken = 9,
  RefineContext = 10,
  AllWorkItems = 11,
  OneWorkItem = 12,
  WorkItemPayload = 13,
  AllTransfersAndOperands = 14,
  OneTransferOrOperand = 15,
}
```
