---
type: graypaper_section
title: 19 Grandpa and the Best Chain
index: 104
---
Nodes take part in the GRANDPA protocol as defined by [@stewart2020grandpa].

We define the latest finalized block as $\block^\natural$. All associated terms concerning block and state are similarly superscripted. We consider the *best block*, $\block^\flat$ to be that which is drawn from the set of acceptable blocks of the following criteria:

-   Has the finalized block as an ancestor.

-   Contains no unfinalized blocks where we see an equivocation (two valid blocks at the same timeslot).

-   Is considered audited.

Formally: $$\begin{aligned}
  \ancestors(\header^\flat) &\owns \header^\natural\\
  \isaudited^\flat&\equiv \top \\
  \not\exists \header^A, \header^B &: \bigwedge \abracegroup[\,]{
    \header^A &\ne \header^B \\
    \header^A_\Ntimeslot &= \header^B_\Ntimeslot \\
    \header^A &\in \ancestors(\header^\flat) \\
    \header^A &\not\in \ancestors(\header^\natural)
  }\end{aligned}$$

Of these acceptable blocks, that which contains the most ancestor blocks whose author used a slot-sealer ticket, rather than a fallback key should be selected as the best head, and thus the chain on which the participant should make GRANDPA votes.

Formally, we aim to select $\block^\flat$ to maximize the value $m$ where: $$m = \sum_{\header^A \in \ancestors^\flat} \isticketed^A$$

The specific data to be voted on in GRANDPA shall be the block header of the best block, $\block^\flat$ together with its *posterior* state root, $\merklizestate{\thestate'}$. The state root has no direct relevance to the GRANDPA protocol, but is included alongside the header during voting/signing into order to ensure that systems utilizing the output of GRANDPA are able to verify the most recent chain state as possible.

This implies that the posterior state must be known at the time that GRANDPA voting occurs in order to finalize the block. However, since GRANDPA is relied on primarily for state-root verification it makes little sense to finalize a block without an associated commitment to the posterior state.

The posterior state only affects GRANDPA voting in so much as votes for the same block hash but with different associated posterior state roots are considered votes for different blocks. This would only happen in the case of a misbehaving node or an ambiguity in the present document.
