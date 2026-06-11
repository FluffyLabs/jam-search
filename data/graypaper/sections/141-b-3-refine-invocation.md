---
type: graypaper_section
title: B.3 Refine Invocation
index: 141
---
We define the Refine service-account invocation function as $\Psi_R$. It has no general access to the state of the JAM chain, with the slight exception being the ability to make a historical lookup. Beyond this it is able to create inner instances of the PVM and dictate pieces of data to export.

The historical-lookup host-call function, $\Omega_H$, is designed to give the same result regardless of the state of the chain for any time when auditing may occur (which we bound to be less than two epochs from being accumulated). The lookup anchor may be up to $\Cmaxlookupanchorage$ timeslots before the recent history and therefore adds to the potential age at the time of audit. We therefore set $\Cexpungeperiod$ to have a safety margin of eight hours: $$\Cexpungeperiod \equiv \Cmaxlookupanchorage + 4,800 = 19,200$$

The inner PVM invocation host-calls, meanwhile, depend on an integrated PVM type, which we shall denote $\innerpvm$. It holds a PVM program blob, instruction counter, RAM and a flag denoting whether gas was already charged for the currently executing basic block: $$
  \innerpvm \equiv \tuple{\isa{\pgNcode}{\blob}, \isa{\pgNram}{\ram}, \isa{\pgNpc}{\pvmreg}, \isa{\pgNgaschargedflag}{\bool}}$$

The Export host-call depends on two pieces of context; one sequence of segments (blobs of length $\Csegmentsize$) to which it may append, and the other an argument passed to the invocation function to dictate the number of segments prior which may assumed to have already been appended. The latter value ensures that an accurate segment index can be provided to the caller.

Unlike the other invocation functions, the Refine invocation function implicitly draws upon some recent service account state item $\accounts$. The specific block from which this comes is not important, as long as it is no earlier than its work-package's lookup-anchor block. It explicitly accepts the work-package $p$ and the index of the work item to be refined, $i$ together with the core which is doing the refining $c$. Additionally, the authorizer trace $\mathbf{r}$ is provided together with all work items' import segments $\overline{\mathbf{i}}$ and an export segment offset $\segoff$. It results in a tuple of some error $\workerror$ or the refinement output blob (signalling success), the export sequence in the case of success and the gas used in evaluation. Formally: $$\begin{aligned}
  &\Psi_R \colon \abracegroup{
    
    \tuple{\coreindex, \N, \workpackage, \blob, \sequence{\sequence{\segment}}, \N} &\to \tuple{\blob \cup \workerror, \sequence{\segment}, \gas} \\
    \tup{c, i, p, \mathbf{r}, \overline{\mathbf{i}}, \segoff} &\mapsto \begin{cases}
      \tup{\token{BAD}, \sq{}, 0} &\when w_\wiNserviceindex \not\in \keys{\accounts} \vee \histlookup(\accounts\subb{w_\wiNserviceindex}, (p_\wpNcontext)_\wcNlookupanchortime, w_\wiNcodehash) = \none \\
      \tup{\token{BIG}, \sq{}, 0} &\otherwhen \len{\histlookup(\accounts\subb{w_\wiNserviceindex}, (p_\wpNcontext)_\wcNlookupanchortime, w_\wiNcodehash)} > \Cmaxservicecodesize \\
      &\otherwise: \\
      &\quad\using \mathbf{a} = \encode{c, i, w_\wiNserviceindex, \var{w_\wiNpayload}, \blake{p}}\;,\ \encode{\var{\mathbf{z}}, \jamNblob} = \histlookup(\accounts\subb{w_\wiNserviceindex}, (p_\wpNcontext)_\wcNlookupanchortime, w_\wiNcodehash)\\
      &\quad\also \tup{u, \mathbf{o}, \tup{\mathbf{m}, \mathbf{e}}} = \Psi_M(\jamNblob, 0, w_\wiNrefgaslimit, \mathbf{a}, F, \tup{\emptyset, \sq{}})\ \colon\\
      \tup{\mathbf{o}, \sq{}, u} &\quad\when \mathbf{o} \in \set{ \oog, \panic }  \\
      \tup{\mathbf{o}, \mathbf{e}, u} &\quad\otherwise \\
      \multicolumn{2}{l}{\where w = p_\wpNworkitems\subb{i}}
    \end{cases} \\
  } \\
  
  &F \in \contextmutator{\tuple{\dictionary{\N}{\innerpvm}, \sequence{\segment}}} \colon
    (n, \gascounter, \registers, \memory, \tup{\mathbf{m}, \mathbf{e}}) \mapsto \begin{cases}
      \Omega_G(\gascounter, \registers, \memory, \tup{\mathbf{m}, \mathbf{e}}) &\when n = \mathtt{gas} \\
      \Omega_\Gemini(\gascounter, \registers, \memory, \jamNblob) &\when n = \mathtt{grow\_heap} \\
      \Omega_Y(\gascounter, \registers, \memory, p, \zerohash, \mathbf{r}, i, \overline{\mathbf{i}}, \overline{\mathbf{x}}, \none, \tup{\mathbf{m}, \mathbf{e}}) &\when n = \mathtt{fetch}\\
      \Omega_H(\gascounter, \registers, \memory, w_\wiNserviceindex, \accounts, (p_\wpNcontext)_\wcNlookupanchortime) &\when n = \mathtt{historical\_lookup}\\
      \Omega_E(\gascounter, \registers, \memory, \mathbf{e}, \segoff) &\when n = \mathtt{export}\\
      \Omega_M(\gascounter, \registers, \memory, \mathbf{m}) &\when n = \mathtt{machine}\\
      \Omega_P(\gascounter, \registers, \memory, \mathbf{m}) &\when n = \mathtt{peek}\\
      \Omega_O(\gascounter, \registers, \memory, \mathbf{m}) &\when n = \mathtt{poke}\\
      \Omega_Z(\gascounter, \registers, \memory, \mathbf{m}) &\when n = \mathtt{pages}\\
      \Omega_K(\gascounter, \registers, \memory, \mathbf{m}) &\when n = \mathtt{invoke}\\
      \Omega_X(\gascounter, \registers, \memory, \mathbf{m}) &\when n = \mathtt{expunge}\\
      \tup{\oog, \gascounter', \registers', \memory} &\otherwhen \gascounter' < 0\\
      \tup{\blacktriangleright, \gascounter', \registers', \memory} &\otherwise\\
      \multicolumn{2}{l}{\where \registers' = \registers \exc \registers'_7 = \mathtt{WHAT}} \\
      \multicolumn{2}{l}{\also \gascounter' = \gascounter - \Cgasunknown} \\
      \multicolumn{2}{l}{\also \overline{\mathbf{x}} = \sq{\build{
        \sq{\build{
          \mathbf{x}
        }{
          \tup{\blake{\mathbf{x}}, \len{\mathbf{x}}} \orderedin \wiX_\wiNextrinsics
        }}
      }{
        \wiX \orderedin p_\wpNworkitems
      }}}
    \end{cases}\end{aligned}$$
