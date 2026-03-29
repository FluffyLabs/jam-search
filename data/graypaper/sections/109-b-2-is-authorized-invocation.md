---
type: graypaper_section
title: B.2. Is-Authorized Invocation
index: 109
---
The Is-Authorized invocation is the first and simplest of the four, being totally stateless. It provides only host-call functions for inspecting its environment and parameters. It accepts as arguments only the core on which it should be executed, c. Formally, it is defined as Ψ I : Ψ I ∶ ⎧ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎨ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎩ (P, N C) → ⎧ ⎩ Y ∪ J, N G ⎫ ⎭ (p, c) ↦ ⎧ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎨ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎪ ⎩ ⎧ ⎩ BAD, 0 ⎫ ⎭ if S p c S = ∅ ⎧ ⎩ BIG, 0 ⎫ ⎭ otherwise if S p c S > W A ⎧ ⎩ r, u ⎫ ⎭ otherwise where (u, r, ∅) = Ψ M (p c, 0, G I, E 2 (c), F, ∅) (B.1) F ∈ Ω ⟨{}⟩ ∶ (n, ϱ, ω, μ) ↦ ⎧ ⎪ ⎪ ⎪ ⎪ ⎨ ⎪ ⎪ ⎪ ⎪ ⎩ Ω G (ϱ, ω, μ) if n = gas Ω Y (ϱ, ω, μ, p, p, ∅, ∅, ∅, ∅, ∅, ∅, ∅) if n = fetch (▸, ϱ − 10, [ ω 0 ,. .., ω 6, WHAT, ω 8 ,. .. ], μ) otherwise (B.2) Note for the Is-Authorized host-call dispatch function F in equation B.2, we elide the host-call context since, being essentially stateless, it is always ∅.
