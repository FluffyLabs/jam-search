---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/reports/reports.ts#L1-L90
title: packages/jam/transition/reports/reports.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 9281b60f2c2ed7d1c8cb9ce10934db095f874257e9cdb179b4e2f6722a350bc7
language: typescript
---
`packages/jam/transition/reports/reports.ts` (lines 1–90)

```typescript
import { type PerValidator, type TimeSlot, tryAsTimeSlot, type WorkReportHash } from "@typeberry/block";
import type { GuaranteesExtrinsicView } from "@typeberry/block/guarantees.js";
import type { WorkPackageHash, WorkPackageInfo } from "@typeberry/block/refine-context.js";
import { type BytesBlob, bytesBlobComparator } from "@typeberry/bytes";
import { asKnownSize, type HashDictionary, type HashSet, type KnownSizeArray, SortedSet } from "@typeberry/collections";
import type { ChainSpec } from "@typeberry/config";
import { type Ed25519Key, ed25519 } from "@typeberry/crypto";
import type { Blake2b } from "@typeberry/hash";
import type { SafroleStateUpdate } from "@typeberry/safrole";
import { AvailabilityAssignment, type State, type StateView, tryAsPerCore, type WithStateView } from "@typeberry/state";
import { asOpaqueType, OK, Result } from "@typeberry/utils";
import { ReportsError } from "./error.js";
import { generateCoreAssignment, rotationIndex } from "./guarantor-assignment.js";
import type { HeaderChain, ReportsInput } from "./input.js";
import { verifyReportsBasic } from "./verify-basic.js";
import { verifyContextualValidity } from "./verify-contextual.js";
import { type GuarantorAssignment, verifyCredentials } from "./verify-credentials.js";
import { verifyReportsOrder } from "./verify-order.js";
import { verifyPostSignatureChecks } from "./verify-post-signature.js";

export type ReportsState = Pick<
  State,
  "availabilityAssignment" | "entropy" | "getService" | "recentBlocks" | "accumulationQueue" | "recentlyAccumulated"
> &
  WithStateView<Pick<StateView, "authPoolsView">>;

/** Reports state update. */
export type ReportsStateUpdate = Pick<ReportsState, "availabilityAssignment">;

export type ReportsOutput = {
  /** Altered state. */
  stateUpdate: ReportsStateUpdate;
  /**
   * All work Packages and their segment roots reported in the extrinsic.
   *
   * This dictionary has the same number of items as in the input guarantees extrinsic.
   */
  reported: HashDictionary<WorkPackageHash, WorkPackageInfo>;
  /** A set `M` of work package reporters. */
  reporters: KnownSizeArray<Ed25519Key, "Guarantees * Credentials (at most `cores*3`)">;
};

export class Reports {
  constructor(
    public readonly chainSpec: ChainSpec,
    public readonly blake2b: Blake2b,
    public readonly state: ReportsState,
    public readonly headerChain: HeaderChain,
  ) {}

  async transition(input: ReportsInput): Promise<Result<ReportsOutput, ReportsError>> {
    // verify ordering of work reports.
    const reportsOrderResult = verifyReportsOrder(input.guarantees, this.chainSpec);
    if (reportsOrderResult.isError) {
      return reportsOrderResult;
    }

    // check some basic reports validity
    const reportsValidity = verifyReportsBasic(input.guarantees);
    if (reportsValidity.isError) {
      return reportsValidity;
    }

    // calculate hashes of all work reports in the guarantees extrinsic (one per guarantee)
    const workReportHashes = this.workReportHashes(input.guarantees, this.blake2b);

    // verifying credentials for all the work reports
    // but also slot & core assignment.
    // returns actual signatures that need to be checked (async)
    const signaturesToVerify = this.verifyCredentials(input, workReportHashes);
    if (signaturesToVerify.isError) {
      return signaturesToVerify;
    }

    // Actually verify signatures
    const verifySignaturesLater = ed25519.verify(signaturesToVerify.ok);

    // Perform rest of the work in the meantime.
    const restResult = this.verifyPostSignatureChecks(input.guarantees, input.assurancesAvailAssignment);
    if (restResult.isError) {
      return restResult;
    }

    // confirm contextual validity
    const contextualValidity = this.verifyContextualValidity(input);
    if (contextualValidity.isError) {
      return contextualValidity;
    }

    // check signatures correctness
```
