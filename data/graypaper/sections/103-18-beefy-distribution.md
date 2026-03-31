---
type: graypaper_section
title: 18 Beefy Distribution
index: 103
---
For each finalized block $\block$ which a validator imports, said validator shall make a BLS signature on the BLS- curve, as defined by [@bls12-381], affirming the Keccak hash of the block's most recent BEEFY MMR. This should be published and distributed freely, along with the signed material. These signatures may be aggregated in order to provide concise proofs of finality to third-party systems. The signing and aggregation mechanism is defined fully by [@cryptoeprint:2022/1611].

Formally, let $\accoutcommitment{v}$ be the signed commitment of validator index $v$ which will be published: $$\begin{aligned}

  \accoutcommitment{v} &\equiv \blssigndata{\activeset'\sub{v}}{\Xbeefy \concat \text{last}(\recenthistory)_\rhNaccoutlogsuperpeak}\\
  \Xbeefy &= \token{\$jam\_beefy}\end{aligned}$$
