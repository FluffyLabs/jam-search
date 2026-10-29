---
type: page
url: 'https://github.com/jam-conformance/jam-fuzzing/discussions/218'
title: >-
  Trace 1793100270_2515 (in 0.8.0 batch 2): refinement gas exactly equals the
  budget
site: github.com/davxy/jam-conformance
created_at: '2026-10-28T10:34:10.000Z'
last_modified: '2026-10-28T10:34:10.000Z'
content_kind: discussion
---

# Trace 1793100270_2515 (in 0.8.0 batch 2): refinement gas exactly equals the budget

## Discussion by @emielsebastiaan

Regarding trace 1793100270_2515 (in 0.8.0 batch 2): refinement gas exactly equals the budget

- Disputed trace: PolkaJam accepts; PyJAMaz returns refine_load_too_high.
- Cause: In this trace the summed refinement gas is exactly 1,000,000,000, Tiny’s G_R. PyJAMaz rejects gas_used >= G_R.
- GP: 14.9 prints the strict inequality Σ refinement budgets < G_R; However, the immediately preceding prose in GP says "at most".
- Proposed fix: Ambiguity in Gray Paper between prose and equation: solution either rephrase "at most" or replace both "<" with "<=".
- PyJAMaz follows the equation and PolkaJAM seems to follow the prose.

(bonus find: the same seems to apply to the accumulate gas limit (constant G_A)

https://graypaper.fluffylabs.dev/#/07f041d/1b9f011b9f01?v=0.8.0


## Comment by @davxy

Changed by https://github.com/gavofyork/graypaper/pull/563

Part of the listed deviations in https://github.com/jam-conformance/jam-fuzzing/pull/212


## Comment by @jaymansfield

[GP#563](https://github.com/gavofyork/graypaper/pull/563 ) was listed as a deviation in the PR for batch 1 and changes the GA and GR gas checks to be inclusive. 


## Comment by @emielsebastiaan

Check... we missed this; closed this discussion.
