---
type: graypaper_section
title: C.1.4 Bit Sequence Encoding
index: 149
---
A sequence of bits $b \in \bitstring$ is a special case since encoding each individual bit as an octet would be very wasteful. We instead pack the bits into octets in order of least significant to most, and arrange into an octet stream. In the case of a variable length sequence, then the length is prefixed as in the general case. $$\begin{aligned}
  \encode{b \in \bitstring} &\equiv \begin{cases}
    \sq{} &\when b = \sq{} \\
    \sq{
      \sum\limits_{i=0}^{i < \min(8, \len{b})}
      b\sub{i} \cdot 2^i
    } \concat \encode{b\interval{8}{}} &\otherwise\\
  \end{cases}\end{aligned}$$
