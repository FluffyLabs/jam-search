---
type: graypaper_section
title: 6 Block Production and Chain Growth
index: 44
---
As mentioned earlier, JAM is architected around a hybrid consensus mechanism, similar in nature to that of Polkadot's BABE/GRANDPA hybrid. JAM's block production mechanism, termed Safrole after the novel Sassafras production mechanism of which it is a simplified variant, is a stateful system rather more complex than the Nakamoto consensus described in the *YP*.

The chief purpose of a block production consensus mechanism is to limit the rate at which new blocks may be authored and, ideally, preclude the possibility of "forks": multiple blocks with equal numbers of ancestors.

To achieve this, Safrole limits the possible author of any block within any given six-second timeslot to a single key-holder from within a prespecified sequence of *validators*. Furthermore, under normal operation, the identity of the key-holder of any future timeslot will have a very high degree of anonymity. As a side effect of its operation, we can generate a high-quality pool of entropy which may be used by other parts of the protocol and is accessible to services running on it.

Because of its tightly scoped role, the core of Safrole's state, $\safrole$, is independent of the rest of the protocol. It interacts with other portions of the protocol through $\stagingset$ and $\activeset$, the prospective and active sequences of validator keys respectively; $\thetime$, the most recent block's timeslot; and $\entropy$, the entropy accumulator.

The Safrole protocol determines, once per epoch, a *slot-sealer sequence* $\sealtickets$ of $\Cepochlen$ entries, one for each potential block within the epoch. Under normal operation, each entry is a *ticket*: an anonymous claim to a timeslot. Each block header includes its timeslot index $\H_\Ntimeslot$ (the number of six-second periods since the JAM Common Era began) and a valid seal signature $\H_\Nsealsig$, signed by the validator holding the secret key corresponding to the entry at the relevant index of $\sealtickets$. Each ticket is in fact a pseudonym for some validator which was agreed the privilege of authoring a block in the corresponding timeslot.

In order to generate $\sealtickets$ while keeping the correspondence between tickets and validators anonymous, we use a novel RingVRF cryptographic scheme built on the Bandersnatch curve. This scheme allows validators to provide a proof which simultaneously: (1) guarantees the author controlled a key within the validator key sequence, and (2) produces an unbiasable deterministic hash output, giving us a secure verifiable random function (VRF). This anonymous VRF output is the *ticket identifier*. Validators submit their tickets throughout the epoch, accumulating them in $\ticketaccumulator$. The tickets with the best scores are then selected to populate the next epoch's slot-sealer sequence $\sealtickets$, determining which validator may author a block in each corresponding timeslot.
