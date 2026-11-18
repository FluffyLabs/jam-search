---
type: graypaper_section
title: 12.4 Preimage Integration
index: 85
---
After accumulation, we must integrate all preimages provided in the lookup extrinsic to arrive at the posterior account state. The lookup extrinsic is a sequence of pairs of service indices and data, of length at most $\Cmaxxtpreimageslen$. These pairs must be ordered and without duplicates (equation [eq:preimagesareordered] requires this). The data must have been solicited by a service but not yet provided in the *prior* state. The total number of data octets within the lookup extrinsic must not exceed $\Cmaxxtpreimagesdatasize$. Formally: $$\begin{aligned}
  \xtpreimages &\in \sequence[:\Cmaxxtpreimageslen]{\tuple{ \serviceid,\, \blob }} \\
  \xtpreimages &= \sqorderuniqby{i}{i \in \xtpreimages} \\
  \forall \tup{\xpNserviceindex, \xpNdata} &\in \xtpreimages : Y(\accountspre, \xpNserviceindex, \xpNdata) \\
  \sum_{\tup{\xpNserviceindex, \xpNdata} \in \xtpreimages}\!\!\!\!\len{\xpNdata} &\le \Cmaxxtpreimagesdatasize\end{aligned}$$

We disregard, without prejudice, any preimages which due to the effects of accumulation are no longer useful. We define $\accountspostpreimage$ as the state after the integration of the still-relevant preimages: $$\accountspostpreimage = I(\accountspostxfer, \xtpreimages)$$
