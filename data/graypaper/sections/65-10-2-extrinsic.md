---
type: graypaper_section
title: 10.2 Extrinsic
index: 65
---
The disputes extrinsic $\xtdisputes$ is functional grouping of three otherwise independent extrinsics. It comprises *verdicts* $\xtverdicts$, *culprits* $\xtculprits$, and *faults* $\xtfaults$. Verdicts are a compilation of judgments coming from exactly two-thirds plus one of either the active validator set or the previous epoch's validator set, i.e. the Ed25519 keys of $\activeset$ or $\previousset$. Culprits and faults are proofs of the misbehavior of one or more validators, respectively either by guaranteeing a work-report found to be invalid, or by signing a judgment found to be contradiction to a work-report's validity. Both of these are considered a kind of *offense*. Formally: $$\begin{aligned}
    \xtdisputes &\equiv \tuple{\xtverdicts, \xtculprits, \xtfaults} \\
    \where \xtverdicts &\in \sequence{\tuple{
      \hash,
      \ffrac{\thetime}{\Cepochlen} - \N_2,
      \sequence[\floor{\twothirds\Cvalcount} + 1]{\tuple{
        \set{\top, \bot},
        \valindex,
        \edsignaturebase
      }}
    }}\\
    \also \xtculprits &\in \sequence{\tuple{\hash, \edkey, \edsignaturebase}} \,,\quad
    \xtfaults \in \sequence{\tuple{\hash, \set{\top,\bot}, \edkey, \edsignaturebase}}
  \end{aligned}$$

The signatures of all judgments must be valid in terms of one of the two allowed validator key-sets, identified by the verdict's second term which must be either the epoch index of the prior state or one less. Formally: $$\begin{aligned}
  &\begin{aligned}
    &\forall \tup{\xvNreporthash, \xvNepochindex, \xvNjudgments} \in \xtverdicts, \forall \tup{\xvjNvalidity, \xvjNjudgeindex, \xvjNsignature} \in \xvNjudgments : \xvjNsignature \in \edsignature{\mathbf{k}[\xvjNjudgeindex]_\vkNed}{\mathsf{X}\sub{v} \concat \xvNreporthash}\\
    &\quad\where \mathbf{k} = \begin{cases}
      \activeset &\when \xvNepochindex = \displaystyle \ffrac{\thetime}{\Cepochlen}\\
      \previousset &\otherwise\\
    \end{cases}
  \end{aligned}\\
  &\Xvalid \equiv \text{{\small \texttt{\$jam\_valid}}}\,,\ \Xinvalid \equiv \text{{\small \texttt{\$jam\_invalid}}}\end{aligned}$$

Offender signatures must be similarly valid and reference work-reports with judgments and may not report keys which are already in the punish-set: $$\begin{aligned}
  \forall \tup{\xcNreporthash, \xcNoffenderindex, \xcNsignature} &\in \xtculprits : \bigwedge \abracegroup{
    &\xcNreporthash \in \badset' \,,\\
    &\xcNoffenderindex \in \mathbf{k} \,,\\
    &\xcNsignature \in \edsignature{\xcNoffenderindex}{\Xguarantee \concat \xcNreporthash}
  }\\
  \forall \tup{\xfNreporthash, \xfNvalidity, \xfNoffenderindex, \xfNsignature} &\in \xtfaults : \bigwedge \abracegroup{
    &\xfNreporthash \in \badset' \Leftrightarrow \xfNreporthash \not\in \goodset' \Leftrightarrow \xfNvalidity \,,\\
    &k \in \mathbf{k} \,,\\
    &s \in \edsignature{\xfNoffenderindex}{\mathsf{X}\sub{v} \concat \xfNreporthash}\\
  }\\
  \nonumber\where \mathbf{k} &= \set{\build{i_\vkNed}{i \in \previousset \cup \activeset}} \setminus \offenders\end{aligned}$$

Verdicts $\xtverdicts$ must be ordered by report hash. Offender signatures $\xtculprits$ and $\xtfaults$ must each be ordered by the validator's Ed25519 key. There may be no duplicate report hashes within the extrinsic, nor amongst any past reported hashes. Formally: $$\begin{aligned}
  &\xtverdicts = \sqorderuniqby{\xvNreporthash}{\tup{\xvNreporthash, \xvNepochindex, \xvNjudgments} \in \xtverdicts}\\
  &\xtculprits = \sqorderuniqby{\xcNoffenderindex}{\tup{\xcNreporthash, \xcNoffenderindex, \xcNsignature} \in \xtculprits} \,,\ 
  \xtfaults = \sqorderuniqby{\xfNoffenderindex}{\tup{\xfNreporthash, \xfNvalidity, \xfNoffenderindex, \xfNsignature} \in \xtfaults}\!\!\!\!\!\!\\
  &\set{\build{\xvNreporthash}{\tup{\xvNreporthash, \xvNepochindex, \xvNjudgments} \in \xtverdicts}} \disjoint \goodset \cup \badset \cup \wonkyset\end{aligned}$$

The judgments of all verdicts must be ordered by validator index and there may be no duplicates: $$\forall \tup{\xvNreporthash, \xvNepochindex, \xvNjudgments} \in \xtverdicts : \xvNjudgments = \sqorderuniqby{\xvjNjudgeindex}{\tup{\xvjNvalidity, \xvjNjudgeindex, \xvjNsignature} \in \xvNjudgments}$$

We define $\mathbf{v}$ to derive from the sequence of verdicts introduced in the block's extrinsic, containing only the report hash and the sum of positive judgments. We require this total to be either exactly two-thirds-plus-one, zero or one-third of the validator set indicating, respectively, that the report is good, that it's bad, or that it's wonky.[^11] Formally: $$\begin{aligned}

  \mathbf{v}&\in \sequence{\tup{
    \hash,
    \set{0, \floor{\onethird\Cvalcount}, \floor{\twothirds\Cvalcount} + 1}
  }} \\
  \mathbf{v}&= \sq{\build{
      \tup{
        \xvNreporthash,
        \sum_{\tup{\xvjNvalidity, \xvjNjudgeindex, \xvjNsignature} \in \xvNjudgments}\!\!\!\!
        \xvjNvalidity
      }
    }{
      \tup{\xvNreporthash, \xvNepochindex, \xvNjudgments} \orderedin \xtverdicts
    }}\end{aligned}$$

There are some constraints placed on the composition of this extrinsic: any verdict containing solely valid judgments implies the same report having at least one valid entry in the faults sequence $\xtfaults$. Any verdict containing solely invalid judgments implies the same report having at least two valid entries in the culprits sequence $\xtculprits$. Formally: $$\begin{aligned}
  \forall \tup{\Nreporthash, \floor{\twothirds\Cvalcount} + 1} \in \mathbf{v}&:
    \exists \tup{\Nreporthash, \dots} \in \xtfaults \\
  \forall \tup{\Nreporthash, 0} \in \mathbf{v}&:
    \len{\set{\tup{\Nreporthash, \dots} \in \xtculprits}} \ge 2\end{aligned}$$

We clear any work-reports which we judged as uncertain or invalid from their core: $$
  \forall c \in \coreindex : \reportspostjudgement\subb{c} = \begin{cases}
    \none &\!\!\!\!\when
      \tup{\blake{\reports\subb{c}_\rsNworkreport}, t} \in \mathbf{v},
      t< \floor{\twothirds\Cvalcount} \\
    \reports\subb{c} &\!\!\!\!\otherwise
  \end{cases}\!\!\!\!\!\!\!$$

The state's good-set, bad-set and wonky-set assimilate the hashes of the reports from each verdict. Finally, the punish-set accumulates the keys of any validators who have been found guilty of offending. Formally: $$\begin{aligned}
  
  \goodset' &\equiv \goodset \cup \set{\build{
      \Nreporthash
    }{
      \tup{\Nreporthash, \floor{\twothirds\Cvalcount} + 1} \in \mathbf{v}
    }} \\
  
  \badset' &\equiv \badset \cup \set{\build{
      \Nreporthash
    }{
      \tup{\Nreporthash, 0} \in \mathbf{v}
    }} \\
  
  \!\!\wonkyset' &\equiv \wonkyset \cup \set{\build{
      \Nreporthash
    }{
      \tup{\Nreporthash, \floor{\onethird\Cvalcount}} \in \mathbf{v}
    }} \\
  
  \offenders' &\equiv \offenders \cup \set{\build{
      \Noffenderindex
    }{
      \tup{\Noffenderindex, \dots} \in \xtculprits
    }} \cup \set{\build{
      \Noffenderindex
    }{
      \tup{\Noffenderindex, \dots} \in \xtfaults
    }}\!\!\!\!\end{aligned}$$
