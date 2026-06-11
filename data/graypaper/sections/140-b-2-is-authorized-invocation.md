---
type: graypaper_section
title: B.2 Is-Authorized Invocation
index: 140
---
The Is-Authorized invocation is the first and simplest of the three, being totally stateless. It provides only host-call functions for inspecting its environment and parameters. It accepts as arguments only the core on which it should be executed, $c$. Formally, it is defined as $\Psi_I$: $$\begin{aligned}
  
  \Psi_I &\colon \abracegroup{
    \tuple{\workpackage, \coreindex} &\to \tuple{\blob \cup \workerror, \gas} \\
    \tup{\wpX, c} &\mapsto \begin{cases}
      \tup{\token{BAD}, 0} &\when \wpX_\wpNauthcode = \none \\
      \tup{\token{BIG}, 0} &\otherwhen \len{\wpX_\wpNauthcode} > \Cmaxauthcodesize \\
      \tup{\mathbf{r}, u} &\otherwise \\
      \multicolumn{2}{l}{\where \tup{u, \mathbf{r}, \none} = \Psi_M(\wpX_\wpNauthcode, 0, \Cpackageauthgas, \encode[2]{c}, F, \none)}\\
    \end{cases}\\
  } \\
  F \in \contextmutator{\emset} &\colon
    \tup{n, \gascounter, \registers, \memory} \mapsto \begin{cases}
      \Omega_G(\gascounter, \registers, \memory) &\when n = \mathtt{gas} \\
      \Omega_\Gemini(\gascounter, \registers, \memory, \wpX_\wpNauthcode) &\when n = \mathtt{grow\_heap} \\
      \Omega_Y(\gascounter, \registers, \memory, \wpX, \none, \none, \none, \none, \none, \none, \none) &\when n = \mathtt{fetch} \\
      \tup{\oog, \gascounter', \registers', \memory} &\otherwhen \gascounter' < 0 \\
      \tup{\blacktriangleright, \gascounter', \registers', \memory} &\otherwise \\
      \multicolumn{2}{l}{\where \registers' = \registers \exc \registers'_7 = \mathtt{WHAT}} \\
      \multicolumn{2}{l}{\also \gascounter' = \gascounter - \Cgasunknown}
    \end{cases}\end{aligned}$$

Note for the Is-Authorized host-call dispatch function $F$ in equation [eq:isauthorizedmutator], we elide the host-call context since, being essentially stateless, it is always $\none$.
