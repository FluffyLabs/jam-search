---
type: graypaper_section
title: >-
  A.5.8 Instructions with Arguments of One Register, One Immediate and One
  Offset
index: 127
---
$$\begin{aligned}
      \using r_A &= \min(12, \zeta_{\imath+1} \bmod 16) \,,\quad&
      {\registers}_A &\equiv {\registers}_{r_A} \,,\quad
      {\registers}'_A \equiv {\registers}'_{r_A} \\
      \using l_X &= \min(4, \ffrac{\zeta_{\imath+1}}{16} \bmod 8) \,,\quad&
      \nu_X &= \sext{l_X}{\decode[l_X]{\zeta\subrange{\imath+2}{l_X}}} \\
      \using l_Y &= \min(4, \max(0, \ell - l_X - 1)) \,,\quad&
      \nu_Y &= \imath + \signfunc{l_Y}(\decode[l_Y]{\zeta\subrange{\imath+2+l_X}{l_Y}})
  \end{aligned}$$

  ------------ -- ---------------------------------------------------------------------
  80              $\token{sjump}(\nu_Y)\ ,\qquad {\registers}_A' = \nu_X$
  (lr)1-3 81      $\token{branch}(\nu_Y, {\registers}_A = \nu_X)$
  (lr)1-3 82      $\token{branch}(\nu_Y, {\registers}_A \ne \nu_X)$
  (lr)1-3 83      $\token{branch}(\nu_Y, {\registers}_A < \nu_X)$
  (lr)1-3 84      $\token{branch}(\nu_Y, {\registers}_A \le \nu_X)$
  (lr)1-3 85      $\token{branch}(\nu_Y, {\registers}_A \ge \nu_X)$
  (lr)1-3 86      $\token{branch}(\nu_Y, {\registers}_A > \nu_X)$
  (lr)1-3 87      $\token{branch}(\nu_Y, \signed{{\registers}_A} < \signed{\nu_X})$
  (lr)1-3 88      $\token{branch}(\nu_Y, \signed{{\registers}_A} \le \signed{\nu_X})$
  (lr)1-3 89      $\token{branch}(\nu_Y, \signed{{\registers}_A} \ge \signed{\nu_X})$
  (lr)1-3 90      $\token{branch}(\nu_Y, \signed{{\registers}_A} > \signed{\nu_X})$
  ------------ -- ---------------------------------------------------------------------
