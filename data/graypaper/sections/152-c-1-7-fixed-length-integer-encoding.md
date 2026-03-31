---
type: graypaper_section
title: C.1.7 Fixed-length Integer Encoding
index: 152
---
We first define the trivial natural number serialization functions which are subscripted by the number of octets of the final sequence. Values are encoded in a regular little-endian fashion. This is utilized for almost all integer encoding across the protocol. Formally: $$\fnencode[l \in \N]\colon\abracegroup{
    \Nbits{8l} &\to \blob[l] \\
    x &\mapsto \begin{cases}
      \sq{} &\when l = 0 \\
      \sq{x \bmod 256} \concat \encode[l - 1]{\floor{\frac{x}{256}}} &\otherwise
    \end{cases}
  }$$

For non-natural arguments, $\fnencode[l \in \N]$ corresponds to the definitions of $\fnencode$, except that recursive elements are made as $\fnencode[l]$ rather than $\fnencode$. Thus: $$\begin{aligned}
  \encode[l \in \N]{a, b, \dots} &\equiv \encode[l]{\tup{a, b, \dots}}\\
  \encode[l \in \N]{\tup{a, b, \dots}} &\equiv \encode[l]{a} \concat \encode[l]{b} \concat \dots\\
  \encode[l \in \N]{\sq{\mathbf{i}_0, \mathbf{i}_1, \dots}} &\equiv \encode[l]{\mathbf{i}_0} \concat \encode[l]{\mathbf{i}_1} \concat \dots\end{aligned}$$

And so on.
