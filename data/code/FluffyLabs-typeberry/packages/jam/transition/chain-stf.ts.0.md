---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/chain-stf.ts#L1-L100
title: packages/jam/transition/chain-stf.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 5
content_sha: 4f8e6221ec5c9b2e43c4d9683cd0d14c1f01ce73606ed20b456c83f287f4d7c6
language: typescript
---
`packages/jam/transition/chain-stf.ts` (lines 1–100)

```typescript
import type { BlockView, CoreIndex, HeaderHash, TimeSlot } from "@typeberry/block";
import type { GuaranteesExtrinsicView } from "@typeberry/block/guarantees.js";
import type { AuthorizerHash } from "@typeberry/block/refine-context.js";
import { asKnownSize, HashSet } from "@typeberry/collections";
import type { ChainSpec } from "@typeberry/config";
import { PvmBackend } from "@typeberry/config";
import type { Ed25519Key } from "@typeberry/crypto";
import type { BlocksDb } from "@typeberry/database";
import { Disputes, type DisputesStateUpdate } from "@typeberry/disputes";
import type { DisputesErrorCode } from "@typeberry/disputes/disputes-error-code.js";
import { Logger } from "@typeberry/logger";
import { Safrole } from "@typeberry/safrole";
import { BandernsatchWasm } from "@typeberry/safrole/bandersnatch-wasm.js";
import type { SafroleErrorCode, SafroleStateUpdate } from "@typeberry/safrole/safrole.js";
import { SafroleSeal, type SafroleSealError } from "@typeberry/safrole/safrole-seal.js";
import type { ServicesUpdate, State, WithStateView } from "@typeberry/state";
import { assertEmpty, type ErrorResult, measure, OK, Result, type TaggedError } from "@typeberry/utils";
import { AccumulateOutput } from "./accumulate/accumulate-output.js";
import {
  type ACCUMULATION_ERROR,
  Accumulate,
  type AccumulateOptions,
  type AccumulateStateUpdate,
} from "./accumulate/index.js";
import { Assurances, type AssurancesError, type AssurancesStateUpdate } from "./assurances.js";
import { Authorization, type AuthorizationStateUpdate } from "./authorization.js";
import type { TransitionHasher } from "./hasher.js";
import { Preimages, type PreimagesErrorCode, type PreimagesStateUpdate } from "./preimages.js";
import { RecentHistory, type RecentHistoryStateUpdate } from "./recent-history.js";
import { type HeaderChain, Reports, type ReportsError, type ReportsStateUpdate } from "./reports/index.js";
import { Statistics, type StatisticsStateUpdate } from "./statistics.js";

export class DbHeaderChain implements HeaderChain {
  static new(blocks: BlocksDb) {
    return new DbHeaderChain(blocks);
  }

  private constructor(private readonly blocks: BlocksDb) {}

  isAncestor(pastHeaderSlot: TimeSlot, pastHeader: HeaderHash, currentHeader: HeaderHash): boolean {
    let currentHash = currentHeader;
    for (;;) {
      // success = we found the right header in the DB
      if (currentHash.isEqualTo(pastHeader)) {
        return true;
      }

      const current = this.blocks.getHeader(currentHash);
      // fail if we don't find a parent (unlikely?)
      if (current === null) {
        return false;
      }

      // fail if we went pass that time slot index
      if (current.timeSlotIndex.materialize() < pastHeaderSlot) {
        return false;
      }

      // move one block up
      currentHash = current.parentHeaderHash.materialize();
    }
  }
}

const OFFENDERS_ERROR = "offenders not matching header";
type OFFENDERS_ERROR = typeof OFFENDERS_ERROR;

export type Ok = SafroleStateUpdate &
  DisputesStateUpdate &
  ReportsStateUpdate &
  AssurancesStateUpdate &
  PreimagesStateUpdate &
  RecentHistoryStateUpdate &
  AuthorizationStateUpdate &
  AccumulateStateUpdate &
  StatisticsStateUpdate;

export enum StfErrorKind {
  Assurances = 0,
  Disputes = 1,
  Safrole = 2,
  Reports = 3,
  Preimages = 4,
  SafroleSeal = 5,
  Accumulate = 6,
  Offenders = 7,
}

export type StfError =
  | TaggedError<StfErrorKind.Assurances, AssurancesError>
  | TaggedError<StfErrorKind.Reports, ReportsError>
  | TaggedError<StfErrorKind.Disputes, DisputesErrorCode>
  | TaggedError<StfErrorKind.Safrole, SafroleErrorCode>
  | TaggedError<StfErrorKind.Preimages, PreimagesErrorCode>
  | TaggedError<StfErrorKind.SafroleSeal, SafroleSealError>
  | TaggedError<StfErrorKind.Accumulate, ACCUMULATION_ERROR>
  | TaggedError<StfErrorKind.Offenders, OFFENDERS_ERROR>;

export const stfError = <Kind extends StfErrorKind, Err extends StfError["error"]>(
  kind: Kind,
```
