---
type: graypaper_section
title: 11.3 Guarantor Assignments
index: 76
---
Every block, each core has three validators uniquely assigned to guarantee work-reports for it. This is borne out with $\Cvalcount = 1,023$ validators and $\Ccorecount = 341$ cores, since $\nicefrac{\Cvalcount}{\Ccorecount} = 3$. The core index assigned to each of the validators, as well as the validators' keys are denoted by $\guarantorassignments$: $$\guarantorassignments \in \tuple{\sequence[\Cvalcount]{\coreindex}, \allvalkeys}$$

We determine the core to which any given validator is assigned through a shuffle using epochal entropy and a periodic rotation to help guard the security and liveness of the network. We use $\entropy_2$ for the epochal entropy rather than $\entropy_1$ to avoid the possibility of fork-magnification where uncertainty about chain state at the end of an epoch could give rise to two established forks before it naturally resolves.

We define the permute function $P$, the rotation function $R$ and finally the guarantor assignments $\guarantorassignments$ as follows: $$\begin{aligned}
  R(\mathbf{c}, n) &\equiv \sq{\build{(x + n) \bmod \Ccorecount}{x \orderedin \mathbf{c}}}\\
  P(e, t) &\equiv R\left(
    \fyshuffle{\sq{\build{\ffrac{\Ccorecount \cdot i}{\Cvalcount}}{i \orderedin \valindex}}, e},
    \ffrac{t \bmod \Cepochlen}{\Crotationperiod}
  \right)\\
  \guarantorassignments &\equiv \tup{P(\entropy'_2, \thetime'), \Phi(\activeset')}\end{aligned}$$

We also define $\guarantorassignmentsunderlastrotation$, which is equivalent to the value $\guarantorassignments$ as it would have been under the previous rotation: $$
  \begin{aligned}
    \using \tup{e, \mathbf{k}} &= \begin{cases}
      \tup{\entropy'_2, \activeset'} &\when \displaystyle\ffrac{\thetime' - \Crotationperiod}{\Cepochlen} = \ffrac{\thetime'}{\Cepochlen}\\
      \tup{\entropy'_3, \previousset'} &\otherwise
    \end{cases} \\
    \guarantorassignmentsunderlastrotation &\equiv \tup{
      P(e, \thetime' - \Crotationperiod),
      \Phi(\mathbf{k})
    }
  \end{aligned}$$
