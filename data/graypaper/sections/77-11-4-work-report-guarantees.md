---
type: graypaper_section
title: 11.4 Work Report Guarantees
index: 77
---
We begin by defining $\guarantee$, the set of *guarantees*. A guarantee is a tuple of a *work-report* $\gNworkreport$, a credential $\gNcredential$ and its corresponding timeslot $\gNtimeslot$. The credential is a sequence of two or three tuples of a unique validator index and a signature. Formally: $$
  \guarantee \equiv \tuple{
    \isa{\gNworkreport}{\workreport},\,
    \isa{\gNtimeslot}{\timeslot},\,
    \isa{\gNcredential}{\sequence[2:3]{\tuple{\N, \edsignaturebase}}}
  }$$

We continue by defining the guarantees extrinsic, $\xtguarantees$, a series of guarantees. The core index of each guarantee in $\xtguarantees$ must be unique and guarantees must be in ascending order of this. Formally: $$\begin{aligned}
  \xtguarantees &\in \sequence[:\Ccorecount]{\guarantee}  \\
  \xtguarantees &= \sqorderuniqby{(\gX_\gNworkreport)_\wrNcore}{\gX \in \xtguarantees}\end{aligned}$$

Credentials must be ordered by their validator index: $$\begin{aligned}
  \forall g &\in \xtguarantees : g_\gNcredential = \sqorderuniqby{v}{\tup{v, s} \in g_\gNcredential}\end{aligned}$$

The signature must be one whose public key is that of the validator identified in the credential, and whose message is the serialization of the hash of the work-report. The signing validators must have been assigned to the core in the given timeslot $\gNtimeslot$, which must either be in the same rotation as this block's timeslot or in the previous rotation. Use of an inactive core is not permitted even if a timeslot in the previous rotation is used and the core was active then. Formally: $$\begin{gathered}
  
  \begin{aligned}
    &\begin{aligned}
      \forall \tup{\gNworkreport, \gNtimeslot, \gNcredential} &\in \xtguarantees,\\
      \forall \tup{v, s} &\in \gNcredential
    \end{aligned} : \abracegroup[\,]{
      &v < \len{\mathbf{k}} \wedge \mathbf{c}\sub{v} = \gNworkreport_\wrNcore < \frac{\len{\activeset'}}{3}\\
      &s \in \edsignature{(\mathbf{k}\sub{v})_\vkNed}{\Xguarantee\concat\blake{\gNworkreport}}\\
      &\Crotationperiod(\floor{\nicefrac{\thetime'}{\Crotationperiod}} - 1) \le \gNtimeslot \le \thetime'
    }\\
    &k \in \reporters \Leftrightarrow \exists \tup{\gNworkreport, \gNtimeslot, \gNcredential} \in \xtguarantees, \exists \tup{v, s} \in \gNcredential: k = (\mathbf{k}\sub{v})_\vkNed\\
    &\quad\where \tup{\mathbf{c}, \mathbf{k}} = \begin{cases}
      \guarantorassignments &\when \displaystyle \ffrac{\thetime'}{\Crotationperiod} = \ffrac{t}{\Crotationperiod} \\
      \guarantorassignmentsunderlastrotation &\otherwise
    \end{cases}
  \end{aligned}\\
  \Xguarantee \equiv \token{\$jam\_guarantee}\end{gathered}$$

We note that the Ed25519 key of each validator whose signature is in a credential is placed in the *reporters* set $\reporters$. This is utilized by the validator activity statistics bookkeeping system section 13.

We denote $\incomingreports$ to be the set of work-reports in the present extrinsic $\theextrinsic$: $$\begin{aligned}

  \using\incomingreports = \set{ \build { \gX_\gNworkreport }{ \gX \in \xtguarantees } }\end{aligned}$$

The total number of erasure-coded chunks for each report must match the number of active validators: $$\forall \wrX \in \incomingreports : (\wrX_\wrNavspec)_\asNerasureshards = \len{\activeset'}$$

No guarantees may be placed on cores which already have availability assignments. A guarantee is valid only if the report's authorizer hash is present in the authorizer pool of the core on which the work is reported. Formally: $$
  \forall \wrX \in \incomingreports :
    \availassignmentspostassurances\subb{\wrX_\wrNcore} = \none \wedge \wrX_\wrNauthorizer \in \authpool\subb{\wrX_\wrNcore}$$

We require that the gas allotted for accumulation of each work-digest in each work-report respects its service's minimum gas requirements. We also require that all work-reports' total allotted accumulation gas is no greater than the overall gas limit $\Creportaccgas$: $$\forall \wrX \in \incomingreports:
    \sum_{\wdX \in \wrX_\wrNdigests}\!(\wdX_\wdNgaslimit) \le \Creportaccgas \ \wedge \
    \forall \wdX \in \wrX_\wrNdigests: \wdX_\wdNgaslimit \ge \accounts\subb{\wdX_\wdNserviceindex}_\saNminaccgas$$
