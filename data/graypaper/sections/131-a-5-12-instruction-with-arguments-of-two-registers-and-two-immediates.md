---
type: graypaper_section
title: A.5.12 Instruction with Arguments of Two Registers and Two Immediates
index: 131
---
$$\begin{aligned}
    \using r_A &= \min(12, (\zeta_{\imath+1}) \bmod 16) \,,\quad&
    {\registers}_A &\equiv {\registers}_{r_A} \,,\quad
    {\registers}'_A \equiv {\registers}'_{r_A} \\
    \using r_B &= \min(12, \ffrac{\zeta_{\imath+1}}{16}) \,,\quad&
    {\registers}_B &\equiv {\registers}_{r_B} \,,\quad
    {\registers}'_B \equiv {\registers}'_{r_B} \\
    \using l_X &= \min(4, \zeta_{\imath+2} \bmod 8) \,,\quad&
    \nu_X &= \sext{l_X}{\decode[l_X]{\zeta\subrange{\imath+3}{l_X}}} \\
    \using l_Y &= \min(4, \max(0, \ell - l_X - 2)) \,,\quad&
    \nu_Y &= \sext{l_Y}{\decode[l_Y]{\zeta\subrange{\imath+3+l_X}{l_Y}}}
  \end{aligned}$$

  ----- -- --- -----------------------------------------------------------------
  180      1   $\token{djump}(({\registers}_B + \nu_Y) \bmod 2^{32}) \ ,\qquad
                   {\registers}_A' = \nu_X$
  ----- -- --- -----------------------------------------------------------------
