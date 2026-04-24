---
type: page
url: 'https://github.com/davxy/jam-test-vectors/issues/7'
title: 'Reports STF: detect duplicate packages'
site: github.com/davxy/jam-test-vectors
created_at: '2024-12-17T18:34:17.000Z'
last_modified: '2024-12-17T18:34:17.000Z'
content_kind: issue
---

# Reports STF: detect duplicate packages

## Issue by @davxy

The current "reports" test vectors do not include cases to properly test for duplicate reports. At present, only one case is considered, where the duplicate is found in the recent block history (β).  

To ensure a thorough check, as [reported](https://github.com/w3f/jamtestvectors/pull/28#issuecomment-2535457582), we must **also** include prior state accumulated reports (ξ), available but not accumulated reports (φ), reports with pending availability (ρ).  

We have two options to address this:  
1. Modify the Prior State structure to include (**prior**) β, ξ, φ, and ρ.  
2. Modify the Input structure to include an ephemeral `known_packages` set, which is assumed to be constructed using all the aforementioned state components as prescribed by GP.  

I have decided to propose a [PR](https://github.com/davxy/jam-test-vectors/pull/6) following strategy 2 for the following reasons:  
- It is simpler and avoids the overhead of constructing these state values solely to fetch package hashes (a trivial op).
- It prevents including two incarnations of the same state structure within the Prior State. Specifically, I'm referring to the WRs availability assignments, which would otherwise need to exist in both the prior state (ϱ) — for constructing `known_packages` — and the intermediate state (ϱ‡), which is mutated by the STF to produce (ϱ').  

Ultimately, in the proposed PR, the construction of `known_packages` is straightforward enough that it does not seem worthwhile to complicate the State further. Passing the pre-constructed form achieves the desired outcome cleanly.



## Comment by @vekexasia

hey @davxy my preference would be to go with solution 1.  My reasons:

- it allows to have multiple test cases where we ensure that each State is indeed being accounted when checking for wp pre-existance
- avoids the burden of doing extra code just to construct a set of known packages to be used in one of those states (so that I don't have to change method signature)

but your points are good too even though i wouldnt mind having "multiple" ϱ



## Comment by @danicuki

I also prefer option 1
