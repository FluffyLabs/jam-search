---
type: graypaper_section
title: 12.2 Execution
index: 82
---
We work with a limited amount of gas per block and therefore may not be able to process all items in $\justbecameavailable^*$ in a single block. There are two slightly antagonistic factors allowing us to optimize the amount of work-items, and thus work-reports, accumulated in a single block:

Firstly, while we have a well-known gas-limit for each work-item to be accumulated, accumulation may still result in a lower amount of gas used. Only after a work-item is accumulated can it be known if it uses less gas than the advertised limit. This implies a sequential execution pattern.

Secondly, since PVM setup cannot be expected to be zero-cost, we wish to amortize this cost over as many work-items as possible. This can be done by aggregating work-items associated with the same service into the same PVM invocation. This implies a non-sequential execution pattern.

We resolve this by defining a function $\accseq$ which accumulates work-reports sequentially, and which itself utilizes a function $\accpar$ which accumulates work-reports in a non-sequential, service-aggregated manner. In all but the first invocation of $\accseq$, we also integrate the effects of any *deferred-transfers* implied by the previous round of accumulation, thus the accumulation function must accept both the information contained in work-digests and that of deferred-transfers.

Rather than passing whole work-digests into accumulate, we extract the salient information from them and combine with information implied by their work-reports. We call this kind of combined value an *operand tuple*, $\operandtuple$. Likewise, we denote the set characterizing a *deferred transfer* as $\defxfer$, noting that a transfer includes a memo component $\dxNmemo$ of $\Cmemosize = 128$ octets, together with the service index of the sender $\dxNsource$, the service index of the receiver $\dxNdest$, the balance to be transferred $\dxNamount$ and the gas limit $\dxNgas$ for the transfer. Formally: $$\begin{aligned}
  
  \operandtuple &\equiv \tuple{
    \begin{alignedat}{5}
      \isa{\otNpackagehash&}{\hash},\;
      \isa{&\otNsegroot&}{\hash},\;
      \isa{&\otNauthorizer&}{\hash},\;
      \isa{\otNpayloadhash}{\hash},\;\\
      \isa{\otNgaslimit&}{\gas},\;
      \isa{&\otNauthtrace&}{\blob},\;
      \isa{&\otNresult&}{\blob \cup \workerror}
    \end{alignedat}
  }\\
  
  \defxfer &\equiv \tuple{
    \isa{\dxNsource}{\serviceid} ,
    \isa{\dxNdest}{\serviceid} ,
    \isa{\dxNamount}{\balance} ,
    \isa{\dxNmemo}{\memo} ,
    \isa{\dxNgas}{\gas}
  }\\
  
  \accinput &\equiv \operandtuple \cup \defxfer\end{aligned}$$

Note that the union of the two is the *accumulation input*, $\accinput$.

Our formalisms continue by defining $\partialstate$ as a characterization of (i.e. values capable of representing) state components which are both needed and mutable by the accumulation process. This comprises the service accounts state (as in $\accountspre$), the upcoming validator keys $\stagingset$, the queue of authorizers $\authqueue$ and the privileges state $\privileges$. Formally: $$
  \partialstate \equiv \tuple{\begin{aligned}
    &\isa{\psNaccounts}{\dictionary{\serviceid}{\serviceaccount}} \,,\;
    \isa{\psNstagingset}{\sequence[\Cvalcount]{\valkey}} \,,\;
    \isa{\psNauthqueue}{\sequence[\Ccorecount]{\sequence[\Cauthqueuesize]{\hash}}} \,,\;
    \isa{\psNmanager}{\serviceid} \,,\\
    &\isa{\psNassigners}{\sequence[\Ccorecount]{\serviceid}} \,,\;
    \isa{\psNdelegator}{\serviceid} \,,\;
    \isa{\psNregistrar}{\serviceid} \,,\;
    \isa{\psNalwaysaccers}{\dictionary{\serviceid}{\gas}}
  \end{aligned}}$$

Finally, we define $B$ and $U$, the sets characterizing service-indexed commitments to accumulation output and service-indexed gas usage respectively: $$B\equiv \protoset{\tuple{\serviceid, \hash}} \qquad
  U\equiv \sequence{\tuple{\serviceid, \gas}}$$

We define the outer accumulation function $\accseq$ which transforms a gas-limit, a sequence of deferred transfers, a sequence of work-reports, an initial partial-state and a dictionary of services enjoying free accumulation, into a tuple of the number of work-reports accumulated, a posterior state-context, the resultant accumulation-output pairings and the service-indexed gas usage: $$
  \accseq\colon\abracegroup{
    &\tuple{\gas, \defxfers, \workreports, \partialstate, \dictionary{\serviceid}{\gas}} \to \tuple{\N, \partialstate, B, U} \\
    &\tup{g, \mathbf{t}, \mathbf{r}, \psX, \mathbf{f}} \!\mapsto\! \begin{cases}
      \tup{0, \psX, \emset, \sq{}} &
        \when n = 0 \\
      \tup{i + j, \psX', \mathbf{b}^* \!\cup \mathbf{b}, \mathbf{u}^* \!\!\concat \mathbf{u}}\!\!\!\! &
        \text{o/w}\!\!\!\!\!\!\!\! \\
    \end{cases} \\
    &\quad\where i = \max(\Nmax{\len{\mathbf{r}} + 1}): \sum_{r \in \mathbf{r}\sub{\dots i}, d \in r_\wrNdigests}(d_\wdNgaslimit) \le g \\
    &\quad\also n = \len{\mathbf{t}} + i + \len{\mathbf{f}} \\
    &\quad\also \tup{\psX^*\!\!, \mathbf{t}^*\!\!, \mathbf{b}^*\!\!, \mathbf{u}^*} = \accpar(\psX, \mathbf{t},\mathbf{r}\sub{\dots i}, \mathbf{f}) \\
    &\quad\also \tup{j, \psX'\!, \mathbf{b}, \mathbf{u}} = \accseq(g^* - \!\!\!\!\!\!\sum_{\tup{s, u} \in \mathbf{u}^*}\!\!\!\!\!\!(u), \mathbf{t}^*\!\!, \mathbf{r}\sub{i\dots}, \psX^*\!\!, \emset)\\
    &\quad\also g^* = g + \sum_{t \in \mathbf{t}}(t_\dxNgas)
  }$$

We come to define the parallelized accumulation function $\accpar$ which, with the help of the single-service accumulation function $\accone$, transforms an initial state-context, together with a sequence of deferred transfers, a sequence of work-reports and a dictionary of privileged always-accumulate services, into a tuple of the posterior state-context, the resultant deferred-transfers and accumulation-output pairings, and the service-indexed gas usage. Note that for the privileges we employ a function $R$ which selects the service to which the manager service changed, or if no change was made, then that which the service itself changed to. This allows privileges to be 'owned' and facilitates the removal of the manager service which we see as a helpful possibility. Formally: $$
  \accpar\colon\abracegroup[\;]{\begin{aligned}
    &\tuple{\partialstate, \defxfers, \workreports, \dictionary{\serviceid}{\gas}} \to \tuple{\partialstate, \defxfers, B, U} \\
    &\tup{\psX, \mathbf{t}, \mathbf{r}, \mathbf{f}} \mapsto \tup{
      \tup{
        \psNaccounts', \psNstagingset', \psNauthqueue', \psNmanager', \psNassigners', \psNdelegator', \psNregistrar', \psNalwaysaccers'
      }, \concatall{\mathbf{t}'}, \mathbf{b}, \mathbf{u}
    }\!\!\!\!\!\!\\
    &\text{where:}\\
    &\ \begin{aligned}
      \using \mathbf{s} &= \set{\build{
        d_\wdNserviceindex
        }{
          r \in \mathbf{r}, d \in r_\wrNdigests
        }} \cup \keys{\mathbf{f}} \cup \set{\build{t_\dxNdest}{t \in \mathbf{t}}} \\
      \accumulate(s) &\equiv \accone(\psX, \mathbf{t}, \mathbf{r}, \mathbf{f}, s) \\
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
        (\psNaccounts \cup \mathbf{n}) \setminus \mathbf{m},
        \bigcup_{s \in \mathbf{s}} \accumulate(s)_\aoNprovisions
      ) \\
      &\tup{
        \psNaccounts, \psNstagingset, \psNauthqueue, \psNmanager, \psNassigners, \psNdelegator, \psNregistrar, \psNalwaysaccers
      } = \psX \\
      \mathbf{e}^*&= \accumulate(m)_\aoNpoststate \\
      \tup{\psNmanager'\!,\psNalwaysaccers'} &=
        \mathbf{e}^*_{\tup{\psNmanager, \psNalwaysaccers}} \\
      \forall c \in \coreindex :
        \psNassigners'\sub{c} &= R(
          \psNassigners\sub{c},
          (\mathbf{e}^*_\psNassigners)\sub{c},
          ((\accumulate(\psNassigners\sub{c})_\aoNpoststate)_\psNassigners)\sub{c}
        ) \\
      \psNdelegator' &= R(
        \psNdelegator,
        \mathbf{e}^*_\psNdelegator,
        (\accumulate(\psNdelegator)_\aoNpoststate)_\psNdelegator
      ) \\
      \psNregistrar' &= R(
        \psNregistrar,
        \mathbf{e}^*_\psNregistrar,
        (\accumulate(\psNregistrar)_\aoNpoststate)_\psNregistrar
      ) \\
      \psNstagingset' &= (
          \accumulate(\psNdelegator)_\aoNpoststate
      )_\psNstagingset \\
      \forall c \in \coreindex :
        \psNauthqueue'\sub{c} &= ((
          \accumulate(\psNassigners\sub{c})_\aoNpoststate
        )_\psNauthqueue)\sub{c} \\
      \mathbf{n} &= \bigcup_{s \in \mathbf{s}}(
        (\accumulate(s)_\aoNpoststate)_\psNaccounts
          \setminus
        \keys{\psNaccounts \setminus \set{s}}
      ) \\
      \mathbf{m} &= \bigcup_{s \in \mathbf{s}}(
        \keys{\psNaccounts}
          \setminus
        \keys{(\accumulate(s)_\aoNpoststate)_\psNaccounts}
      )
    \end{aligned}
  \end{aligned}}$$ $$R(o, a, b) \equiv \begin{cases}
    b &\when a = o \\
    a &\otherwise
  \end{cases}$$

And $I$ is the preimage integration function, which transforms a dictionary of service states and a set of service/blob pairs into a new dictionary of service states. Preimage provisions into services which no longer exist or whose relevant request is dropped are disregarded: $$\begin{aligned}
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

We note that while forming the union of all altered, newly added service and newly removed indices, defined in the above context as $\keys{\mathbf{n}} \cup \mathbf{m}$, different services may not each contribute the same index for a new, altered or removed service. This cannot happen for the set of removed and altered services since the code hash of removable services has no known preimage and thus cannot execute itself to make an alteration. For new services this should also never happen since new indices are explicitly selected to avoid such conflicts. In the unlikely event it does happen, the block must be considered invalid.

The single-service accumulation function, $\accone$, transforms an initial state-context, a sequence of deferred-transfers, a sequence of work-reports, a dictionary of services enjoying free accumulation (with the values indicating the amount of free gas) and a service index into an alterations state-context, a sequence of *transfers*, a possible accumulation-output, the actual PVM gas used and a set of preimage provisions. This function wrangles the work-digests of a particular service from a set of work-reports and invokes PVM execution with said data: $$
  \acconeout \equiv \tuple{
    \begin{alignedat}{3}
      \isa{\aoNpoststate&}{\partialstate},\;
      \isa{&\aoNdefxfers&}{\defxfers},\;
      \isa{\aoNyield}{\optional{\hash}},\;\\
      \isa{\aoNgasused&}{\gas},\;
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
