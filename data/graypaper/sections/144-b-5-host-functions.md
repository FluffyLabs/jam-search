---
type: graypaper_section
title: B.5 Host Functions
index: 144
---
We come now to defining the host functions which are utilized by the PVM invocations. These map some PVM state, including invocation context $\context$, possibly together with some additional parameters, to a new PVM state.

All host functions are of the form $\tup{\execst^* \in \set{\blacktriangleright, \panic, \oog}, \gascounter^* \in \gas, \registers^* \in \sequence[13]{\pvmreg}, \memory^* \in \ram, \context^*} = \Omega_\square(\gascounter \in \gas, \registers \in \sequence[13]{\pvmreg}, \memory \in \ram, \context, \dots)$. The gas cost of a host-call is given by $g$, defined in the tables below; should there be insufficient gas to cover this cost, $\execst^* = \oog$ is returned, all remaining gas is consumed, and registers, memory and context are left unchanged. Formally: $$\begin{aligned}
  \gascounter^* &\equiv \max(\gascounter - g, 0)\quad\text{unless $\gascounter^*$ is explicitly defined below} \\
  \tup{\execst^*, \registers^*, \memory^*, \context^*} &\equiv \begin{cases}
    \tup{\oog, \registers, \memory, \context} &\when \gascounter < g \\
    \tup{\execst', \registers', \memory', \context'} &\otherwise
  \end{cases}\end{aligned}$$

Memory-sized gas for host-calls is given by a rate $L$ (gas per 1024 octets) and size $\ell$ (octets). The following defines the gas cost for such a size: $$
  \fnmemgas(L, \ell) \equiv \ceil{\frac{L \cdot \ell}{1024}}$$ With base cost $c$, total gas is $c + \fnmemgas(L, \ell)$. The host-call tables below use this formula for all memory-sized terms.

When transitioning PVM state for a host-call, a number of conditions typically hold true and host functions are defined essentially by their exceptions to these rules. Specifically, the machine does not halt, and RAM, registers and context are unchanged. Formally: $$\execst' \equiv \blacktriangleright,\quad \registers' \equiv \registers,\quad \memory' \equiv \memory,\quad \context' \equiv \context\qquad\text{except as indicated below}$$
