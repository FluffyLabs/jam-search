---
type: graypaper_section
title: 12.2 Execution
index: 83
---
We work with a limited amount of gas per block and therefore may not be able to process all items in $\justbecameavailable^*$ in a single block. There are two slightly antagonistic factors allowing us to optimize the amount of work-items, and thus work-reports, accumulated in a single block:

Firstly, while we have a well-known gas-limit for each work-item to be accumulated, accumulation may still result in a lower amount of gas used. Only after a work-item is accumulated can it be known if it uses less gas than the advertised limit. This implies a sequential execution pattern.

Secondly, since PVM setup cannot be expected to be zero-cost, we wish to amortize this cost over as many work-items as possible. This can be done by aggregating work-items associated with the same service into the same PVM invocation. This implies a non-sequential execution pattern.

We resolve this by defining a function $\accseq$ which accumulates work-reports sequentially, and which itself utilizes a function $\accpar$ which accumulates work-reports in a non-sequential, service-aggregated manner. In all but the first invocation of $\accseq$, we also integrate the effects of any *deferred-transfers* implied by the previous round of accumulation, thus the accumulation function must accept both the information contained in work-digests and that of deferred-transfers.

Rather than passing whole work-digests into accumulate, we extract the salient information from them and combine with information implied by their work-reports. We call this kind of combined value an *operand tuple*, $\operandtuple$. Likewise, we denote the set characterizing a *deferred transfer* as $\defxfer$, noting that a transfer includes a memo component $\dxNmemo$ of $\Cmemosize = 128$ octets, together with the service index of the sender $\dxNsource$, the service index of the receiver $\dxNdest$, whether to credit the receiver's regular balance ($\dxNdestsupervisor = \bot$) or its supervisor balance ($\dxNdestsupervisor = \top$), the balance to be transferred $\dxNamount$ and the gas limit $\dxNgas$ for the transfer. Formally: $$\begin{aligned}
  
  \operandtuple &\equiv \tuple{
    \begin{alignedat}{3}
      \isa{\otNpackagehash&}{\hash}\,,\;
      \isa{&\otNsegroot&}{\hash}\,,\;
      \isa{&\otNauthorizer&}{\hash}\,,\;
      \isa{\otNpayloadhash}{\hash}\,,\;\\
      \isa{\otNgaslimit&}{\gas}\,,\;
      \isa{&\otNauthtrace&}{\blob}\,,\;
      \isa{&\otNresult&}{\blob \cup \workerror}
    \end{alignedat}
  }\\
  
  \defxfer &\equiv \tuple{
    \begin{alignedat}{3}
      \isa{\dxNsource&}{\serviceid}\,,\;
      \isa{&\dxNdest&}{\serviceid}\,,\;
      \isa{&\dxNdestsupervisor&}{\bool}\,,\;\\
      \isa{\dxNamount&}{\balance}\,,\;
      \isa{&\dxNmemo&}{\memo}\,,\;
      \isa{&\dxNgas&}{\gas}
    \end{alignedat}
  }\end{aligned}$$

The union of the two $\operandtuple \cup \defxfer$ characterizes inputs to the Accumulation invocation function $\Psi_A$ (defined in equation [eq:accinvocation]).

Our formalisms continue by defining $\partialstate$ as a characterization of (i.e. values capable of representing) state components which are both needed and mutable by the accumulation process. This comprises the service accounts state (as in $\accountspre$), the upcoming validator keys $\stagingset$, the queue of authorizers $\authqueue$ and the privileges state $\privileges$. Formally: $$
  \partialstate \equiv \tuple{\begin{alignedat}{2}
    \isa{\psNaccounts&}{\dictionary{\serviceid}{\serviceaccount}}\,,\;
    \isa{&\psNstagingset&}{\allvalkeys}\,,\;\\
    \isa{\psNauthqueue&}{\sequence[\Ccorecount]{\sequence[\Cauthqueuesize]{\hash}}}\,,\;
    \isa{&\psNprivileges&}{\privilegestype}
  \end{alignedat}}$$

Finally, we define $B$ and $U$, the sets characterizing service-indexed commitments to accumulation output and service-indexed gas usage respectively: $$B\equiv \protoset{\tuple{\serviceid, \hash}} \qquad
  U\equiv \sequence{\tuple{\serviceid, \gas}}$$

It is possible for a service's state to be modified by both the service's Accumulate logic and its supervisor's Accumulate logic. We wish to avoid inconsistent state resulting from concurrent modification while not unnecessarily restricting parallel accumulation. To this end, we optimistically permit execution of a service's Accumulate logic and its supervisor's Accumulate logic in the same round, but discard all results[^13] of the service's execution if both modify the service's state. Note that ejection of a service is considered a modification of its state.

As the result of accumulating a transfer cannot reasonably be discarded (this would cause funds to be lost), deferred transfers to a service are *never* accumulated in parallel with execution of the Accumulate logic of the supervisor. We define the function $T$ which partitions a sequence of deferred transfers into those which may be accumulated in parallel with the Accumulate logic of the services $\mathbf{s}$ and those which must be accumulated in a later round. $$\begin{gathered}
    T(\mathbf{t}, \mathbf{s}, \mathbf{d}) \equiv T^*(\mathbf{t}, \mathbf{s}, \emptyset, \mathbf{d}) \\
    T^*\colon\abracegroup{
      &\tuple{\sequence{\defxfer}, \protoset{\serviceid}, \protoset{\serviceid}, \dictionary{\serviceid}{\serviceaccount}} \to \tuple{\sequence{\defxfer}, \sequence{\defxfer}} \\
      &\tup{\sq{}, \mathbf{s}, \mathbf{i}, \mathbf{d}} \mapsto \tup{\sq{}, \sq{}} \\
      &\tup{\sq{t} \concat \mathbf{t}, \mathbf{s}, \mathbf{i}, \mathbf{d}} \mapsto \begin{cases}
        \tup{\mathbf{t}^!, \sq{t} \concat \mathbf{t}^Q} &\when q = \top \\
        \tup{\sq{t} \concat \mathbf{t}^!, \mathbf{t}^Q} &\otherwise
      \end{cases} \\
      &\quad\where q = (t_\dxNdest \in \keys{\mathbf{d}} \land \effectivesupervisor{\mathbf{d}}{t_\dxNdest} \in (\mathbf{s} \cup \mathbf{i}) \setminus \set{t_\dxNdest}) \lor {} \\
      &\quad\phantom{\where q = {}} \exists s \in \mathbf{i} \setminus \set{t_\dxNdest} : \effectivesupervisor{\mathbf{d}}{s} = t_\dxNdest \\
      &\quad\also \mathbf{i}' = \begin{cases}
        \mathbf{i} &\when q = \top \lor t_\dxNdest \not\in \keys{\mathbf{d}} \\
        \mathbf{i} \cup \set{t_\dxNdest} &\otherwise
      \end{cases} \\
      &\quad\also \tup{\mathbf{t}^!, \mathbf{t}^Q} = T^*(\mathbf{t}, \mathbf{s}, \mathbf{i}', \mathbf{d})
    }
  \end{gathered}$$

Note that a deferred transfer may still be discarded, and the funds effectively burnt, if by the point of its accumulation the destination service has been ejected. See the definition of $\Psi_A$ in equation [eq:accinvocation].

We define the outer accumulation function $\accseq$ which transforms a gas-limit, a sequence of deferred transfers, a sequence of work-reports, an initial partial-state and a dictionary of services enjoying free accumulation, into a tuple of the number of work-reports accumulated, a posterior state-context, the resultant accumulation-output pairings, the service-indexed gas usage and the sequence of processed transfers: $$
  \accseq\colon\abracegroup{
    &\tuple{\gas, \defxfers, \workreports, \partialstate, \dictionary{\serviceid}{\gas}} \to \tuple{\N, \partialstate, B, U, \defxfers} \\
    &\tup{g, \mathbf{t}, \mathbf{r}, \psX, \mathbf{f}} \!\mapsto\! \begin{cases}
      \tup{0, \psX, \emset, \sq{}, \sq{}} &
        \when n = 0 \\
      \tup{i + j, \psX', \mathbf{b}^* \!\cup \mathbf{b}, \mathbf{u}^* \!\!\concat \mathbf{u}, \mathbf{t}^!\! \concat \mathbf{t}^\dagger}\!\!\!\! &
        \text{o/w}\!\!\!\!\!\!\!\! \\
    \end{cases} \\
    &\quad\where i = \max(\Nmax{\len{\mathbf{r}} + 1}): \\
    &\qquad \sum_{r \in \mathbf{r}\sub{\dots i}, d \in r_\wrNdigests}\!\!\!\!\!\!\!\!(d_\wdNgaslimit) + \sum_{t \in \mathbf{t}}(t_\dxNgas) + \!\!\!\!\sum_{x \in \values{\mathbf{f}}}\!\!\!\!(x) \le g \\
    &\quad\also \mathbf{s} = \set{\build{d_\wdNserviceindex}{r \in \mathbf{r}\sub{\dots i}, d \in r_\wrNdigests}} \cup \keys{\mathbf{f}} \\
    &\quad\also \tup{\mathbf{t}^!, \mathbf{t}^Q} = T(\mathbf{t}, \mathbf{s}, \psX_\psNaccounts) \\
    &\quad\also n = i + \len{\mathbf{t}^!} + \len{\mathbf{f}} \\
    &\quad\also \tup{\psX^*\!\!, \mathbf{t}^*\!\!, \mathbf{b}^*\!\!, \mathbf{u}^*} = \accpar(\psX, \mathbf{t}^!,\mathbf{r}\sub{\dots i}, \mathbf{f}) \\
    &\quad\also \tup{j, \psX'\!, \mathbf{b}, \mathbf{u}, \mathbf{t}^\dagger} = \accseq(g^*, \mathbf{t}^Q\! \concat \mathbf{t}^*\!\!, \mathbf{r}\sub{i\dots}, \psX^*\!\!, \emset)\\
    &\quad\also g^* = g + \sum_{t \in \mathbf{t^*}}(t_\dxNgas) - \!\!\!\!\!\!\sum_{\tup{s, u} \in \mathbf{u}^*}\!\!\!\!\!\!(u)
  }$$

We come to define the parallelized accumulation function $\accpar$ which, with the help of the single-service accumulation function $\accone$, transforms an initial state-context, together with a sequence of deferred transfers, a sequence of work-reports and a dictionary of privileged always-accumulate services, into a tuple of the posterior state-context, the resultant deferred-transfers and accumulation-output pairings, and the service-indexed gas usage. Note that for the privileges we employ a function $R$ which selects the service to which the manager service changed, or if no change was made, then that which the service itself changed to. This allows privileges to be 'owned' and facilitates the removal of the manager service which we see as a helpful possibility. Formally: $$\begin{gathered}
  
  \accpar\colon\abracegroup[\;]{\begin{aligned}
    &\tuple{\partialstate, \defxfers, \workreports, \dictionary{\serviceid}{\gas}} \to \tuple{\partialstate, \defxfers, B, U} \\
    &\tup{\psX, \mathbf{t}, \mathbf{r}, \mathbf{f}} \mapsto \tup{
      \tup{\psNaccounts', \psNstagingset', \psNauthqueue', \psNprivileges'}, \concatall{\mathbf{t}'}, \mathbf{b}, \mathbf{u}
    }\!\!\!\!\!\!\\
    &\text{where:}\\
    &\ \begin{aligned}
      \using &\tup{
        \psNaccounts, \psNstagingset, \psNauthqueue, \is{\psNprivileges}{\tup{\prNmanager, \prNdelegator, \prNregistrar, \prNassigners, \prNalwaysaccers}}
      } = \psX \\
      \mathbf{s} &= \set{\build{
        d_\wdNserviceindex
        }{
          r \in \mathbf{r}, d \in r_\wrNdigests
        }} \cup \keys{\mathbf{f}} \cup \set{\build{t_\dxNdest}{t \in \mathbf{t}}} \\
      N(\mathbf{o}) \in \acconeout &\equiv \tup{
        \aoNpoststate,
        \is{\aoNmodifiedaccounts}{\emset},
        \is{\aoNdefxfers}{\sq{}},
        \is{\aoNyield}{\none},
        \is{\aoNgasused}{\mathbf{o}_\aoNgasused},
        \is{\aoNprovisions}{\mathbf{o}_\aoNprovisions}
      } \\
      \accumulate(s) &\equiv \begin{cases}
        N(\mathbf{o}) &\when s \in \mathbf{o}_\aoNmodifiedaccounts \land s \in \mathbf{y}_\aoNmodifiedaccounts \setminus \set{\effectivesupervisor{\psNaccounts}{s}} \\
        \mathbf{o} &\otherwise
      \end{cases} \\
      &\phantom{{}\equiv{}} \where \mathbf{o} = \accone(\psX, \mathbf{t}, \mathbf{r}, \mathbf{f}, s) \\
      &\phantom{{}\equiv{}} \also \mathbf{y} = \accone(\psX, \mathbf{t}, \mathbf{r}, \mathbf{f}, \effectivesupervisor{\psNaccounts}{s}) \\
      \mathbf{u} &= \sq{\build{
          \tup{s, \accumulate(s)_\aoNgasused}
        }{
          s \orderedin \mathbf{s}
        }} \\
      \mathbf{b} &= \set{\build{
          \tup{s, b}
        }{
          s \in \mathbf{s},\,
          b = \accumulate(s)_\aoNyield,\,
          b \ne \none
        }} \\
      \mathbf{t}' &= \sq{\build{
          \accumulate(s)_\aoNdefxfers
        }{
          s \orderedin \mathbf{s}
        }} \\
      \psNaccounts' &= I(
        \mathbf{m} \cup \mathbf{n},
        \bigcup_{s \in \mathbf{s}} \accumulate(s)_\aoNprovisions
      ) \\
      X(s) &\equiv (\accumulate(s)_\aoNpoststate)_\psNprivileges \\
      \psNprivileges'_{\tup{\prNmanager, \prNalwaysaccers}} &=
        X(m)_{\tup{\prNmanager, \prNalwaysaccers}} \\
      \psNprivileges'_\prNdelegator &= R(
        \prNdelegator,
        X(m)_\prNdelegator,
        X(\prNdelegator)_\prNdelegator
      ) \\
      \psNprivileges'_\prNregistrar &= R(
        \prNregistrar,
        X(m)_\prNregistrar,
        X(\prNregistrar)_\prNregistrar
      ) \\
      \forall c \in \coreindex &:
        \psNprivileges'_\prNassigners\subb{c} = R(
          \prNassigners\sub{c},
          (X(m)_\prNassigners)\sub{c},
          (X(\prNassigners\sub{c})_\prNassigners)\sub{c}
        ) \\
      \psNstagingset' &= (
        \accumulate(\prNdelegator)_\aoNpoststate
      )_\psNstagingset \\
      \forall c \in \coreindex &:
        \psNauthqueue'\sub{c} = ((
          \accumulate(\prNassigners\sub{c})_\aoNpoststate
        )_\psNauthqueue)\sub{c} \\
      M(s) &\equiv \begin{cases}
        (\accumulate(s)_\aoNpoststate)_\psNaccounts\subb{s} &\when s \in \accumulate(s)_\aoNmodifiedaccounts \\
        (\accumulate(\effectivesupervisor{\psNaccounts}{s})_\aoNpoststate)_\psNaccounts\subb{s} &\otherwise
      \end{cases} \\
      \mathbf{m} &= \set{\build{\kv{s}{M(s)}}{s \in \keys{\psNaccounts}, M(s) \ne \none}} \\
      \mathbf{n} &= \bigcup_{s \in \mathbf{s}}(
        (\accumulate(s)_\aoNpoststate)_\psNaccounts
          \setminus
        \keys{\psNaccounts}
      )
    \end{aligned}
  \end{aligned}} \\
  R(o, a, b) \equiv \begin{cases}
    b &\when a = o \\
    a &\otherwise
  \end{cases}\end{gathered}$$

$I$ is the preimage integration function, which transforms a dictionary of service states and a set of service/blob pairs into a new dictionary of service states. Preimage provisions into services which no longer exist or whose relevant request is dropped are disregarded: $$\begin{aligned}
  I&\colon\abracegroup{
    &\tuple{\dictionary{\serviceid}{\serviceaccount}, \protoset{\tuple{\serviceid, \blob}}} \to \dictionary{\serviceid}{\serviceaccount} \\
    &\tup{\mathbf{d}, \mathbf{p}} \mapsto \mathbf{d}'\;\where \mathbf{d}' = \mathbf{d}\;\text{except:} \\
    &\quad\forall \tup{s, \mathbf{i}} \in \mathbf{p},\;
      Y(\mathbf{d}, s, \mathbf{i}):\\
    &\qquad \mathbf{d}'\subb{s}_\saNrequests\subb{\tup{\blake{\mathbf{i}}, \len{\mathbf{i}}}} =\sq{\thetime'}\\
    &\qquad \mathbf{d}'\subb{s}_\saNpreimages\subb{\blake{\mathbf{i}}} = \mathbf{i}
  } \\
  Y&\colon\abracegroup{
    &\tuple{\dictionary{\serviceid}{\serviceaccount}, \serviceid, \blob} \to \bool \\
    &\tup{\mathbf{d}, s, \mathbf{i}} \mapsto \begin{cases}
      \mathbf{d}\subb{s}_\saNrequests\subb{\tup{\blake{\mathbf{i}}, \len{\mathbf{i}}}} = \sq{} &\when s \in \keys{\mathbf{d}} \\
      \bot &\otherwise
    \end{cases}
  }\end{aligned}$$

We note that while forming the union of newly added services, defined in the above context as $\mathbf{n}$, different services may not each contribute the same index for a new service. New indices are explicitly selected to avoid such conflicts. In the unlikely event of a conflict, the block must be considered invalid.

The single-service accumulation function, $\accone$, transforms an initial state-context, a sequence of deferred-transfers, a sequence of work-reports, a dictionary of services enjoying free accumulation (with the values indicating the amount of free gas) and a service index into an alterations state-context, a set identifying the modified services, a sequence of *transfers*, a possible accumulation-output, the actual PVM gas used and a set of preimage provisions. This function wrangles the work-digests of a particular service from a set of work-reports and invokes PVM execution with said data: $$
  \acconeout \equiv \tuple{
    \begin{alignedat}{3}
      \isa{\aoNpoststate&}{\partialstate},\;
      \isa{&\aoNmodifiedaccounts&}{\protoset{\serviceid}},\;
      \isa{&\aoNdefxfers&}{\defxfers},\; \\
      \isa{\aoNyield&}{\optional{\hash}},\;
      \isa{&\aoNgasused&}{\gas},\;
      \isa{&\aoNprovisions&}{\protoset{\tuple{\serviceid, \blob}}}
    \end{alignedat}
  }$$ $$\begin{aligned}
  
  &\accone \colon \abracegroup[\;]{
    &\begin{aligned}
      \tuple{\begin{aligned}
        &\partialstate, \defxfers, \workreports,\\
        &\dictionary{\serviceid}{\gas}, \serviceid
      \end{aligned}}
      &\to \acconeout \\
      \tup{\psX, \mathbf{t}, \mathbf{r}, \mathbf{f}, s} &\mapsto \Psi_A(\psX, \thetime', s, g, \mathbf{i}^T \!\!\concat \mathbf{i}^U)
    \end{aligned} \\
    &\text{where:} \\
    &\ \begin{aligned}
      g &= \subifnone{\mathbf{f}\sub{s}, 0}
        + \!\!\!\!\sum_{t \in \mathbf{t}, t_\dxNdest = s}\!\!\!\!(t_\dxNgas)
        + \!\!\!\!\!\!\!\!\sum_{r \in \mathbf{r}, d \in r_\wrNdigests, d_\wdNserviceindex = s}\!\!\!\!\!\!\!\!(d_\wdNgaslimit) \\
      \mathbf{i}^T &= \sq{\build{
        t
      }{
        t \orderedin \mathbf{t}, t_\dxNdest = s
      }}\\
      \mathbf{i}^U &= \sq{\build{
        \tup{\begin{alignedat}{3}
          \is{\otNresult}{d_\wdNresult},\,
          \is{\otNgaslimit}{d_\wdNgaslimit},\,
          \is{\otNpayloadhash}{d_\wdNpayloadhash},\,
          \is{&\otNauthtrace\;&}{r_\wrNauthtrace&},\\
          \is{\otNsegroot}{(r_\wrNavspec)_\asNsegroot},\,
          \is{\otNpackagehash}{(r_\wrNavspec)_\asNpackagehash},\,
          \is{&\otNauthorizer\;&}{r_\wrNauthorizer&}
        \end{alignedat}}
      }{
        \begin{alignedat}{2}
          r& \orderedin \mathbf{r},&\\
          d& \orderedin r_\wrNdigests,&\ d_\wdNserviceindex = s
        \end{alignedat}
      }}
    \end{aligned}
  }\!\!\!\!\end{aligned}$$

This draws upon $\wdNgaslimit$, the gas limit implied by the selected deferred-transfers, work-reports and gas-privileges.
