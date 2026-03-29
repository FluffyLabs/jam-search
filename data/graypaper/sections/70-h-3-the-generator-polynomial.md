---
type: graypaper_section
title: H.3. The Generator Polynomial
index: 70
---
To erasure code a message of 342 words into 1023 code words, we represent each message as a field element as described in previous section and we interpolate the polynomial p (y) of maximum 341 degree which satisfies the following equalities: (H.12) p (˜ 0) = È m 0 p (˜ 1) = È m 1 ⋮ p (É 341) = Ê m 341 JAM: JOIN-ACCUMULATE MACHINE DRAFT 0.6.6 - May 5, 2025 64 After finding p (y) with such properties, we evaluate p at the following points: (H.13) É r 342 ∶ = p (É 342) É r 343 ∶ = p (É 343) ⋮ Ê r 1022 ∶ = p (Ê 1022) We then distribute the message words and the extra code words among the validators according to their corresponding indices. JAM: JOIN-ACCUMULATE MACHINE DRAFT 0.6.6 - May 5, 2025 65
