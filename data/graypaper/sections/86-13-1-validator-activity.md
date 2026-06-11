---
type: graypaper_section
title: 13.1 Validator Activity
index: 86
---
The JAM chain does not explicitly issue rewards---we leave this as a job to be done by the staking subsystem (in Polkadot's case envisioned as a system parachain---hosted without fees---in the current imagining of a public JAM network). However, much as with validator punishment information, it is important for the JAM chain to facilitate the arrival of information on validator activity in to the staking subsystem so that it may be acted upon.

Such performance information cannot directly cover all aspects of validator activity; whereas block production, guarantor reports and availability assurance can easily be tracked on-chain, GRANDPA, BEEFY and auditing activity cannot. In the latter case, this is instead tracked with validator voting activity: validators vote on their impression of each other's efforts and a median may be accepted as the truth for any given validator. With an assumption of 50% honest validators, this gives an adequate means of oraclizing this information.

The validator statistics are made on a per-epoch basis and we retain one record of completed statistics ($\valstatsprevious$) together with one record which serves as an accumulator for the present epoch ($\valstatsaccumulator$). For each epoch we track a performance record for each validator. Together with the core and service statistics defined in the following section $\corestats$ and $\servicestats$, these form $\activity$, which is thus a tuple of four elements. $$\begin{aligned}

  \activity &\equiv \tup{\valstatsaccumulator, \valstatsprevious, \corestats, \servicestats}\\
  \tuple{\valstatsaccumulator, \valstatsprevious} &\in \sequence{\tuple{
    \isa{\vsNblocks}{\N}\,,
    \isa{\vsNtickets}{\N}\,,
    \isa{\vsNpreimagecount}{\N}\,,
    \isa{\vsNpreimagesize}{\N}\,,
    \isa{\vsNguarantees}{\N}\,,
    \isa{\vsNassurances}{\N}
%    \isa{\mathbf{u}}{\sequence[\Cvalcount]{\N}}
  }}^2
  \!\!\!\!\!\!\!\!\!\!\\
  \len{\valstatsaccumulator} &= \len{\activeset}\ , \qquad \len{\valstatsprevious} = \len{\previousset}\end{aligned}$$

The six validator statistics we track are:

$\vsNblocks$

:   The number of blocks produced by the validator.

$\vsNtickets$

:   The number of tickets introduced by the validator.

$\vsNpreimagecount$

:   The number of preimages introduced by the validator.

$\vsNpreimagesize$

:   The total number of octets across all preimages introduced by the validator.

$\vsNguarantees$

:   The number of reports guaranteed by the validator.

$\vsNassurances$

:   The number of availability assurances made by the validator.

The objective statistics are updated in line with their description, formally: $$\begin{aligned}
  \begin{split}
    \valstatsaccumulator^\dagger &\equiv \valstatsaccumulator \text{ except } \forall v \in \Nmax{\len{\activeset}}: \\
    \valstatsaccumulator^\dagger\subb{v}_\vsNassurances &=
      \valstatsaccumulator\subb{v}_\vsNassurances +
        (\exists a \in \xtassurances : a_\xaNassurer = v)
  \end{split} \\
  \begin{split}
    \tup{\valstatsaccumulator^\ddagger, \valstatsprevious'} &\equiv \begin{cases}
      \tup{\valstatsaccumulator^\dagger, \valstatsprevious} &\when e' = e \\
      \tup{\sq{\tup{0, \dots}, \dots}, \valstatsaccumulator^\dagger} &\otherwise
    \end{cases} \\
    \where e &= \ffrac{\thetime}{\Cepochlen} \ ,\quad e' = \ffrac{\thetime'}{\Cepochlen}
  \end{split} \\
  \begin{split}
    \valstatsaccumulator' &\equiv \valstatsaccumulator^\ddagger \text{ except } \forall v \in \Nmax{\len{\activeset'}}: \\
    \valstatsaccumulator'\subb{v}_\vsNblocks &=
      \valstatsaccumulator^\ddagger\subb{v}_\vsNblocks + (v = \H_\Nauthorindex)\\
    \valstatsaccumulator'\subb{v}_\vsNtickets &=
      \valstatsaccumulator^\ddagger\subb{v}_\vsNtickets + \begin{cases}
        \len{\xttickets} &\when v = \H_\Nauthorindex \\
        0 &\otherwise
      \end{cases}\\
    \valstatsaccumulator'\subb{v}_\vsNpreimagecount &=
      \valstatsaccumulator^\ddagger\subb{v}_\vsNpreimagecount + \begin{cases}
        \len{\xtpreimages} &\when v = \H_\Nauthorindex \\
        0 &\otherwise
      \end{cases}\\
    \valstatsaccumulator'\subb{v}_\vsNpreimagesize &=
      \valstatsaccumulator^\ddagger\subb{v}_\vsNpreimagesize + \begin{cases}
        \sum_{d \in \xtpreimages}\len{d} &\when v = \H_\Nauthorindex \\
        0 &\otherwise
      \end{cases}\\
    \valstatsaccumulator'\subb{v}_\vsNguarantees &=
      \valstatsaccumulator^\ddagger\subb{v}_\vsNguarantees + (\activeset'\sub{v} \in \reporters)
  \end{split}\end{aligned}$$

Note that $\reporters$ is the *Reporters* set, as defined in equation [eq:guarantorsig].
