---
type: graypaper_section
title: A.8. Argument Invocation Definition
index: 106
---
The four instances where the pvm is utilized each expect to be able to pass argument data in and receive some return data back. We thus define the common pvm program-argument invocation function Ψ M : (A.43) Ψ M ∶ ⎧ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎨ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎩ (Y, N R, N G, Y ∶ Z I, Ω ⟨ X ⟩, X) → (N G, Y ∪ { ☇, ∞ }, X) (p, ı, ϱ, a, f, x) ↦ ⎧ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎨ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎩ (0, ☇, x) if Y (p, a) = ∅ R (ϱ, Ψ H (c, ı, ϱ, ω, μ, f, x)) if Y (p, a) = (c, ω, μ) where R ∶ (ϱ, ⎧ ⎪ ⎪ ⎪ ⎪ ⎪ ⎩ ε, ı ′, ϱ ′, ω ′, μ ′, x ′ ⎫ ⎪ ⎪ ⎪ ⎪ ⎪ ⎭) ↦ ⎧ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎨ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎩ (u, ∞, x ′) if ε = ∞ (u, μ ′ ω ′ 7 ⋅⋅⋅+ ω ′ 8, x ′) if ε = ∎ ∧ N ω ′ 7 ⋅⋅⋅+ ω ′ 8 ⊆ V μ ′ (u, [], x ′) if ε = ∎ ∧ N ω ′ 7 ⋅⋅⋅+ ω ′ 8 ~ ⊆ V μ ′ (u, ☇, x ′) otherwise where u = ϱ − max (ϱ ′, 0) Note that the first tuple item is the amount of gas consumed by the operation, but never greater than the amount of gas provided for the operation.
