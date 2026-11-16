---
type: page
url: 'https://github.com/jam-conformance/jam-fuzzing/issues/220'
title: Pin each fuzzer release to a Gray Paper commit
site: github.com/davxy/jam-conformance
created_at: '2026-11-15T17:56:59.000Z'
last_modified: '2026-11-15T17:56:59.000Z'
content_kind: issue
---

# Pin each fuzzer release to a Gray Paper commit

## Issue by @ascrivener

The fuzzer and the conformance traces are labelled "GP 0.8.0", but they appear to follow v0.8.0 plus some, not all, Gray Paper PRs merged since the v0.8.0 tag (07f041d, 2026-06-03). Examples from replaying the published 0.8.0 traces and example sessions:

- **Followed:**
  - #563, bounds on work-report values. Reports with auth gas 𝖦_I + 1, refine gas 𝖦_R + 1, export count 65,535 or bundle length 2³² − 1 are rejected.
  - #533, an out-of-gas `grow_heap` consumes all gas.
- **Not followed:**
  - #564, variable-length validator statistics. State roots match the v0.8.0 fixed-width encoding.
  - #550, Thin VRF. Seals verify under the v0.8.0-era IETF VRF.

So an implementation written from the published v0.8.0 text disagrees with the fuzzer on some cases, and an implementer can't tell which text is intended.

Could each fuzzer release (and the matching jam-types-py and test-vector releases) state:

1. the Gray Paper commit it targets, and
2. if that isn't a tagged release, the list of post-release GP PRs it includes?

A line in `conformance-criteria/conformance-matrix.md` next to each tooling row would be enough. It would also help if the test vectors pinned to tagged GP releases, or listed their deviations in the same way.

