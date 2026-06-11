---
type: graypaper_section
title: 6.7 The Extrinsic and Tickets
index: 51
---
The extrinsic $\xttickets$ is a sequence of proofs of valid tickets; a ticket implies an entry in our epochal "contest" to determine which validators are privileged to author a block for each timeslot in the following epoch. Tickets specify an entry index (a natural number less than the maximum number of ticket entries per validator, defined in equation [eq:ticketsextrinsic]) together with a proof of ticket's validity. The proof implies a ticket identifier, a high-entropy unbiasable 32-octet sequence, which is used both as a score in the aforementioned contest and as input for the block's entropy source $\textsc{vrf}$ signature.

Towards the end of the epoch (i.e. $\Cepochtailstart$ slots from the start) this contest is closed implying successive blocks within the same epoch must have an empty tickets extrinsic. At this point, the following epoch's slot-sealer sequence becomes fixed.

We define the extrinsic as a sequence of proofs of valid tickets, each of which is a tuple of an entry index and a proof of ticket validity. To ensure the accumulator can be saturated, when there are fewer validators, each validator is permitted more tickets. Formally: $$\begin{aligned}
  
  \begin{split}
    \xttickets &\in \sequence{\tuple{
      \isa{\xtNentryindex}{\Nmax{n}},\,
      \isa{\xtNproof}{\bsringproof{\epochroot'}{\Xticket \concat \entropy'_2 \append \xtNentryindex}{\sq{}}}
    }} \\
    &\phantom{{}\in{}} \where n = \ceil{\frac{2\Cepochlen}{\len{\pendingset'}}}
  \end{split} \\
  
  \len{\xttickets} &\le \begin{cases}
      \Cmaxblocktickets &\when m' < \Cepochtailstart \\
      0 &\otherwise
  \end{cases}\end{aligned}$$

We define $\mathbf{n}$ as the sequence of new tickets, with the ticket identifier, a hash, defined as the output component of the Bandersnatch RingVRF proof: $$\begin{aligned}
  \mathbf{n} &\equiv \sq{\build{
    \tup{
      \is{\stNid}{\banderout{i_\xtNproof}},\,
      \is{\stNentryindex}{i_\stNentryindex}
    }
  }{
    i \orderedin \xttickets
  }}\end{aligned}$$

The tickets submitted via the extrinsic must already have been placed in order of their implied identifier. Duplicate identifiers are never allowed lest a validator submit the same ticket multiple times: $$\begin{aligned}
  \mathbf{n} &= \sqorderuniqby{x_\stNid}{x \in \mathbf{n}} \\
  \set{ \build{ x_\stNid }{ x \in \mathbf{n} }} &\disjoint \set{ \build { x_\stNid }{ x \in \ticketaccumulator }}\end{aligned}$$

The new ticket accumulator $\ticketaccumulator'$ is constructed by merging new tickets into the previous accumulator value (or the empty sequence if it is a new epoch): $$\begin{aligned}
    \ticketaccumulator' &\equiv  {\overrightarrow{\sqorderby{x_\stNid}{x \in \mathbf{n} \cup \begin{cases} \none\ &\when e' > e \\ \ticketaccumulator\ &\otherwise \end{cases}}~}}^\Cepochlen \\
  \end{aligned}$$

The maximum size of the ticket accumulator is $\Cepochlen$. On each block, the accumulator becomes the lowest items of the sorted union of tickets from prior accumulator $\ticketaccumulator$ and the submitted tickets. It is invalid to include useless tickets in the extrinsic, so all submitted tickets must exist in their posterior ticket accumulator. Formally: $$\begin{aligned}
  \mathbf{n} \subseteq \ticketaccumulator'\end{aligned}$$

Note that it can be shown that in the case of an empty extrinsic $\xttickets = \sq{}$, as implied by $m' \ge \Cepochtailstart$, and unchanged epoch ($e' = e$), then $\ticketaccumulator' = \ticketaccumulator$.
