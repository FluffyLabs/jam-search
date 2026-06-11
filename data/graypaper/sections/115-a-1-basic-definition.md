---
type: graypaper_section
title: A.1 Basic Definition
index: 115
---
We declare the general PVM function $\Psi$. We assume a single-step invocation function define $\Psi_1$ and define the full PVM recursively as a sequence of such mutations up until the single-step mutation results in a halting condition. We additionally define the function $\text{deblob}$ which extracts the instruction data, opcode bitmask and dynamic jump table from a PVM program blob, validates its structure, and verifies whether the given $\imath$ is a valid instruction counter location within the program: $$\begin{aligned}
  \Psi&\colon \abracegroup{
    \tuple{\blob, \pvmreg, \gas, \bool, \sequence[13]{\pvmreg}, \ram} &\to \tuple{\set{\halt, \panic, \oog} \cup \set{\fault, \host} \times \pvmreg, \pvmreg, \gas, \bool, \sequence[13]{\pvmreg}, \ram}\\
    \tup{\pvmNblob, \imath, \gascounter, \gaschargedflag, \registers, {\memory}} &\mapsto \begin{cases}
      \Psi(\pvmNblob, \imath', \gascounter', \gaschargedflag', \registers', {\memory}') &\when \varepsilon = \blacktriangleright\\
      \tup{\varepsilon, 0, \gascounter', \gaschargedflag', \registers', {\memory}'} &\when \varepsilon \in \set{ \panic, \halt }\\
      \tup{\varepsilon, \imath, \gascounter', \gaschargedflag', \registers, {\memory}} &\otherwise
    \end{cases} \\
    \where \tup{\varepsilon, \imath', \gascounter', \gaschargedflag', \registers', {\memory}'} &= \begin{cases}
      \Psi_1(\mathbf{c}, \mathbf{k}, \mathbf{j}, \imath, \gascounter, \gaschargedflag, \registers, {\memory}) &\when \tup{\mathbf{c}, \mathbf{k}, \mathbf{j}} = \text{deblob}(\pvmNblob, \imath) \\
      \tup{\panic, \imath, \gascounter, \gaschargedflag, \registers, {\memory}} &\otherwise
    \end{cases}
  }\\
  \text{deblob}&\colon\abracegrouptwo{
    (\blob, \pvmreg) &\to \tuple{\blob, \bitstring, \sequence{\pvmreg}} \cup \error \\
    (\pvmNblob, \imath) &\mapsto \begin{cases}
      \tup{\mathbf{c}, \mathbf{k}, \mathbf{j}} &\when \exists!\,\mathbf{c}, \mathbf{k}, \mathbf{j} : \pvmNblob = \encode{\len{\mathbf{j}}} \concat \encode[1]{z} \concat \encode{\len{\mathbf{c}}} \concat \encode[z]{\mathbf{j}} \concat \encode{\mathbf{c}} \concat \encode{\mathbf{k}}\,,\ \mathfrak{v}_{\text{blob}}(\mathbf{c}, \mathbf{k}, 0) \land \mathfrak{v}_{\text{inst}}(\mathbf{c}, \mathbf{k}, \imath) \\
      \error &\otherwise
    \end{cases} \\
  }{
    \[0.2pt]
    \where \mathfrak{v}_{\text{blob}}\colon&\abracegroup{
      \tuple{\blob, \bitstring, \pvmreg} &\to \bool \\
      (\mathbf{c}, \mathbf{k}, \imath) &\mapsto \begin{cases}
        \top &\when \imath > 0 \land \imath = \len{\mathbf{k}}\\
        \bot &\otherwhen \imath + 1 + \text{skip}(\imath) = \len{\mathbf{k}} \land \mathbf{c}_\imath \not\in T\\
        \mathfrak{v}_{\text{blob}}(\mathbf{c}, \mathbf{k}, \imath + 1 + \text{skip}(\imath)) &\otherwhen \mathfrak{v}_{\text{inst}}(\mathbf{c}, \mathbf{k}, \imath)\\
        \bot &\otherwise
      \end{cases}
    }\\
    \mathfrak{v}_{\text{inst}}\colon&\abracegroup{
      \tuple{\blob, \bitstring, \pvmreg} &\to \bool \\
      (\mathbf{c}, \mathbf{k}, \imath) &\mapsto \len{\mathbf{k}} = \len{\mathbf{c}} \land \imath < \len{\mathbf{k}} \land \mathbf{k}_{\imath} = 1 \land \mathbf{c}_\imath \in U
    }\\
    \[0.2pt]
    &U\text{ and }T\text{ are described in sec. \ref{sec:basicblocks}, and \emph{skip} in eq. \ref{eq:skip}}
  }\end{aligned}$$

The PVM exit reason $\varepsilon \in \set{\halt, \panic, \oog} \cup \set{\fault, \host} \times \pvmreg$ may be one of regular halt $\halt$, panic $\panic$ or out-of-gas $\oog$, or alternatively a host-call $\host$, in which the host-call identifier is associated, or page-fault $\fault$ in which case the address into RAM is associated.

In the case of a final halt, either through panic or success, the instruction counter returned is zero. In all other cases, the return value of the instruction counter indexes the one *which caused the exit to happen* and the machine state represents the prior state of said instruction, thus ensuring *de facto* consistency. In order to continue beyond these exit cases, some environmental factor must be adjusted; for a page-fault, RAM must be changed, for a gas-underflow, more gas must be supplied and for a host-call, the instruction-counter must be incremented and the relevant host-call state-transition performed.
