---
type: graypaper_section
title: 12.4 Preimage Integration
index: 84
---
After accumulation, we must integrate all preimages provided in the lookup extrinsic to arrive at the posterior account state. The lookup extrinsic is a sequence of pairs of service indices and data. These pairs must be ordered and without duplicates (equation [eq:preimagesareordered] requires this). The data must have been solicited by a service but not yet provided in the *prior* state. Formally: $$\begin{aligned}
  \xtpreimages &\in \sequence{\tuple{ \serviceid,\, \blob }} \\
  \xtpreimages &= \sqorderuniqby{i}{i \in \xtpreimages} \\
  \forall \tup{\xpNserviceindex, \xpNdata} &\in \xtpreimages : Y(\accountspre, \xpNserviceindex, \xpNdata)\end{aligned}$$

We disregard, without prejudice, any preimages which due to the effects of accumulation are no longer useful. We define $\accountspostpreimage$ as the state after the integration of the still-relevant preimages: $$\accountspostpreimage = I(\accountspostxfer, \xtpreimages)$$
