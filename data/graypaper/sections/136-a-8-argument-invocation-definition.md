---
type: graypaper_section
title: A.8 Argument Invocation Definition
index: 136
---
The three instances where the PVM is utilized each expect to be able to pass argument data in and receive some return data back. We thus define the common PVM program-argument invocation function $\Psi_M$: $$\Psi_M\colon \abracegroup{
    \tuple{
      \blob, \pvmreg, \gas, \blob[:\Cpvminitinputsize], \contextmutator{X}, X
    } &\to \tuple{\gas, \blob \cup \set{\panic, \oog}, X}\\
    \tup{\jamNblob, \imath, \gascounter, \mathbf{a}, f, \context} &\mapsto \begin{cases}
      \tup{0, \panic, \context} &\when Y(\jamNblob, \mathbf{a}) = \none\\
      R(\gascounter, \Psi_H(\pvmNblob, \imath, \gascounter, \registers, {\memory}, f, \context)) &\when Y(\jamNblob, \mathbf{a}) = \tup{\pvmNblob, \registers, {\memory}}\\
      \multicolumn{2}{l}{
        \quad \where R \colon \tup{\gascounter, \tup{\begin{alignedat}{5}
          &\varepsilon,\, &&\imath',\, &&\gascounter',\\
          &\registers',\, &&{\memory}',\, &&\context'
        \end{alignedat}
        }} \mapsto \begin{cases}
          \tup{u, \oog, \context'} &\when \varepsilon = \oog \\
          \tup{u, \memory'_{\registers'_{7}\dots+\registers'_{8}}, \context'} &\when \varepsilon = \halt \wedge \Nrange{\registers'_{7}}{\registers'_{8}} \subseteq \readable{{\memory}'} \\
          \tup{u, \sq{}, \context'} &\when \varepsilon = \halt \wedge \Nrange{\registers'_{7}}{\registers'_{8}} \not\subseteq \readable{{\memory}'} \\
          \tup{u, \panic, \context'} &\otherwise \\
          \multicolumn{2}{l}{\quad \where u = \gascounter - \gascounter'}
        \end{cases}
      }\!\!\!\!\!\!\!\!
    \end{cases}
  }$$

Note that the first tuple item is the amount of gas consumed by the operation, but never greater than the amount of gas provided for the operation.
