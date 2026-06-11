---
type: graypaper_section
title: 5 The Header
index: 42
---
We must first define the header in terms of its components. The header comprises a parent hash and prior state root ($\H_\Nparent$ and $\H_\Npriorstateroot$), an extrinsic hash $\H_\Nextrinsichash$, a time-slot index $\H_\Ntimeslot$, the epoch, winning-tickets and offenders markers $\H_\Nepochmark$, $\H_\Nwinnersmark$ and $\H_\Noffendersmark$, a block author index $\H_\Nauthorindex$ and two Bandersnatch signatures; the entropy-yielding VRF signature $\H_\Nvrfsig$ and a block seal $\H_\Nsealsig$. Headers may be serialized to an octet sequence with and without the latter seal component using $\fnencode$ and $\fnencodeunsignedheader$ respectively. Formally: $$
  \theheader \equiv \tup{\H_\Nparent, \H_\Npriorstateroot, \H_\Nextrinsichash, \H_\Ntimeslot, \H_\Nepochmark, \H_\Nwinnersmark, \H_\Noffendersmark, \H_\Nauthorindex, \H_\Nvrfsig, \H_\Nsealsig}$$

The blockchain is a sequence of blocks, each cryptographically referencing some prior block by including a hash derived from the parent's header, all the way back to some first block which references the genesis header. We already presume consensus over this genesis header $\genesisheader$ and the state it represents defined as $\genesisstate$.

Excepting the Genesis header, all block headers $\header$ have an associated parent header, whose hash is $\header_\Nparent$. We denote the parent header $\parentheader{\header} = P\left(\header\right)$: $$\header_\Nparent \in \hash \,,\quad \H_\Nparent \equiv \blake{\encode{P\left(\header\right)}}$$

$P$ is thus defined as being the mapping from one block header to its parent block header. With $P$, we are able to define the set of ancestor headers $\ancestors$: $$\begin{aligned}

  h \in \ancestors \Leftrightarrow h = \header \vee (\exists i \in \ancestors : h = P\left(i\right))\end{aligned}$$

We only require implementations to store headers of ancestors which were authored in the previous $\Cmaxlookupanchorage = 24$ hours of any block $\block$ they wish to validate.

The extrinsic hash is a Merkle commitment to the block's extrinsic data, taking care to allow for the possibility of reports and preimages to individually have their inclusion proven. Given any block $\block = \tup{\header, \extrinsic}$, then formally: $$\begin{aligned}
  \H_\Nextrinsichash &\in \hash \ ,\quad
  \H_\Nextrinsichash \equiv \blake{\encode{\blakemany{\mathbf{a}}}} \\
  \where \mathbf{a} &= \sq{
    \encodetickets{\xttickets},
    \mathbf{p},
    \mathbf{g},
    \encodeassurances{\xtassurances},
    \encodedisputes{\xtdisputes}
  } \\
  \also \mathbf{p} &= \encode{\var{\sq{\build{
    \tup{\encode[4]{\xpNserviceindex}, \blake{\xpNdata}}
  }{
    \tup{\xpNserviceindex, \xpNdata} \orderedin \xtpreimages
  }}}} \\
  \also \mathbf{g} &= \encode{\var{\sq{\build{
    \tup{\blake{\gNworkreport}, \encode[4]{\gNtimeslot}, \var{\gNcredential}}
  }{
    \tup{\gNworkreport, \gNtimeslot, \gNcredential} \orderedin \xtguarantees
  }}}}\end{aligned}$$

A block may only be regarded as valid once the time-slot index $\H_\Ntimeslot$ is in the past. It is always strictly greater than that of its parent. Formally: $$\H_\Ntimeslot \in \timeslot \,,\quad
  P\left(\H\right)_\Ntimeslot < \H_\Ntimeslot\ \wedge\ \H_\Ntimeslot\cdot\Cslotseconds \leq \wallclock$$

Blocks considered invalid by this rule may become valid as $\wallclock$ advances.

The parent state root $\H_\Npriorstateroot$ is the root of a Merkle trie composed by the mapping of the *prior* state's Merkle root, which by definition is also the parent block's posterior state. This is a departure from both Polkadot and the Yellow Paper's Ethereum, in both of which a block's header contains the *posterior* state's Merkle root. We do this to facilitate the pipelining of block computation and in particular of Merklization. $$\H_\Npriorstateroot \in \hash \,,\quad \H_\Npriorstateroot \equiv \merklizestate{\thestate}$$

We assume the state-Merklization function $\fnmerklizestate$ is capable of transforming our state $\thestate$ into a 32-octet commitment. See appendix 27 for a full definition of these two functions.

All blocks have an associated public key to identify the author of the block. We identify this as an index into the posterior current validator set $\activeset'$. We denote the Bandersnatch key of the author as $\H_\Nauthorbskey$ though note that this is merely an equivalence, and is not serialized as part of the header. $$\H_\Nauthorindex \in \Nmax{\len{\activeset'}} \,,\quad \H_\Nauthorbskey \equiv \activeset'[\H_\Nauthorindex]_\vkNbs$$
