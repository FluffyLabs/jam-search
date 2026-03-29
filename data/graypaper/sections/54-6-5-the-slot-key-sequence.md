---
type: graypaper_section
title: 6.5. The Slot Key Sequence
index: 54
---
The posterior slot key sequence γ ′ s is one of three expressions depending on the circumstance of the block. If the block is not the first in an epoch, then it remains unchanged from the prior γ s. If the block signals the next epoch (by epoch index) and the previous block’s slot was within the closing period of the previous epoch, then it takes the value of the prior ticket accumulator γ a. Otherwise, it takes the value of the fallback key sequence. Formally: γ ′ s ≡ ⎧ ⎪ ⎪ ⎪ ⎪ ⎨ ⎪ ⎪ ⎪ ⎪ ⎩ Z (γ a) if e ′ = e + 1 ∧ m ≥ Y ∧ S γ a S = E γ s if e ′ = e F (η ′ 2, κ ′) otherwise (6.24) Here, we use Z as the outside-in sequencer function, defined as follows: (6.25) Z ∶  ⟦ C ⟧ E → ⟦ C ⟧ E s ↦ [ s 0, s S s S − 1, s 1, s S s S − 2 ,. .. ] Finally, F is the fallback key sequence function which selects an epoch’s worth of validator Bandersnatch keys (⟦ H B ⟧ E) from the validator key set k using the entropy collected on-chain r : (6.26) F ∶ ⎧ ⎪ ⎪ ⎨ ⎪ ⎪ ⎩ ⎧ ⎩ H, ⟦ K ⟧ ⎫ ⎭ → ⟦ H B ⟧ E ⎧ ⎩ r, k ⎫ ⎭ ↦  k [ E − 1 (H 4 (r ⌢ E 4 (i)))] ↺ b U i ∈ N E 
