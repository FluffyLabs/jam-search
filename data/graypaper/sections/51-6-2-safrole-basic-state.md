---
type: graypaper_section
title: 6.2. Safrole Basic State
index: 51
---
We restate γ into a number of components: γ ≡ ⎧ ⎩ γ k, γ z, γ s, γ a ⎫ ⎭ (6.3) γ z is the epoch’s root, a Bandersnatch ring root composed with the one Bandersnatch key of each of the next epoch’s validators, defined in γ k (itself defined in the next section). γ z ∈ Y R (6.4) Finally, γ a is the ticket accumulator, a series of highestscoring ticket identifiers to be used for the next epoch. γ s is the current epoch’s slot-sealer series, which is either a full complement of E tickets or, in the case of a fallback mode, a series of E Bandersnatch keys: γ a ∈ ⟦ C ⟧ ∶ E, γ s ∈ ⟦ C ⟧ E ∪ ⟦ H B ⟧ E (6.5) Here, C is used to denote the set of tickets, a combination of a verifiably random ticket identifier y and the ticket’s entry-index r : C ≡ ⎧ ⎩ y ∈ H, r ∈ N N ⎫ ⎭ (6.6) As we state in section 6.4, Safrole requires that every block header H contain a valid seal H s, which is a Bandersnatch signature for a public key at the appropriate index m of the current epoch’s seal-key series, present in state as γ s.
