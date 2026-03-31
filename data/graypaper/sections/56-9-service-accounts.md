---
type: graypaper_section
title: 9 Service Accounts
index: 56
---
As we already noted, a service in JAM is somewhat analogous to a smart contract in Ethereum in that it includes amongst other items, a code component, a storage component and a balance. Unlike Ethereum, the code is split over two isolated entry-points each with their own environmental conditions; one, *Refinement*, is essentially stateless and happens in-core, and the other, *Accumulation*, which is stateful and happens on-chain. It is the latter which we will concern ourselves with now.

Service accounts are held in state under $\accounts$, a partial mapping from a service identifier $\serviceid$ into a tuple of named elements which specify the attributes of the service relevant to the JAM protocol. Formally: $$\begin{aligned}

  \serviceid &\equiv \Nbits{32} \\
  \accounts &\in \dictionary{\serviceid}{\serviceaccount}\end{aligned}$$

The service account is defined as the tuple of storage dictionary $\saNstorage$, preimage lookup dictionaries $\saNpreimages$ and $\saNrequests$, code hash $\saNcodehash$, balance $\saNbalance$ and gratis storage offset $\saNgratis$, as well as the two code gas limits $\saNminaccgas$ & $\saNminmemogas$. We also record certain usage characteristics concerning the account: the time slot at creation $\saNcreated$, the time slot at the most recent accumulation $\saNlastacc$ and the parent service $\saNparent$. Formally: $$\begin{aligned}

  \serviceaccount \equiv \tuple{\ \begin{aligned}
    \saNstorage &\in \dictionary{\blob}{\blob}\,,\
    \saNpreimages \in \dictionary{\hash}{\blob}\,,\\
    \saNrequests &\in \dictionary{\tuple{\hash,\bloblength}}{\sequence[:3]{\timeslot}}\,,\\
    \saNgratis &\in \balance\,,\
    \saNcodehash \in \hash\,,\
    \saNbalance \in \balance\,,\
    \saNminaccgas \in \gas\,,\\
    \saNminmemogas &\in \gas\,,\
    \saNcreated \in \timeslot\,,\
    \saNlastacc \in \timeslot\,,\
    \saNparent \in \serviceid\\
    %i, o, f
  \end{aligned}\,}\end{aligned}$$

Thus, the balance of the service of index $s$ would be denoted $\accounts\subb{s}_\saNbalance$ and the storage item of key $\mathbf{k} \in \blob$ for that service is written $\accounts\subb{s}_\saNstorage\subb{\mathbf{k}}$.
