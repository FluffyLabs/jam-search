---
type: graypaper_section
title: 6.2 Safrole Basic State
index: 46
---
We restate $\safrole$ into a number of components: $$\begin{aligned}
  
  \safrole &\equiv \tuple{
    \pendingset,\,
    \epochroot,\,
    \sealtickets,\,
    \ticketaccumulator
  }\end{aligned}$$

$\epochroot$ is the epoch's root, a Bandersnatch ring root composed with the one Bandersnatch key of each of the next epoch's validators, defined in $\pendingset$ (itself defined in the next section). $$\begin{aligned}
  
  \epochroot &\in \ringroot\end{aligned}$$

Finally, $\ticketaccumulator$ is the ticket accumulator, a sequence of highest-scoring ticket identifiers to be used for the next epoch. $\sealtickets$ is the current epoch's slot-sealer sequence, which is either a full complement of $\Cepochlen$ tickets or, in the case of a fallback mode, a sequence of $\Cepochlen$ Bandersnatch keys: $$\begin{aligned}
  
  \ticketaccumulator \in \sequence[:\Cepochlen]{\safroleticket} \,,\quad
  \sealtickets \in \sequence[\Cepochlen]{\safroleticket} \cup \sequence[\Cepochlen]{\bskey}\end{aligned}$$

Here, $\safroleticket$ is used to denote the set of *tickets*, a combination of a verifiably random ticket identifier $\stNid$ and the ticket's entry-index $\stNentryindex$: $$\begin{aligned}
  
  \safroleticket &\equiv \tuple{
    \isa{\stNid}{\hash},\,
    \isa{\stNentryindex}{\N}
  }\end{aligned}$$

As we state in section 6.4, Safrole requires that every block header $\H$ contain a valid seal $\H_\Nsealsig$, which is a Bandersnatch signature produced with the private key corresponding to the entry at index $m'$ of the current epoch's slot-sealer sequence $\sealtickets'$.
