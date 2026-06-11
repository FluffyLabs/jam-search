---
type: graypaper_section
title: 4.7 The Virtual Machine and Gas
index: 37
---
In the present work, we presume the definition of a *Polkadot Virtual Machine* (PVM). This virtual machine is based around the RISC-V instruction set architecture, specifically the RVEM variant, and is the basis for introducing permissionless logic into our state-transition function.

The PVM is comparable to the EVM defined in the Yellow Paper, but somewhat simpler: the complex instructions for cryptographic operations are missing as are those which deal with environmental interactions. Overall it is far less opinionated since it alters a pre-existing general purpose design, RISC-V, and optimizes it for our needs. This gives us excellent pre-existing tooling, since PVM remains essentially compatible with RISC-V, including support from the compiler toolkit LLVM and languages such as Rust and C++. Furthermore, the instruction set simplicity which RISC-V and PVM share, together with the register size (64-bit), active number (13) and endianness (little) make it especially well-suited for creating efficient recompilers on to common hardware architectures.

The PVM is fully defined in appendix 24, but for contextualization we will briefly summarize the basic invocation function $\Psi$ which computes the resultant state of a PVM instance initialized with some registers ($\sequence[13]{\pvmreg}$) and RAM ($\ram$), within the limits of some amount of gas ($\gas$), a number of approximately time-proportional computational steps: $$\Psi\colon
  \tuple{\,
    \begin{alignedat}{2}
      &\blob,\,\ \ &&\pvmreg\\
      &\gas,\,\ \ &&\bool\\
      &\sequence[13]{\pvmreg},\,\ \ &&\ram\\
    \end{alignedat}
  \,}
  \to
  \tuple{\,
    \begin{aligned}
      &\set{\halt, \panic, \oog} \cup \set{\fault,\host} \times \pvmreg, \pvmreg,\\
      &\gas,\ \ \ \bool,\ \ \ \sequence[13]{\pvmreg},\ \ \ \ram
    \end{aligned}
  \,}$$

We refer to the time-proportional computational steps as *gas* (much like in the *YP*) and limit it to a 64-bit quantity. Within the context of the PVM, $\gascounter \in \gas$ is typically used to denote gas, but we may also use $\gascounter \in \signedgas$ internally within the definition of the PVM where it may be convenient. $$
  \signedgas \equiv \Z_{-2^{63}\dots2^{63}}\ ,\quad
  \gas \equiv \Nbits{64}\ ,\quad
  \pvmreg \equiv \Nbits{64}$$

It is left as a rather important implementation detail to ensure that the amount of time taken while computing the function $\Psi(\dots, \gascounter, \dots)$ has a maximum computation time approximately proportional to the value of $\gascounter$ regardless of other operands.

The PVM is a very simple RISC *register machine* and as such has 13 registers, each of which is a 64-bit quantity, denoted as $\pvmreg$, a natural less than $2^{64}$.[^9] Within the context of the PVM, $\registers \in \sequence[13]{\pvmreg}$ is typically used to denote the registers. $$\begin{aligned}

  \ram &\equiv \tuple{
    \isa{\ramNvalue}{\blob[2^{32}]},
    \isa{\ramNaccess}{\sequence[p]{\set{\text{W}, \text{R}, \none}}}
  }\,,\ p = \frac{2^{32}}{\Cpvmpagesize}\\
  \Cpvmpagesize &= 2^{12}\end{aligned}$$

The PVM assumes a simple pageable RAM of 32-bit addressable octets situated in pages of $\Cpvmpagesize = 4096$ octets where each page may be either immutable, mutable or inaccessible. The RAM definition $\ram$ includes two components: a value $\ramNvalue$ and access $\ramNaccess$. If the component is unspecified while being subscripted then the value component may be assumed. Within the context of the virtual machine, $\memory \in \ram$ is typically used to denote RAM. $$\begin{aligned}
  \readable{\memory} &\equiv \set{\build{i}{\memory_\ramNaccess\subb{\floor{\nicefrac{i}{\Cpvmpagesize}}} \ne \none}} \\
  \writable{\memory} &\equiv \set{\build{i}{\memory_\ramNaccess\subb{\floor{\nicefrac{i}{\Cpvmpagesize}}} = \text{W} }}\end{aligned}$$

We define two sets of indices for the RAM $\memory$: $\readable{\memory}$ is the set of indices which may be read from; and $\writable{\memory}$ is the set of indices which may be written to.

Invocation of the PVM has an exit-reason as the first item in the resultant tuple. It is either:

-   Regular program termination caused by an explicit halt instruction, $\halt$.

-   Irregular program termination caused by some exceptional circumstance, $\panic$.

-   Exhaustion of gas, $\oog$.

-   A page fault (attempt to access some address in RAM which is not accessible), $\fault$. This includes the address of the page at fault.

-   An attempt at progressing a host-call, $\host$. This allows for the progression and integration of a context-dependent state-machine beyond the regular PVM.

The full definition follows in appendix 24.
