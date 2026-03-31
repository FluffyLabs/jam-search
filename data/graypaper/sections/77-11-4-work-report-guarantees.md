---
type: graypaper_section
title: 11.4 Work Report Guarantees
index: 77
---
We begin by defining the guarantees extrinsic, $\xtguarantees$, a series of *guarantees*, at most one for each core, each of which is a tuple of a *work-report*, a credential $\xgNcredential$ and its corresponding timeslot $\xgNtimeslot$. The core index of each guarantee must be unique and guarantees must be in ascending order of this. Formally: $$\begin{aligned}

  \xtguarantees &\in \sequence[:\Ccorecount]{\tuple{
    \isa{\xgNworkreport}{\workreport},\,
    \isa{\xgNtimeslot}{\timeslot},\,
    \isa{\xgNcredential}{\sequence[2:3]{\tuple{\valindex, \edsignaturebase}}}
  }} \\
  \xtguarantees &= \sqorderuniqby{(g_\xgNworkreport)_\wrNcore}{g \in \xtguarantees}\end{aligned}$$

The credential is a sequence of two or three tuples of a unique validator index and a signature. Credentials must be ordered by their validator index: $$\begin{aligned}
  \forall g &\in \xtguarantees : g_\xgNcredential = \sqorderuniqby{v}{\tup{v, s} \in g_\xgNcredential}\end{aligned}$$

The signature must be one whose public key is that of the validator identified in the credential, and whose message is the serialization of the hash of the work-report. The signing validators must be assigned to the core in question in either this block $\guarantorassignments$ if the timeslot for the guarantee is in the same rotation as this block's timeslot, or in the most recent previous set of assignments, $\guarantorassignmentsunderlastrotation$: $$\begin{aligned}
  
  &\begin{aligned}
    &\begin{aligned}
      \forall \tup{\xgNworkreport, \xgNtimeslot, \xgNcredential} &\in \xtguarantees,\\
      \forall \tup{v, s} &\in \xgNcredential
    \end{aligned} :
      \abracegroup[\,]{
        &s \in \edsignature{(\mathbf{k}\sub{v})_\vkNed}{\Xguarantee\concat\blake{\xgNworkreport}}\\
        &\mathbf{c}\sub{v} = \wrX_\wrNcore \wedge \Crotationperiod(\floor{\nicefrac{\thetime'}{\Crotationperiod}} - 1) \le \xgNtimeslot \le \thetime'\\
      }\\
      &k \in \reporters \Leftrightarrow \exists \tup{\xgNworkreport, \xgNtimeslot, \xgNcredential} \in \xtguarantees, \exists \tup{v, s} \in \xgNcredential: k = (\mathbf{k}\sub{v})_\vkNed\\
      &\quad\where \tup{\mathbf{c}, \mathbf{k}} = \begin{cases}
        \guarantorassignments &\when \displaystyle \ffrac{\thetime'}{\Crotationperiod} = \ffrac{t}{\Crotationperiod} \\
        \guarantorassignmentsunderlastrotation &\otherwise
      \end{cases}
  \end{aligned}\\
  &\Xguarantee \equiv \token{\$jam\_guarantee}\end{aligned}$$

We note that the Ed25519 key of each validator whose signature is in a credential is placed in the *reporters* set $\reporters$. This is utilized by the validator activity statistics bookkeeping system section 13.

We denote $\incomingreports$ to be the set of work-reports in the present extrinsic $\theextrinsic$: $$\begin{aligned}

  \using\incomingreports = \set{ \build { \xgX_\xgNworkreport }{ \xgX \in \xtguarantees } }\end{aligned}$$

No reports may be placed on cores with a report pending availability on it. A report is valid only if the authorizer hash is present in the authorizer pool of the core on which the work is reported. Formally: $$
  \forall \wrX \in \incomingreports :
    \reportspostguarantees\subb{\wrX_\wrNcore} = \none \wedge \wrX_\wrNauthorizer \in \authpool\subb{\wrX_\wrNcore}$$

We require that the gas allotted for accumulation of each work-digest in each work-report respects its service's minimum gas requirements. We also require that all work-reports' total allotted accumulation gas is no greater than the overall gas limit $\Creportaccgas$: $$\forall \wrX \in \incomingreports:
    \sum_{\wdX \in \wrX_\wrNdigests}\!(\wdX_\wdNgaslimit) \le \Creportaccgas \ \wedge \ 
    \forall \wdX \in \wrX_\wrNdigests: \wdX_\wdNgaslimit \ge \accounts\subb{\wdX_\wdNserviceindex}_\saNminaccgas$$
