---
type: graypaper_section
title: 8.2. Pool and Queue
index: 60
---
We define the set of authorizers allowable for a particular core c as the authorizer pool α [ c ]. To maintain this value, a further portion of state is tracked for each core: the core’s current authorizer queue φ [ c ], from which we draw values to fill the pool. Formally: (8.1) α ∈ C⟦ H ⟧ ∶ O H C, φ ∈ C⟦ H ⟧ Q H C Note: The portion of state φ may be altered only through an exogenous call made from the accumulate logic of an appropriately privileged service. The state transition of a block involves placing a new authorization into the pool from the queue: ∀ c ∈ N C ∶ α ′ [ c ] ≡ ←Ð Ð Ð Ð Ð Ð Ð Ð Ð Ð ÐÐ F (c) φ ′ [ c ][ H t ] ↺ O (8.2) F (c) ≡ ⎧ ⎪ ⎪ ⎨ ⎪ ⎪ ⎩ α [ c ] m {(g w) a } if ∃ g ∈ E G ∶ (g w) c = c α [ c ] otherwise (8.3) Since α ′ is dependent on φ ′, practically speaking, this step must be computed after accumulation, the stage in which φ ′ is defined. Note that we utilize the guarantees extrinsic E G to remove the oldest authorizer which has been used to justify a guaranteed work-package in the current block. This is further defined in equation 11.23.
