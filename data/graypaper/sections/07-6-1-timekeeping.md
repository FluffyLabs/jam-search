---
type: graypaper_section
title: 6.1. Timekeeping
index: 7
---
Here, τ defines the most recent block’s slot index, which we transition to the slot index as defined in the block’s header: (6.1) τ ∈ N T, τ ′ ≡ H t We track the slot index in state as τ in order that we are able to easily both identify a new epoch and determine the slot at which the prior block was authored. We denote e as the prior’s epoch index and m as the prior’s slot phase index within that epoch and e ′ and m ′ are the corresponding values for the present block: let e R m = τ E, e ′ R m ′ = τ ′ E (6.2)
