---
type: graypaper_section
title: 9.2 Preimage Lookups
index: 58
---
In addition to storing data in arbitrary key/value pairs available only on-chain, an account may also solicit data to be made available also in-core, and thus available to the Refine logic of the service's code. State concerning this facility is held under the service's $\saNpreimages$ and $\saNrequests$ components.

There are several differences between preimage-lookups and storage. Firstly, preimage-lookups act as a mapping from a hash to its preimage, whereas general storage maps arbitrary keys to values. Secondly, preimage data is supplied extrinsically, whereas storage data originates as part of the service's accumulation. Thirdly preimage data, once supplied, may not be removed freely; instead it goes through a process of being marked as unavailable, and only after a period of time may it be removed from state. This ensures that historical information on its existence is retained. The final point especially is important since preimage data is designed to be queried in-core, under the Refine logic of the service's code, and thus it is important that the historical availability of the preimage is known.

We begin by reformulating the portion of state concerning our data-lookup system. The purpose of this system is to provide a means of storing static data on-chain such that it may later be made available within the execution of any service code as a function accepting only the hash of the data and its length in octets.

During the on-chain execution of the *Accumulate* function, this is trivial to achieve since there is inherently a state which all validators verifying the block necessarily have complete knowledge of, i.e. $\thestate$. However, for the in-core execution of *Refine*, there is no such state inherently available to all validators; we thus name a historical state, the *lookup anchor* which must be considered recently finalized before the work's implications may be accumulated hence providing this guarantee.

By retaining historical information on its availability, we become confident that any validator with a recently finalized view of the chain is able to determine whether any given preimage was available at any time within the period where auditing may occur. This ensures confidence that judgments will be deterministic even without consensus on chain state.

Restated, we must be able to define some *historical* lookup function $\histlookup$ which determines whether the preimage of some hash was available for lookup by some service account at some timeslot, and if so, provide it: $$\begin{aligned}
  \histlookup\colon \abracegroup[\ ]{
    \tuple{\serviceaccount, \Nmax{(\H_\Ntimeslot - \Cexpungeperiod) \dots \H_\Ntimeslot}, \hash} &\to \optional{\blob} \\
    (\mathbf{a}, t, \blake{\mathbf{p}}) &\mapsto v : v \in \set{ \mathbf{p}, \none }
  }
\end{aligned}$$

This function is defined shortly below in equation [eq:historicallookup].

The preimage lookup for some service of index $s$ is denoted $\accounts\subb{s}_\saNpreimages$ is a dictionary mapping a hash to its corresponding preimage. Additionally, there is metadata associated with the lookup denoted $\accounts\subb{s}_\saNrequests$ which is a dictionary mapping some hash and presupposed length into historical information.
