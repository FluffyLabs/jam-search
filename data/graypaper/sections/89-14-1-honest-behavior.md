---
type: graypaper_section
title: 14.1 Honest Behavior
index: 89
---
We have so far specified how to recognize blocks for a correctly transitioning JAM blockchain. Through defining the state transition function and a state Merklization function, we have also defined how to recognize a valid header. While it is not especially difficult to understand how a new block may be authored for any node which controls a key which would allow the creation of the two signatures in the header, nor indeed to fill in the other header fields, readers will note that the contents of the extrinsic remain unclear.

We define not only correct behavior through the creation of correct blocks but also *honest behavior*, which involves the node taking part in several *off-chain* activities. This does have analogous aspects within *YP* Ethereum, though it is not mentioned so explicitly in said document: the creation of blocks along with the gossiping and inclusion of transactions within those blocks would all count as off-chain activities for which honest behavior is helpful. In JAM's case, honest behavior is well-defined and expected of at least $\twothirds$ of validators.

Beyond the production of blocks, incentivized honest behavior includes:

-   the guaranteeing and reporting of work-packages, along with chunking and distribution of both the chunks and the work-package itself, discussed in section 15;

-   assuring the availability of work-packages after being in receipt of their data;

-   determining which work-reports to audit, fetching and auditing them, and creating and distributing judgments appropriately based on the outcome of the audit;

-   submitting the correct amount of auditing work seen being done by other validators, discussed in section 13.
