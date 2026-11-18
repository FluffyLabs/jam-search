---
type: graypaper_section
title: 9.1 Code and Gas
index: 57
---
The code of a service account is identified by a hash which, if the service is to be functional, must be present within its preimage lookup (see section 9.2). We thus define the actual code $\saNcode$: $$\begin{aligned}
  \forall \mathbf{a} \in \serviceaccount : \mathbf{a}_\saNcode \equiv \mathbf{a}_\saNpreimages[\mathbf{a}_\saNcodehash]\end{aligned}$$ To be functional, service code must follow the standard JAM program blob format, defined in appendix 24.7.

There are two entry-points in the code:

0 `refine`

:   Refinement, executed in-core and stateless.[^10]

1 `accumulate`

:   Accumulation, executed on-chain and stateful.

Refinement and accumulation are described in more detail in sections 14.4 and 12.2 respectively.

As stated in appendix 24, execution time in the JAM virtual machine is measured deterministically in units of *gas*, represented as a natural number less than $2^{64}$ and formally denoted $\gas$. There are two limits specified in the account, which determine the minimum gas required in order to execute the *Accumulate* entry-point of the service's code. $\saNminaccgas$ is the minimum gas required per work-item, while $\saNminmemogas$ is the minimum gas required per deferred-transfer.
