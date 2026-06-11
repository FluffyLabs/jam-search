---
type: graypaper_section
title: 17.2 Data Fetching
index: 101
---
For each work-report to be audited, we use its erasure-root to request erasure-coded chunks from enough assurers, and then reconstruct the work-package bundle from these chunks. The bundle contains the work-package together with its extrinsic data, imported segments, and imported segment justifications.

We may validate the work-package by ensuring its hash is equivalent to the hash included as part of the work-package specification in the work-report. We may validate the extrinsic data through ensuring their hashes are each equivalent to those found in the relevant work-item.

Finally, we may validate each imported segment as a justification must follow the concatenated segments which allows verification that each segment's hash is included in the referencing Merkle root and index of the corresponding work-item.

Exported segments need not be reconstructed in the same way, but rather should be determined in the same manner as with guaranteeing, i.e. through the execution of the Refine logic.

All items in the work-package specification field of the work-report should be recalculated from this now known-good data and verified, essentially retracing the guarantors steps and ensuring correctness.
