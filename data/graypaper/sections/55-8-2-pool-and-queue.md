---
type: graypaper_section
title: 8.2 Pool and Queue
index: 55
---
We define the set of authorizers allowable for a particular core $\Ncore$ as the *authorizer pool* $\authpool[\Ncore]$. To maintain this value, a further portion of state is tracked for each core: the core's current *authorizer queue* $\authqueue[\Ncore]$, from which we draw values to fill the pool. Formally: $$
  \authpool \in \sequence[\Ccorecount]{\sequence[:\Cauthpoolsize]{\hash}}\ , \qquad
  \authqueue \in \sequence[\Ccorecount]{\sequence[\Cauthqueuesize]{\hash}}$$

Note: The portion of state $\authqueue$ may be altered only through an exogenous call made from the accumulate logic of an appropriately privileged service.

The state transition of a block involves placing a new authorization into the pool from the queue: $$\begin{aligned}
  &\forall \Ncore \in \coreindex : \authpool'\subb{\Ncore} \equiv {\overleftarrow{F(\Ncore) \append \cyclic{\authqueue'\subb{\Ncore}\subb{\H_\Ntimeslot}}}}^{\Cauthpoolsize} \\
  &F(\Ncore) \equiv \begin{cases} \authpool[\Ncore] \seqminusl \set{(g_\gNworkreport)_\wrNauthorizer} &\when \exists g \in \xtguarantees : (g_\gNworkreport)_\Ncore = \Ncore \\ \authpool[\Ncore] & \otherwise \end{cases}\end{aligned}$$

Since $\authpool'$ is dependent on $\authqueue'$, practically speaking, this step must be computed after accumulation, the stage in which $\authqueue'$ is defined. Note that we utilize the guarantees extrinsic $\xtguarantees$ to remove the oldest authorizer which has been used to justify a guaranteed work-package in the current block. This is further defined in equation [eq:guaranteesextrinsic].
