---
type: graypaper_section
title: 9.4. Service Privileges
index: 9
---
Up to three services may be recognized as privileged. The portion of state in which this is held is denoted χ and has three service index components together with a gas limit. The first, χ m, is the index of the manager service which is the service able to effect an alteration of χ from block to block. The following two, χ a and χ v, are each the indices of services able to alter φ and ι from block to block. Finally, χ g is a small dictionary containing the indices of services which automatically accumulate in each block together with a basic amount of gas with which each accumulates. Formally: χ ≡ ⎧ ⎩ χ m ∈ N S, χ a ∈ N S, χ v ∈ N S, χ g ∈ D ⟨ N S → N G ⟩ ⎫ ⎭ (9.9)
