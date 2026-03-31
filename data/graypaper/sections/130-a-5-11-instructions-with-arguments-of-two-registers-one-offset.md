---
type: graypaper_section
title: A.5.11 Instructions with Arguments of Two Registers & One Offset
index: 130
---
$$\begin{aligned}
    \using r_A &= \min(12, (\zeta_{\imath+1}) \bmod 16) \,,\quad&
    {\registers}_A &\equiv {\registers}_{r_A} \,,\quad
    {\registers}'_A \equiv {\registers}'_{r_A} \\
    \using r_B &= \min(12, \ffrac{\zeta_{\imath+1}}{16}) \,,\quad&
    {\registers}_B &\equiv {\registers}_{r_B} \,,\quad
    {\registers}'_B \equiv {\registers}'_{r_B} \\
    \using l_X &= \min(4, \max(0, \ell - 1)) \,,\quad&
    \nu_X &\equiv \imath + \signfunc{l_X}(\decode[l_X]{\zeta\subrange{\imath+2}{l_X}})
  \end{aligned}$$

  ------------- -- --- ------------------------------------------------------------------------------
  170              1   $\token{branch}(\nu_X, {\registers}_A = {\registers}_B)$
  (lr)1-4 171      1   $\token{branch}(\nu_X, {\registers}_A \ne {\registers}_B)$
  (lr)1-4 172      1   $\token{branch}(\nu_X, {\registers}_A < {\registers}_B)$
  (lr)1-4 173      1   $\token{branch}(\nu_X, \signed{{\registers}_A} < \signed{{\registers}_B})$
  (lr)1-4 174      1   $\token{branch}(\nu_X, {\registers}_A \ge {\registers}_B)$
  (lr)1-4 175      1   $\token{branch}(\nu_X, \signed{{\registers}_A} \ge \signed{{\registers}_B})$
  ------------- -- --- ------------------------------------------------------------------------------
