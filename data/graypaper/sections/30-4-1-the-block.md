---
type: graypaper_section
title: 4.1 The Block
index: 30
---
To aid comprehension and definition of our protocol, we partition as many of our terms as possible into their functional components. We begin with the block $\block$ which may be restated as the header $\H$ and some input data external to the system and thus said to be *extrinsic*, $\extrinsic$: $$\begin{aligned}
  \block &\equiv \tup{\header, \extrinsic} \\
  \extrinsic &\equiv \tup{\xttickets, \xtdisputes, \xtpreimages, \xtassurances, \xtguarantees}\end{aligned}$$

The header is a collection of metadata primarily concerned with cryptographic references to the blockchain ancestors and the operands and result of the present transition. As an immutable known *a priori*, it is assumed to be available throughout the functional components of block transition. The extrinsic data is split into its several portions:

tickets

:   Tickets, used for the mechanism which manages the selection of validators for the permissioning of block authoring. This component is denoted $\xttickets$.

preimages

:   Static data which is presently being requested to be available for workloads to be able to fetch on demand. This is denoted $\xtpreimages$.

reports

:   Reports of newly completed workloads whose accuracy is guaranteed by specific validators. This is denoted $\xtguarantees$.

availability

:   Assurances by each validator concerning which of the input data of workloads they have correctly received and are storing locally. This is denoted $\xtassurances$.

disputes

:   Information relating to disputes between validators over the validity of reports. This is denoted $\xtdisputes$.
