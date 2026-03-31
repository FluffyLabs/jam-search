---
type: graypaper_section
title: 9.2.2 Semantics
index: 60
---
The historical status component $h \in \sequence[:3]{\timeslot}$ is a sequence of up to three time slots and the cardinality of this sequence implies one of four modes:

-   $h = \sequence{}$: The preimage is *requested*, but has not yet been supplied.

-   $h \in \sequence[1]{\timeslot}$: The preimage is *available* and has been from time $h_0$.

-   $h \in \sequence[2]{\timeslot}$: The previously available preimage is now *unavailable* since time $h_1$. It had been available from time $h_0$.

-   $h \in \sequence[3]{\timeslot}$: The preimage is *available* and has been from time $h_2$. It had previously been available from time $h_0$ until time $h_1$.

The historical lookup function $\histlookup$ may now be defined as: $$\begin{aligned}
    &\histlookup\colon \tuple{\serviceaccount, \timeslot, \hash} \to \optional{\blob} \\
    &\histlookup(\mathbf{a}, t, h) \equiv \begin{cases}
      \mathbf{a}_\saNpreimages\subb{h}\!\!\!\! &\when h \in \keys{\mathbf{a}_\saNpreimages} \wedge I(\mathbf{a}_\saNrequests\subb{h, \len{\mathbf{a}_\saNpreimages\subb{h}}}, t) \!\!\!\!\! \\
      \none &\otherwise
    \end{cases}\\
    &\where I(\mathbf{l}, t) = \begin{cases}
      \bot &\when \sq{} = \mathbf{l} \\
      x \le t &\when \sq{x} = \mathbf{l} \\
      x \le t < y &\when \sq{x, y} = \mathbf{l} \\
      x \le t < y \vee z \le t &\when \sq{x, y, z} = \mathbf{l} \\
    \end{cases}
  \end{aligned}$$
