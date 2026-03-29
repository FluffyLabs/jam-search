---
type: graypaper_section
title: 12.4. Preimage Integration
index: 78
---
After accumulation, we must integrate all preimages provided in the lookup extrinsic to arrive at the posterior account state. The lookup extrinsic is a sequence of pairs of service indices and data. These pairs must be ordered and without duplicates (equation 12.36 requires this). The data must have been solicited by a service but not yet provided in the prior state. Formally: E P ∈ ⟦ ⎧ ⎩ N S, Y ⎫ ⎭ ⟧ (12.35) E P = [ i _ _ i ∈ E P ] (12.36) R (d, s, h, l) ⇔ h ~ ∈ d [ s ] p ∧ d [ s ] l [ ⎧ ⎩ h, l ⎫ ⎭ ] = [] (12.37) ∀ ⎧ ⎩ s, p ⎫ ⎭ ∈ E P ∶ R (δ, s, H (p), S p S) (12.38) We disregard, without prejudice, any preimages which due to the effects of accumulation are no longer useful. We define δ ′ as the state after the integration of the stillrelevant preimages: let P = {(s, p) S ⎧ ⎩ s, p ⎫ ⎭ ∈ E P, R (δ ‡, s, H (p), S p S)} (12.39) δ ′ = δ ‡ ex. ∀ ⎧ ⎩ s, p ⎫ ⎭ ∈ P ∶ ⎧ ⎪ ⎪ ⎨ ⎪ ⎪ ⎩ δ ′ [ s ] p [ H (p)] = p δ ′ [ s ] l [ H (p), S p S] = [ τ ′ ] (12.40)
