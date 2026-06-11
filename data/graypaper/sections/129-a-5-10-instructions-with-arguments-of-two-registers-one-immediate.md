---
type: graypaper_section
title: A.5.10 Instructions with Arguments of Two Registers & One Immediate
index: 129
---
$$\begin{aligned}
  \using r_A &= \min(12, (\zeta_{\imath+1}) \bmod 16) \,,\quad&
  {\registers}_A &\equiv {\registers}_{r_A} \,,\quad
  {\registers}'_A \equiv {\registers}'_{r_A} \\
  \using r_B &= \min(12, \ffrac{\zeta_{\imath+1}}{16}) \,,\quad&
  {\registers}_B &\equiv {\registers}_{r_B} \,,\quad
  {\registers}'_B \equiv {\registers}'_{r_B} \\
  \using l_X &= \min(4, \max(0, \ell - 1)) \,,\quad&
  \nu_X &\equiv \sext{l_X}{\decode[l_X]{\zeta\subrange{\imath+2}{l_X}}}
\end{aligned}$$

  ------------- -- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  120              $\cyclic{{\memory}'}_{{\registers}_B + \nu_X} = {\registers}_A \bmod 2^8$
  (lr)1-3 121      $\cyclic{{\memory}'}\subrange{{\registers}_B + \nu_X}{2} = \encode[2]{{\registers}_A \bmod 2^{16}}$
  (lr)1-3 122      $\cyclic{{\memory}'}\subrange{{\registers}_B + \nu_X}{4} = \encode[4]{{\registers}_A \bmod 2^{32}}$
  (lr)1-3 123      $\cyclic{{\memory}'}\subrange{{\registers}_B + \nu_X}{8} = \encode[8]{{\registers}_A}$
  (lr)1-3 124      ${\registers}'_A = \cyclic{{\memory}}_{{\registers}_B + \nu_X}$
  (lr)1-3 125      ${\registers}'_A = \unsigned{\signedn{1}{\cyclic{{\memory}}_{{\registers}_B + \nu_X}}}$
  (lr)1-3 126      ${\registers}'_A = \decode[2]{\cyclic{{\memory}}\subrange{{\registers}_B + \nu_X}{2}}$
  (lr)1-3 127      ${\registers}'_A = \unsigned{\signedn{2}{\decode[2]{\cyclic{{\memory}}\subrange{{\registers}_B + \nu_X}{2}}}}$
  (lr)1-3 128      ${\registers}'_A = \decode[4]{\cyclic{{\memory}}\subrange{{\registers}_B + \nu_X}{4}}$
  (lr)1-3 129      ${\registers}'_A = \unsigned{\signedn{4}{\decode[4]{\cyclic{{\memory}}\subrange{{\registers}_B + \nu_X}{4}}}}$
  (lr)1-3 130      ${\registers}'_A = \decode[8]{\cyclic{{\memory}}\subrange{{\registers}_B + \nu_X}{8}}$
  (lr)1-3 131      ${\registers}'_A = \sext{4}{({\registers}_B + \nu_X) \bmod 2^{32}}$
  (lr)1-3 132      $\forall i \in \Nmax{64} : \fnoctetstobits_{8}({\registers}'_A)\sub{i} = \fnoctetstobits_{8}({\registers}_B)\sub{i} \wedge \fnoctetstobits_{8}(\nu_X)\sub{i}$
  (lr)1-3 133      $\forall i \in \Nmax{64} : \fnoctetstobits_{8}({\registers}'_A)\sub{i} = \fnoctetstobits_{8}({\registers}_B)\sub{i} \oplus \fnoctetstobits_{8}(\nu_X)\sub{i}$
  (lr)1-3 134      $\forall i \in \Nmax{64} : \fnoctetstobits_{8}({\registers}'_A)\sub{i} = \fnoctetstobits_{8}({\registers}_B)\sub{i} \vee \fnoctetstobits_{8}(\nu_X)\sub{i}$
  (lr)1-3 135      ${\registers}'_A = \sext{4}{({\registers}_B \cdot \nu_X) \bmod 2^{32}}$
  (lr)1-3 136      ${\registers}'_A = {\registers}_B < \nu_X$
  (lr)1-3 137      ${\registers}'_A = \signed{{\registers}_B} < \signed{\nu_X}$
  (lr)1-3 138      ${\registers}'_A = \sext{4}{({\registers}_B \cdot 2^{\nu_X \bmod 32}) \bmod 2^{32}}$
  (lr)1-3 139      ${\registers}'_A = \sext{4}{\floor{{\registers}_B \bmod 2^{32} \div 2^{\nu_X \bmod 32}}}$
  (lr)1-3 140      ${\registers}'_A = \unsigned{\floor{\signedn{4}{{\registers}_B \bmod 2^{32} } \div 2^{\nu_X \bmod 32}}}$
  (lr)1-3 141      ${\registers}'_A = \sext{4}{(\nu_X + 2^{32} - {\registers}_B) \bmod 2^{32}}$
  (lr)1-3 142      ${\registers}'_A = {\registers}_B > \nu_X$
  (lr)1-3 143      ${\registers}'_A = \signed{{\registers}_B} > \signed{\nu_X}$
  (lr)1-3 144      ${\registers}'_A = \sext{4}{(\nu_X \cdot 2^{{\registers}_B \bmod 32}) \bmod 2^{32}}$
  (lr)1-3 145      ${\registers}'_A = \sext{4}{\floor{\nu_X \bmod 2^{32} \div 2^{{\registers}_B \bmod 32}}}$
  (lr)1-3 146      ${\registers}'_A = \unsigned{\floor{\signedn{4}{\nu_X \bmod 2^{32}} \div 2^{{\registers}_B \bmod 32}}}$
  (lr)1-3 147      ${\registers}'_A = \begin{cases}
                       \nu_X &\when {\registers}_B = 0\\
                       {\registers}_A &\otherwise
                     \end{cases}$
  (lr)1-3 148      ${\registers}'_A = \begin{cases}
                       \nu_X &\when {\registers}_B \ne 0\\
                       {\registers}_A &\otherwise
                     \end{cases}$
  (lr)1-3 149      ${\registers}'_A = ({\registers}_B + \nu_X) \bmod 2^{64}$
  (lr)1-3 150      ${\registers}'_A = ({\registers}_B \cdot \nu_X) \bmod 2^{64}$
  (lr)1-3 151      ${\registers}'_A = \sext{8}{({\registers}_B \cdot 2^{\nu_X \bmod 64}) \bmod 2^{64}}$
  (lr)1-3 152      ${\registers}'_A = \sext{8}{\floor{{\registers}_B \div 2^{\nu_X \bmod 64}}}$
  (lr)1-3 153      ${\registers}'_A = \unsigned{\floor{\signed{{\registers}_B} \div 2^{\nu_X \bmod 64}}}$
  (lr)1-3 154      ${\registers}'_A = (\nu_X + 2^{64} - {\registers}_B) \bmod 2^{64}$
  (lr)1-3 155      ${\registers}'_A = (\nu_X \cdot 2^{{\registers}_B \bmod 64}) \bmod 2^{64}$
  (lr)1-3 156      ${\registers}'_A = \floor{\nu_X \div 2^{{\registers}_B \bmod 64}}$
  (lr)1-3 157      ${\registers}'_A = \unsigned{\floor{\signed{\nu_X} \div 2^{{\registers}_B \bmod 64}}}$
  (lr)1-3 158      $\forall i \in \Nmax{64} : \fnoctetstobits_{8}({\registers}'_A)\sub{i} = \fnoctetstobits_{8}({\registers}_B)_{(i + \nu_X) \bmod 64}$
  (lr)1-3 159      $\forall i \in \Nmax{64} : \fnoctetstobits_{8}({\registers}'_A)\sub{i} = \fnoctetstobits_{8}(\nu_X)_{(i + {\registers}_B) \bmod 64}$
  (lr)1-3 160      ${\registers}'_A = \sext{4}{x} \ \where x \in \Nbits{32}, \forall i \in \Nmax{32} : \fnoctetstobits_{4}(x)\sub{i} = \fnoctetstobits_{4}({\registers}_B)_{(i + \nu_X) \bmod 32}$
  (lr)1-3 161      ${\registers}'_A = \sext{4}{x} \ \where x \in \Nbits{32}, \forall i \in \Nmax{32} : \fnoctetstobits_{4}(x)\sub{i} = \fnoctetstobits_{4}(\nu_X)_{(i + {\registers}_B) \bmod 32}$
  ------------- -- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
