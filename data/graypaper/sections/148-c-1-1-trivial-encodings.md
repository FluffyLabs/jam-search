---
type: graypaper_section
title: C.1.1 Trivial Encodings
index: 148
---
We define the serialization of $\none$ as the empty sequence: $$\encode{\none} \equiv \sq{}$$

We also define the serialization of an octet-sequence as itself: $$\encode{x \in \blob} \equiv x$$

We define anonymous tuples to be encoded as the concatenation of their encoded elements: $$\encode{\tup{a, b, \dots}} \equiv \encode{a} \concat \encode{b} \concat \dots$$

Passing multiple arguments to the serialization functions is equivalent to passing a tuple of those arguments. Formally: $$\begin{aligned}
  \encode{a, b, \dots} &\equiv \encode{\tup{a, b, \dots}}\end{aligned}$$

We define general natural number serialization, able to encode naturals of up to $2^{64}$, as: $$\fnencode\colon\abracegroup{
    \Nbits{64} &\to \blob[1:9] \\
    x &\mapsto \begin{cases}
     \sq{0} &\when x = 0 \\
      \sq{2^8-2^{8-l} + \ffrac{x}{2^{8l}}} \concat \encode[l]{x \bmod 2^{8l}} &\when \exists l \in \N_8 : 2^{7l} \le x < 2^{7(l+1)} \\
     \sq{2^8-1} \concat \encode[8]{x} &\otherwhen x < 2^{64} \\
    \end{cases}
  }$$
