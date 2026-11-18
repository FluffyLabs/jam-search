---
type: graypaper_section
title: B.2 Is-Authorized Invocation
index: 141
---
The Is-Authorized invocation is the first and simplest of the three, being totally stateless. It provides only host-call functions for inspecting its environment and parameters. It accepts as arguments only the work-package $\wpX$ and the core on which it should be executed, $c$. Formally, it is defined as $\Psi_I$: $$\begin{aligned}
  
  \Psi_I &\colon \abracegroup{
    \tuple{\workpackage, \coreindex} &\to \tuple{\blob \cup \workerror, \gas} \\
    \tup{\wpX, c} &\mapsto \begin{cases}
      \tup{\token{BAD}, 0} &\when \wpX_\wpNauthcode = \none \\
      \tup{\token{BIG}, 0} &\otherwhen \len{\wpX_\wpNauthcode} > \Cmaxauthcodesize \\
      \tup{\mathbf{r}, u} &\otherwise \\
      \multicolumn{2}{l}{\where \tup{u, \mathbf{r}, \none} = \Psi_M(\wpX_\wpNauthcode, 0, \Cpackageauthgas, \encode[2]{c}, F, \none)}\\
    \end{cases}\\
  } \\
  F \in \contextmutator{\set{\none}} &\colon
    \tup{n, \gascounter, \registers, \memory, \none} \mapsto \begin{cases}
      \Omega_G(\gascounter, \registers, \memory, \none) &\when n = \mathtt{gas} \\
      \Omega_\Gemini(\gascounter, \registers, \memory, \none, \wpX_\wpNauthcode) &\when n = \mathtt{grow\_heap} \\
      \Omega_Y(\gascounter, \registers, \memory, \none, \wpX, \none, \none, \none, \none, \none, \none) &\when n = \mathtt{fetch} \\
      \tup{\oog, 0, \registers', \memory, \none} &\otherwhen \gascounter < \Cgasunknown \\
      \tup{\blacktriangleright, \gascounter - \Cgasunknown, \registers', \memory, \none} &\otherwise \\
      \multicolumn{2}{l}{\where \registers' = \registers \exc \registers'_7 = \mathtt{WHAT}}
    \end{cases}\end{aligned}$$
