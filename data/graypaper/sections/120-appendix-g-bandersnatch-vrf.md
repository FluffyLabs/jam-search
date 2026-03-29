---
type: graypaper_section
title: Appendix G. Bandersnatch VRF
index: 120
---
The Bandersnatch curve is defined by Masson, Sanso, and Zhang 2021. The singly-contextualized Bandersnatch Schnorr-like signatures F m k ⟨ c ⟩ are defined as a formulation under the IETF vrf template specified by Hosseini and Galassi 2024 (as IETF VRF) and further detailed by Goldberg et al. 2023. F m ∈ Y k ∈ H B ⟨ c ∈ H ⟩ ⊂ Y 96 ≡ { x S x ∈ Y 96, verify (k, c, m, x) = ⊺ } (G.1) Y (s ∈ F m k ⟨ c ⟩) ∈ H ≡ output (x S x ∈ F m k ⟨ c ⟩) ... 32 (G.2) The singly-contextualized Bandersnatch Ring vrf proofs ¯ F m r ⟨ c ⟩ are a zksnark-enabled analogue utilizing the Pedersen vrf, also defined by Hosseini and Galassi 2024 and further detailed by Jeffrey Burdges et al. 2023. O (⟦ H B ⟧) ∈ Y R ≡ commit (⟦ H B ⟧) (G.3) ¯ F m ∈ Y r ∈ Y R ⟨ c ∈ H ⟩ ⊂ Y 784 ≡ { x S x ∈ Y 784, verify (r, c, m, x) = ⊺ } (G.4) Y (p ∈ ¯ F m r ⟨ c ⟩) ∈ H ≡ output (x S x ∈ ¯ F m r ⟨ c ⟩) ... 32 (G.5) Note that in the case a key H B has no corresponding Bandersnatch point when constructing the ring, then the Bandersnatch padding point as stated by Hosseini and Galassi 2024 should be substituted.
