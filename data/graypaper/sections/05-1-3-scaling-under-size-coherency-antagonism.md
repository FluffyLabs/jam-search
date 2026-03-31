---
type: graypaper_section
title: 1.3 Scaling under Size-Coherency Antagonism
index: 5
---
Size-coherency antagonism is a simple principle implying that as the state-space of information systems grow, then the system necessarily becomes less coherent. It is a direct implication of principle that causality is limited by speed. The maximum speed allowed by physics is $C$ the speed of light in a vacuum, however other information systems may have lower bounds: In biological system this is largely determined by various chemical processes whereas in electronic systems is it determined by the speed of electrons in various substances. Distributed software systems will tend to have much lower bounds still, being dependent on a substrate of software, hardware and packet-switched networks of varying reliability.

The argument goes:

1.  The more state a system utilizes for its data-processing, the greater the amount of space this state must occupy.

2.  The more space used, then the greater the mean and variance of distances between state-components.

3.  As the mean and variance increase, then time for causal resolution (i.e. all correct implications of an event to be felt) becomes divergent across the system, causing incoherence.

Setting the question of overall security aside for a moment, we can manage incoherence by fragmenting the system into causally-independent subsystems, each of which is small enough to be coherent. In a resource-rich environment, a bacterium may split into two rather than growing to double its size. This pattern is rather a crude means of dealing with incoherency under growth: intra-system processing has low size and total coherence, inter-system processing supports higher overall sizes but without coherence. It is the principle behind meta-networks such as Polkadot, Cosmos and the predominant vision of a scaled Ethereum (all to be discussed in depth shortly). Such systems typically rely on asynchronous and simplistic communication with "settlement areas" which provide a small-scoped coherent state-space to manage specific interactions such as a token transfer.

The present work explores a middle-ground in the antagonism, avoiding the persistent fragmentation of state-space of the system as with existing approaches. We do this by introducing a new model of computation which pipelines a highly scalable, *mostly coherent* element to a synchronous, fully coherent element. Asynchrony is not avoided, but we bound it to the length of the pipeline and substitute the crude partitioning we see in scalable systems so far with a form of "cache affinity" as it typically seen in multi-CPU systems with a shared RAM.

Unlike with SNARK-based L2-blockchain techniques for scaling, this model draws upon crypto-economic mechanisms and inherits their low-cost and high-performance profiles and averts a bias toward centralization.
