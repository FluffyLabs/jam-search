---
type: graypaper_section
title: A.5 Instruction Tables
index: 119
---
Only instructions which are defined in the following tables and whose opcode has its corresponding bit set in the bitmask are considered valid, otherwise the instruction behaves as-if its opcode was equal to zero. Assuming $U$ denotes all valid opcode indices, formally: $$\text{opcode}\colon\abracegroup{
    \N &\to \N\\
    n &\mapsto \begin{cases}
    \mathbf{c}\sub{n} &\when \mathbf{k}\sub{n} = 1 \wedge \mathbf{c}\sub{n} \in U \\
    0 &\otherwise
    \end{cases}
  }$$

We assume the skip length $\ell$ is well-defined: $$\ell \equiv \text{skip}(\imath)$$
