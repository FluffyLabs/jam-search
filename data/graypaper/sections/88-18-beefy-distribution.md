---
type: graypaper_section
title: 18. Beefy Distribution
index: 88
---
For each finalized block B which a validator imports, said validator shall make a bls signature on the bls 12 - 381 curve, as defined by Hopwood et al. 2020, affirming the Keccak hash of the block’s most recent Beefy mmr. This should be published and distributed freely, along with the signed material. These signatures may be aggregated in order to provide concise proofs of finality to third-party systems. The signing and aggregation mechanism is defined fully by Jeff Burdges, Ciobotaru, et al. 2022. Formally, let F v be the signed commitment of validator index v which will be published: F v ≡ S κ ′ v (X B ⌢ H K (E M (last (β) b ])) (18.1) X B = $jam_beefy (18.2)
