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

  ------------- -- --- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  120              1   $\cyclic{{\memory}'}_{{\registers}_B + \nu_X} = {\registers}_A \bmod 2^8$
  (lr)1-4 121      1   $\cyclic{{\memory}'}\subrange{{\registers}_B + \nu_X}{2} = \encode[2]{{\registers}_A \bmod 2^{16}}$
  (lr)1-4 122      1   $\cyclic{{\memory}'}\subrange{{\registers}_B + \nu_X}{4} = \encode[4]{{\registers}_A \bmod 2^{32}}$
  (lr)1-4 123      1   $\cyclic{{\memory}'}\subrange{{\registers}_B + \nu_X}{8} = \encode[8]{{\registers}_A}$
  (lr)1-4 124      1   ${\registers}'_A = \cyclic{{\memory}}_{{\registers}_B + \nu_X}$
  (lr)1-4 125      1   ${\registers}'_A = \unsigned{\signedn{1}{\cyclic{{\memory}}_{{\registers}_B + \nu_X}}}$
  (lr)1-4 126      1   ${\registers}'_A = \decode[2]{\cyclic{{\memory}}\subrange{{\registers}_B + \nu_X}{2}}$
  (lr)1-4 127      1   ${\registers}'_A = \unsigned{\signedn{2}{\decode[2]{\cyclic{{\memory}}\subrange{{\registers}_B + \nu_X}{2}}}}$
  (lr)1-4 128      1   ${\registers}'_A = \decode[4]{\cyclic{{\memory}}\subrange{{\registers}_B + \nu_X}{4}}$
  (lr)1-4 129      1   ${\registers}'_A = \unsigned{\signedn{4}{\decode[4]{\cyclic{{\memory}}\subrange{{\registers}_B + \nu_X}{4}}}}$
  (lr)1-4 130      1   ${\registers}'_A = \decode[8]{\cyclic{{\memory}}\subrange{{\registers}_B + \nu_X}{8}}$
  (lr)1-4 131      1   ${\registers}'_A = \sext{4}{({\registers}_B + \nu_X) \bmod 2^{32}}$
  (lr)1-4 132      1   $\forall i \in \Nmax{64} : \fnoctetstobits_{8}({\registers}'_A)\sub{i} = \fnoctetstobits_{8}({\registers}_B)\sub{i} \wedge \fnoctetstobits_{8}(\nu_X)\sub{i}$
  (lr)1-4 133      1   $\forall i \in \Nmax{64} : \fnoctetstobits_{8}({\registers}'_A)\sub{i} = \fnoctetstobits_{8}({\registers}_B)\sub{i} \oplus \fnoctetstobits_{8}(\nu_X)\sub{i}$
  (lr)1-4 134      1   $\forall i \in \Nmax{64} : \fnoctetstobits_{8}({\registers}'_A)\sub{i} = \fnoctetstobits_{8}({\registers}_B)\sub{i} \vee \fnoctetstobits_{8}(\nu_X)\sub{i}$
  (lr)1-4 135      1   ${\registers}'_A = \sext{4}{({\registers}_B \cdot \nu_X) \bmod 2^{32}}$
  (lr)1-4 136      1   ${\registers}'_A = {\registers}_B < \nu_X$
  (lr)1-4 137      1   ${\registers}'_A = \signed{{\registers}_B} < \signed{\nu_X}$
  (lr)1-4 138      1   ${\registers}'_A = \sext{4}{({\registers}_B \cdot 2^{\nu_X \bmod 32}) \bmod 2^{32}}$
  (lr)1-4 139      1   ${\registers}'_A = \sext{4}{\floor{{\registers}_B \bmod 2^{32} \div 2^{\nu_X \bmod 32}}}$
  (lr)1-4 140      1   ${\registers}'_A = \unsigned{\floor{\signedn{4}{{\registers}_B \bmod 2^{32} } \div 2^{\nu_X \bmod 32}}}$
  (lr)1-4 141      1   ${\registers}'_A = \sext{4}{(\nu_X + 2^{32} - {\registers}_B) \bmod 2^{32}}$
  (lr)1-4 142      1   ${\registers}'_A = {\registers}_B > \nu_X$
  (lr)1-4 143      1   ${\registers}'_A = \signed{{\registers}_B} > \signed{\nu_X}$
  (lr)1-4 144      1   ${\registers}'_A = \sext{4}{(\nu_X \cdot 2^{{\registers}_B \bmod 32}) \bmod 2^{32}}$
  (lr)1-4 145      1   ${\registers}'_A = \sext{4}{\floor{\nu_X \bmod 2^{32} \div 2^{{\registers}_B \bmod 32}}}$
  (lr)1-4 146      1   ${\registers}'_A = \unsigned{\floor{\signedn{4}{\nu_X \bmod 2^{32}} \div 2^{{\registers}_B \bmod 32}}}$
  (lr)1-4 147      1   ${\registers}'_A = \begin{cases}
                           \nu_X &\when {\registers}_B = 0\\
                           {\registers}_A &\otherwise
                         \end{cases}$
  (lr)1-4 148      1   ${\registers}'_A = \begin{cases}
                           \nu_X &\when {\registers}_B \ne 0\\
                           {\registers}_A &\otherwise
                         \end{cases}$
  (lr)1-4 149      1   ${\registers}'_A = ({\registers}_B + \nu_X) \bmod 2^{64}$
  (lr)1-4 150      1   ${\registers}'_A = ({\registers}_B \cdot \nu_X) \bmod 2^{64}$
  (lr)1-4 151      1   ${\registers}'_A = \sext{8}{({\registers}_B \cdot 2^{\nu_X \bmod 64}) \bmod 2^{64}}$
  (lr)1-4 152      1   ${\registers}'_A = \sext{8}{\floor{{\registers}_B \div 2^{\nu_X \bmod 64}}}$
  (lr)1-4 153      1   ${\registers}'_A = \unsigned{\floor{\signed{{\registers}_B} \div 2^{\nu_X \bmod 64}}}$
  (lr)1-4 154      1   ${\registers}'_A = (\nu_X + 2^{64} - {\registers}_B) \bmod 2^{64}$
  (lr)1-4 155      1   ${\registers}'_A = (\nu_X \cdot 2^{{\registers}_B \bmod 64}) \bmod 2^{64}$
  (lr)1-4 156      1   ${\registers}'_A = \floor{\nu_X \div 2^{{\registers}_B \bmod 64}}$
  (lr)1-4 157      1   ${\registers}'_A = \unsigned{\floor{\signed{\nu_X} \div 2^{{\registers}_B \bmod 64}}}$
  (lr)1-4 158      1   $\forall i \in \Nmax{64} : \fnoctetstobits_{8}({\registers}'_A)\sub{i} = \fnoctetstobits_{8}({\registers}_B)_{(i + \nu_X) \bmod 64}$
  (lr)1-4 159      1   $\forall i \in \Nmax{64} : \fnoctetstobits_{8}({\registers}'_A)\sub{i} = \fnoctetstobits_{8}(\nu_X)_{(i + {\registers}_B) \bmod 64}$
  (lr)1-4 160      1   ${\registers}'_A = \sext{4}{x} \ \where x \in \Nbits{32}, \forall i \in \Nmax{32} : \fnoctetstobits_{4}(x)\sub{i} = \fnoctetstobits_{4}({\registers}_B)_{(i + \nu_X) \bmod 32}$
  (lr)1-4 161      1   ${\registers}'_A = \sext{4}{x} \ \where x \in \Nbits{32}, \forall i \in \Nmax{32} : \fnoctetstobits_{4}(x)\sub{i} = \fnoctetstobits_{4}(\nu_X)_{(i + {\registers}_B) \bmod 32}$
  ------------- -- --- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
