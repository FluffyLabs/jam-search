---
type: graypaper_section
title: A.1 Basic Definition
index: 115
---
We declare the general PVM function $\Psi$. We assume a single-step invocation function define $\Psi_1$ and define the full PVM recursively as a sequence of such mutations up until the single-step mutation results in a halting condition. We additionally define the function $\text{deblob}$ which extracts the instruction data, opcode bitmask and dynamic jump table from a program blob: $$\begin{aligned}
  \Psi&\colon \abracegroup{
    \tuple{\blob, \pvmreg, \gas, \sequence[13]{\pvmreg}, \ram} &\to \tuple{\set{\halt, \panic, \oog} \cup \set{\fault, \host} \times \pvmreg, \pvmreg, \signedgas, \sequence[13]{\pvmreg}, \ram}\\
    \tup{\mathbf{p}, \imath, \gascounter, \registers, {\memory}} &\mapsto \begin{cases}
      \Psi(\mathbf{p}, \imath', \gascounter', \registers', {\memory}') &\when \varepsilon = \blacktriangleright\\
      \tup{\oog, \imath, \gascounter', \registers, {\memory}} &\when \gascounter' < 0\\
      \tup{\varepsilon, 0, \gascounter', \registers', {\memory}'} &\when \varepsilon \in \set{ \panic, \halt }\\
      \tup{\varepsilon, \imath, \gascounter', \registers, {\memory}} &\otherwise
    \end{cases} \\
    \where \tup{\varepsilon, \imath', \gascounter', \registers', {\memory}'} &= \begin{cases}
      \Psi_1(\mathbf{c}, \mathbf{k}, \mathbf{j}, \imath, \gascounter, \registers, {\memory}) &\when \tup{\mathbf{c}, \mathbf{k}, \mathbf{j}} = \text{deblob}(\mathbf{p}) \\
      \tup{\panic, \imath, \gascounter, \registers, {\memory}} &\otherwise
    \end{cases}
  }\\
  \text{deblob}&\colon\abracegroup{
    \blob &\to \tuple{\blob, \bitstring, \sequence{\pvmreg}} \cup \error \\
    \mathbf{p} &\mapsto \begin{cases}
      \tup{\mathbf{c}, \mathbf{k}, \mathbf{j}} &\when \exists!\,\mathbf{c}, \mathbf{k}, \mathbf{j} : \mathbf{p} = \encode{\len{\mathbf{j}}} \concat \encode[1]{z} \concat \encode{\len{\mathbf{c}}} \concat \encode[z]{\mathbf{j}} \concat \encode{\mathbf{c}} \concat \encode{\mathbf{k}}\,,\ \len{\mathbf{k}} = \len{\mathbf{c}} \\
      \error &\otherwise
    \end{cases} \\
  }\end{aligned}$$

The PVM exit reason $\varepsilon \in \set{\halt, \panic, \oog} \cup \set{\fault, \host} \times \pvmreg$ may be one of regular halt $\halt$, panic $\panic$ or out-of-gas $\oog$, or alternatively a host-call $\host$, in which the host-call identifier is associated, or page-fault $\fault$ in which case the address into RAM is associated.

Assuming the program blob is valid (which can be validated statically), some gas is always charged whenever execution is attempted. This is the case even if no instruction is effectively executed and machine state is unchanged (i.e. the result state is equal to the parameter).

In the case of a final halt, either through panic or success, the instruction counter returned is zero. In all other cases, the return value of the instruction counter indexes the one *which caused the exit to happen* and the machine state represents the prior state of said instruction, thus ensuring *de facto* consistency. In order to continue beyond these exit cases, some environmental factor must be adjusted; for a page-fault, RAM must be changed, for a gas-underflow, more gas must be supplied and for a host-call, the instruction-counter must be incremented and the relevant host-call state-transition performed.
