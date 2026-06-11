---
type: graypaper_section
title: 12.3 Final State Integration
index: 83
---
Given the result of the top-level $\accseq$, we may define the posterior state $\privileges'$, $\authqueue'$ and $\stagingset'$ as well as the first intermediate state of the service-accounts $\accountspostacc$ and the Accumulation Output Log $\lastaccout'$: $$\begin{aligned}
  \nonumber
  &\using g = \max\left(
    \Cblockaccgas,
    \Creportaccgas \cdot \Ccorecount + \textstyle \sum_{x \in \values{\alwaysaccers}}(x)
  \right)\\
  \nonumber
  &\also \psX = \tup{
    \is{\psNaccounts}{\accountspre},
    \is{\psNstagingset}{\stagingset},
    \is{\psNauthqueue}{\authqueue},
    \is{\psNmanager}{\manager},
    \is{\psNassigners}{\assigners},
    \is{\psNdelegator}{\delegator},
    \is{\psNregistrar}{\registrar},
    \is{\psNalwaysaccers}{\alwaysaccers}
  }
  \!\!\!\!\!\\
  
  &\tup{
    n, \psX', \mathbf{b}, \mathbf{u}, \mathbf{t}
  } \equiv \accseq(g, \sq{}, \justbecameavailable^*, \psX, \alwaysaccers) \\
  &\lastaccout' \equiv \sq{\tup{s, h} \in \mathbf{b}} \\
  
  &\tup{
    \is\psNaccounts{\accountspostacc},
    \is\psNstagingset{\stagingset'},
    \is\psNauthqueue{\authqueue'},
    \is\psNmanager{\manager'},
    \is\psNassigners{\assigners'},
    \is\psNdelegator{\delegator'},
    \is\psNregistrar{\registrar'},
    \is\psNalwaysaccers{\alwaysaccers'}
  } \equiv \psX'
  \!\!\!\!\!\end{aligned}$$

From this formulation, we also receive $n$, the total number of work-reports accumulated and $\mathbf{u}$, the gas used in the accumulation process for each service. We compose $\accumulationstatistics$, our accumulation statistics, which is a mapping from the service indices which were accumulated to the amount of gas used throughout accumulation and the number of work-items and transfers accumulated. Formally: $$\begin{aligned}
  
  &\accumulationstatistics \in \dictionary{\serviceid}{\tuple{\N, \N, \gas}} \\
  
  &\textstyle \accumulationstatistics \equiv \set{\build{
    \kv{s}{S(s)}
  }{
    S(s) \ne \tup{0, 0, 0}
  }}
  \!\!\!\!\\
  \nonumber
  \where &S(s) \equiv \tup{N(s), T(s), G(s)} \\
  \nonumber
  \also &N(s) \equiv \len{\sq{\build{d}{
    r \orderedin \justbecameavailable^*\sub{\dots n} ,
    d \orderedin r_\wrNdigests ,
    d_\wdNserviceindex = s
  }}} \\
  \nonumber
  \also &T(s) \equiv \len{\sq{\build{t}{
    t \orderedin \mathbf{t},
    t_\dxNdest = s
  }}} \\
  \nonumber
  \also &G(s) \equiv \sum_{\tup{s, u} \in \mathbf{u}}(u)\end{aligned}$$

The second intermediate state $\accountspostxfer$ may then be defined with the last-accumulation record being updated for all accumulated services: $$\begin{aligned}
  \accountspostxfer &\equiv \set{ \build{ \kv{s}{a'} }{ \kv{s}{a} \in \accountspostacc }} \\
  &\where a' = \begin{cases}
    a \exc a'_\saNlastacc = \thetime' &\when s \in \keys{\accumulationstatistics} \\
    a &\otherwise
  \end{cases}\end{aligned}$$

We define the final state of the ready queue and the accumulated map by integrating those work-reports which were accumulated in this block and shifting any from the prior state with the oldest such items being dropped entirely: $$\begin{aligned}
  \accumulated'_{\Cepochlen - 1} &= P(\justbecameavailable^*\sub{\dots n}) \\
  \forall i \in \Nmax{\Cepochlen - 1}: \accumulated'\sub{i} &\equiv \accumulated\sub{i + 1} \\
  \forall i \in \N_\Cepochlen : \cyclic{\ready'}\sub{m - i} &\equiv \begin{cases}
    E(\justbecameavailable^Q, \accumulated'\sub{\Cepochlen - 1}) &\when i = 0 \\
    \sq{} &\when 1 \le i < \thetime' - \thetime \\
    E(\cyclic{\ready}\sub{m - i}, \accumulated'\sub{\Cepochlen - 1}) &\when i \ge \thetime' - \thetime
  \end{cases}
  \!\!\!\!\end{aligned}$$
