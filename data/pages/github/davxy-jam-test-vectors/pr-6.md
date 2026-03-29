---
type: page
url: 'https://github.com/davxy/jam-test-vectors/pull/6'
title: Add Known Packages to the Reports STF Input
site: github.com/davxy/jam-test-vectors
created_at: '2024-12-17T10:46:25.000Z'
last_modified: '2024-12-17T10:46:25.000Z'
---

# Add Known Packages to the Reports STF Input

## Pull Request by @davxy

To ensure that the reported packages have not already been processed, the GP require verifying that each package is not included in a set derived from all packages found in the following sources from the prior state: recent block history (β), recently accumulated work packages (ξ), ready-to-be-accumulated packages (φ), and availability assignments (ρ).

For simplicity, and to avoid the effort of constructing dummy structures, we utilize a pre-constructed sequence of "known-packages," which is assumed to have been derived from the aforementioned sources.

The specific origin of the packages is not relevant for this STF progress, with the only requirement being that all packages from intermediate core assignments (ρ‡) and block history (β) must be contained within this sequence.

Closes https://github.com/davxy/jam-test-vectors/issues/7

