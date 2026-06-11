---
type: graypaper_section
title: 11.3 Guarantor Assignments
index: 76
---
As discussed in section 4.9, the amount of in-core computation that is possible scales with the number of validator nodes. Concretely, while there are a fixed number of cores $\Ccorecount = 341$, only the first $\nicefrac{\len{\activeset'}}{3}$ are *active* and capable of processing work-packages.

Every block, each active core has three validators uniquely assigned to guarantee work-reports for it. The core index assigned to each of the validators, as well as the validators' keys are denoted by $\guarantorassignments$: $$\guarantorassignments \in \tuple{\sequence[\len{\activeset'}]{\coreindex}, \sequence[\len{\activeset'}]{\valkey}}$$

We determine the core to which any given validator is assigned through a shuffle using epochal entropy and a periodic rotation to help guard the security and liveness of the network. We use $\entropy_2$ for the epochal entropy rather than $\entropy_1$ to avoid the possibility of fork-magnification where uncertainty about chain state at the end of an epoch could give rise to two established forks before it naturally resolves.

We define the rotation function $R$, the permute function $P$ and finally the guarantor assignments $\guarantorassignments$ as follows: $$\begin{aligned}
  R(\mathbf{c}, n) &\equiv \sq{\build{(x + n) \bmod \frac{\len{\mathbf{c}}}{3}}{x \orderedin \mathbf{c}}}\\
  P(v, e, t) &\equiv R\left(
    \fyshuffle{\sq{\build{\ffrac{i}{3}}{i \orderedin \Nmax{v}}}, e},
    \ffrac{t \bmod \Cepochlen}{\Crotationperiod}
  \right)\\
  \guarantorassignments &\equiv \tup{P(\len{\activeset'}, \entropy'_2, \thetime'), \Phi(\activeset')}\end{aligned}$$

We also define $\guarantorassignmentsunderlastrotation$, which is equivalent to the value $\guarantorassignments$ as it would have been under the previous rotation: $$
  \begin{aligned}
    \using \tup{\mathbf{k}, e} &= \begin{cases}
      \tup{\activeset', \entropy'_2} &\when \displaystyle\ffrac{\thetime' - \Crotationperiod}{\Cepochlen} = \ffrac{\thetime'}{\Cepochlen}\\
      \tup{\previousset', \entropy'_3} &\otherwise
    \end{cases} \\
    \guarantorassignmentsunderlastrotation &\equiv \tup{
      P(\len{\mathbf{k}}, e, \thetime' - \Crotationperiod),
      \Phi(\mathbf{k})
    }
  \end{aligned}$$
