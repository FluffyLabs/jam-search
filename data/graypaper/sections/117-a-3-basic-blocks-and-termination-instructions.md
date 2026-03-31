---
type: graypaper_section
title: A.3 Basic Blocks and Termination Instructions
index: 117
---
Instructions of the following opcodes are considered basic-block termination instructions; other than $\token{trap}$ & $\token{fallthrough}$, they correspond to instructions which may define the instruction-counter to be something other than its prior value plus the instruction's skip amount:

-   Trap and fallthrough: $\token{trap}$ , $\token{fallthrough}$

-   Jumps: $\token{jump}$ , $\token{jump\_ind}$

-   Load-and-Jumps: $\token{load\_imm\_jump}$ , $\token{load\_imm\_jump\_ind}$

-   Branches: $\token{branch\_eq}$ , $\token{branch\_ne}$ , $\token{branch\_ge\_u}$ , $\token{branch\_ge\_s}$ , $\token{branch\_lt\_u}$ , $\token{branch\_lt\_s}$ , $\token{branch\_eq\_imm}$ , $\token{branch\_ne\_imm}$

-   Immediate branches: $\token{branch\_lt\_u\_imm}$ , $\token{branch\_lt\_s\_imm}$ , $\token{branch\_le\_u\_imm}$ , $\token{branch\_le\_s\_imm}$ , $\token{branch\_ge\_u\_imm}$ , $\token{branch\_ge\_s\_imm}$ , $\token{branch\_gt\_u\_imm}$ , $\token{branch\_gt\_s\_imm}$

We denote this set, as opcode indices rather than names, as $T$, which is a subset of all valid opcode indices $U$. We define the instruction opcode indices denoting the beginning of basic-blocks as $\varpi$: $$\varpi\equiv \left(\set{0} \cup \set{\build{n + 1 + \text{skip}(n)}{n \in \Nmax{\len{\mathbf{c}}} \wedge \mathbf{k}\sub{n} = 1 \wedge \mathbf{c}\sub{n} \in T}}\right) \cap \set{\build{n}{\mathbf{k}\sub{n} = 1 \wedge \mathbf{c}\sub{n} \in U}}$$
