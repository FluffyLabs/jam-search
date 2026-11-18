---
type: graypaper_section
title: A.6 Host Call Definition
index: 134
---
An extended version of the PVM invocation which is able to progress an inner *host-call* state-machine in the case of a host-call halt condition is defined as $\Psi_H$: $$\begin{aligned}
  &\Psi_H^*\colon \abracegroup{
    \tuple{\begin{aligned}
      &\blob, \pvmreg, \gas, \bool,\\&\sequence[13]{\pvmreg}, \ram, \contextmutator{X}, X
    \end{aligned}
    }
    &\to
    \tuple{\set{\panic, \oog, \halt} \cup \set{\fault} \times \pvmreg, \pvmreg, \gas, \bool, \sequence[13]{\pvmreg}, \ram, X}\\
    \tup{\pvmNblob, \imath, \gascounter, \gaschargedflag, \registers, {\memory}, f, \context} &\mapsto \begin{cases}
      \multicolumn{2}{l}{\text{let }(\varepsilon', \imath', \gascounter', \gaschargedflag', \registers', {\memory}') = \Psi(\pvmNblob, \imath, \gascounter, \gaschargedflag, \registers, {\memory}):} \[8pt]
      \tup{\varepsilon', \imath', \gascounter', \gaschargedflag', \registers', {\memory}', \context} &\when \varepsilon' \in \set{ \halt, \panic, \oog } \cup \set{\fault} \times \pvmreg \[4pt]
      \begin{aligned}
        &\Psi_H^*(\pvmNblob, \imath'', \gascounter'', \gaschargedflag', \registers'', {\memory}'', f, \context'')\[2pt]
        &\quad \where \imath'' = \imath' + 1 + \text{skip}(\imath')
      \end{aligned}
       &\when \bigwedge\abracegroup[\;]{
        &\varepsilon' = \host \times h\[2pt]
        &\tup{\blacktriangleright, \gascounter'', \registers'', {\memory}'', \context''} = f(h, \gascounter', \registers', {\memory}', \context)
      }\[8pt]
      \tup{\varepsilon'', \imath', \gascounter'', \gaschargedflag', \registers'', {\memory}'', \context''} &\when  \bigwedge\abracegroup[\;]{
        &\varepsilon' = \host \times h\[2pt]
        &\tup{\varepsilon'', \gascounter'', \registers'', {\memory}'', \context''} = f(h, \gascounter', \registers', {\memory}', \context)\[2pt]
        &\varepsilon'' \in \set{\panic, \oog}
      }\[8pt]
    \end{cases} \\
    }\!\!\!\!\!\!\!\!\\
    &\Psi_H(\pvmNblob, \imath, \gascounter, \registers, {\memory}, f, \context) \equiv \Psi_H^*(\pvmNblob, \imath, \gascounter, \bot, \registers, {\memory}, f, \context)\\
    &\contextmutator{X} \equiv \tuple{\N, \gas, \sequence[13]{\pvmreg}, \ram, X} \to \tuple{\set{\blacktriangleright, \panic, \oog}, \gas, \sequence[13]{\pvmreg}, \ram, X}\end{aligned}$$

As with $\Psi$, on exit the instruction counter references the instruction *which caused the exit* and the machine state is that prior to this instruction. Should the machine be invoked again using this instruction counter and code, then the same instruction which caused the exit would be executed on the proper (prior) machine state.

With $\Psi_H$, host-calls (i.e. instructions) are in effect handled internally with the state-mutator function provided as an argument, preventing the possibility of the result being a host-call fault. Note that in the case of a successful host-call transition, we must provide the new instruction counter value $\imath''$ explicitly alongside the fresh posterior state for said instruction.
