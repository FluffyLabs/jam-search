---
type: graypaper_section
title: Appendix F. Shuffling
index: 119
---
The Fisher-Yates shuffle function is defined formally as: (F.1) ∀ T, l ∈ N ∶ F ∶ ⎧ ⎪ ⎪ ⎪ ⎪ ⎪ ⎨ ⎪ ⎪ ⎪ ⎪ ⎪ ⎩ (⟦ T ⟧ l, ⟦ N ⟧ l ∶) → ⟦ T ⟧ l (s, r) ↦ ⎧ ⎪ ⎪ ⎨ ⎪ ⎪ ⎩ [ s r 0 mod l ] ⌢ F (s ′ ...l − 1, r 1 ...) where s ′ = s except s ′ r 0 mod l = s l − 1 if s ≠ [] [] otherwise JAM: JOIN-ACCUMULATE MACHINE DRAFT 0.6.6 - May 5, 2025 62 Since it is often useful to shuffle a sequence based on some random seed in the form of a hash, we provide a secondary form of the shuffle function F which accepts a 32-byte hash instead of the numeric sequence. We define Q, the numericsequence-from-hash function, thus: ∀ l ∈ N ∶ Q l ∶ ⎧ ⎪ ⎪ ⎨ ⎪ ⎪ ⎩ H → ⟦ N 2 32 ⟧ l h ↦ [ E − 1 4 (H (h ⌢ E 4 (⌊ i ~ 8 ⌋)) 4 i mod 32 ⋅⋅⋅+ 4) S i < − N l ] (F.2) ∀ T, l ∈ N ∶ F ∶  (⟦ T ⟧ l, H) → ⟦ T ⟧ l (s, h) ↦ F (s, Q l (h)) (F.3)
