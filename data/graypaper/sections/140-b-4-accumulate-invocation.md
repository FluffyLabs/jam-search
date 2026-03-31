---
type: graypaper_section
title: B.4 Accumulate Invocation
index: 140
---
Since this is a transition which can directly affect a substantial amount of on-chain state, our invocation context is accordingly complex. It is a tuple with elements for each of the aspects of state which can be altered through this invocation and beyond the account of the service itself includes the deferred transfer list and several dictionaries for alterations to preimage lookup state, core assignments, validator key assignments, newly created accounts and alterations to account privilege levels.

Formally, we define our result context to be $\implications$, and our invocation context to be a pair of these contexts, $\implications \times \implications$ (and thus for any value $\imX \in \implications$ there exists $\imX^2 \in \implications \times \implications$), with one dimension being the regular dimension and generally named $\imX$ and the other being the exceptional dimension and being named $\imY$. The only function which actually alters this second dimension is $\mathtt{checkpoint}$, $\Omega_C$ and so it is rarely seen. $$\begin{aligned}

  \implications &\equiv \tuple{
    \isa{\imNid}{\serviceid},
    \isa{\imNstate}{\partialstate},
    \isa{\imNnextfreeid}{\serviceid},
    \isa{\imNxfers}{\defxfers},
    \isa{\imNyield}{\optional{\hash}},
    \isa{\imNprovisions}{\protoset{\tuple{\serviceid, \blob}}}
  }\\
  \forall \imX \in \implications :
    \imX_\imNself &\equiv (\imX_\imNstate)_\psNaccounts\subb{\imX_\imNid}\end{aligned}$$

We define a convenience equivalence $\imX_\imNself$ to easily denote the accumulating service account.

We track both regular and exceptional dimensions within our context mutator, but collapse the result of the invocation to one or the other depending on whether the termination was regular or exceptional (i.e. out-of-gas or panic).

We define $\Psi_A$, the Accumulation invocation function as: $$\begin{aligned}
  
  \Psi_A& \colon\abracegroup{
    \tuple{
      \partialstate, \timeslot, \serviceid, \gas, \sequence{\accinput}
    }
    &\to \acconeout
    \\
    \tup{\aoNpoststate, t, s, g, \mathbf{i}} &\mapsto \begin{cases}
      \tup{
        \is{\aoNpoststate}{\mathbf{s}},
        \is{\aoNdefxfers}{\sq{}},
        \is{\aoNyield}{\none},
        \is{\aoNgasused}{0},
        \is{\aoNprovisions}{\sq{}}
      }
        &\when \mathbf{c} = \none \vee \len{\mathbf{c}} > \Cmaxservicecodesize \\
      C(\Psi_M(\mathbf{c}, 5, g, \encode{t, s, \len{\mathbf{i}}}, F, I(\mathbf{s}, s)^2))
        &\otherwise \\
      \begin{aligned}
        &\quad\where \mathbf{c} = \aoNpoststate_\psNaccounts\subb{s}_\saNcode\\
        &\quad\also \mathbf{s}= \aoNpoststate\exc \mathbf{s}_\psNaccounts\subb{s}_\saNbalance = \aoNpoststate_\psNaccounts\subb{s}_\saNbalance + \sum_{r \in \mathbf{x}}r_\dxNamount\\
        &\quad\also \mathbf{x} = \sq{\build{i}{
          i \orderedin \mathbf{i} ,
          i \in \defxfer
        }}
      \end{aligned}\\
    \end{cases} \\
  }\\
  I&\colon\abracegroup{
    \tuple{\partialstate, \serviceid} &\to \implications\\
    \tup{\imNstate, \imNid} &\mapsto \tup{
      \imNid,
      \imNstate,
      \imNnextfreeid,
      \is{\imNxfers}{\sq{}},
      \is{\imNyield}{\none},
      \is{\imNprovisions}{\sq{}}
    }\\
    &\qquad\where \imNnextfreeid = \text{check}((\decode[4]{\blake{\encode{\imNid, \entropyaccumulator', \H_\Ntimeslot}}} \bmod (2^{32}-\Cminpublicindex-2^8)) + \Cminpublicindex) \\
  }\\
  F \in \contextmutator{\implicationspair} &\colon \tup{n, \gascounter, \registers, \memory, \imXY} \mapsto \begin{cases}
  \Omega_G(\gascounter, \registers, \memory, \imXY) &\when n = \mathtt{gas} \\
    \Omega_Y(\gascounter, \registers, \memory, \none, \entropyaccumulator', \none, \none, \none, \none, \mathbf{i}, \imXY) &\when n = \mathtt{fetch}\\
    G(\Omega_R(\gascounter, \registers, \memory, \imX_\imNself, \imX_\imNid, (\imX_\imNstate)_\psNaccounts), \imXY) &\when n = \mathtt{read} \\
    G(\Omega_W(\gascounter, \registers, \memory, \imX_\imNself, \imX_\imNid), \imXY) &\when n = \mathtt{write} \\
    G(\Omega_L(\gascounter, \registers, \memory, \imX_\imNself, \imX_\imNid, (\imX_\imNstate)_\psNaccounts), \imXY) &\when n = \mathtt{lookup} \\
    G(\Omega_I(\gascounter, \registers, \memory, \imX_\imNid, (\imX_\imNstate)_\psNaccounts), \imXY) &\when n = \mathtt{info} \\
    \Omega_B(\gascounter, \registers, \memory, \imXY) &\when n = \mathtt{bless}\\
    \Omega_A(\gascounter, \registers, \memory, \imXY) &\when n = \mathtt{assign}\\
    \Omega_D(\gascounter, \registers, \memory, \imXY) &\when n = \mathtt{designate}\\
    \Omega_C(\gascounter, \registers, \memory, \imXY) &\when n = \mathtt{checkpoint} \\
    \Omega_N(\gascounter, \registers, \memory, \imXY, \H_\Ntimeslot) &\when n = \mathtt{new} \\
    \Omega_U(\gascounter, \registers, \memory, \imXY) &\when n = \mathtt{upgrade} \\
    \Omega_T(\gascounter, \registers, \memory, \imXY) &\when n = \mathtt{transfer} \\
    \Omega_J(\gascounter, \registers, \memory, \imXY, \H_\Ntimeslot) &\when n = \mathtt{eject} \\
    \Omega_Q(\gascounter, \registers, \memory, \imXY) &\when n = \mathtt{query} \\
    \Omega_S(\gascounter, \registers, \memory, \imXY, \H_\Ntimeslot) &\when n = \mathtt{solicit} \\
    \Omega_F(\gascounter, \registers, \memory, \imXY, \H_\Ntimeslot) &\when n = \mathtt{forget} \\
    \Omega_\Taurus(\gascounter, \registers, \memory, \imXY) &\when n = \mathtt{yield} \\
    \Omega_\Aries(\gascounter, \registers, \memory, \imXY) &\when n = \mathtt{provide} \\
    \tup{\oog, \gascounter', \registers', \memory, \imXY} &\otherwhen \gascounter' < 0\\
    \tup{\blacktriangleright, \gascounter', \registers', \memory, \imXY} &\otherwise\\
    \multicolumn{2}{l}{\where \registers' = \registers \exc \registers'_7 = \mathtt{WHAT}} \\
    \multicolumn{2}{l}{\also \gascounter' = \gascounter - 10}
  \end{cases} \\
  G&\colon\abracegroup{
    \tuple{\tuple{\set{\blacktriangleright, \halt, \panic, \oog}, \gas, \sequence[13]{\pvmreg}, \ram, \serviceaccount}, \implicationspair} &\to \tuple{\set{\blacktriangleright, \halt, \panic, \oog}, \gas, \sequence[13]{\pvmreg}, \ram, \implicationspair} \\
    \tup{\tup{\execst, \gascounter, \registers, \memory, \mathbf{s}}, \imXY} &\mapsto \tup{\execst, \gascounter, \registers, \memory, \tup{\imX^*, \imY}} \\
    &\qquad \where \imX^* = \imX \exc \imX^*_\imNself = \mathbf{s}
  }\\
  C&\colon\abracegroup{
    \tuple{\gas, \blob \cup \set{\oog, \panic}, \implicationspair} &\to \acconeout \\
    \tup{\aoNgasused, \mathbf{o}, \imXY} &\mapsto \begin{cases}
      \tup{
        \is{\aoNpoststate}{\imY_\imNstate},
        \is{\aoNdefxfers}{\imY_\imNxfers},
        \is{\aoNyield}{\imY_\imNyield},
        \aoNgasused,
        \is{\aoNprovisions}{\imY_\imNprovisions}
      } & \when \mathbf{o} \in \set{\oog, \panic} \\
      \tup{
        \is{\aoNpoststate}{\imX_\imNstate},
        \is{\aoNdefxfers}{\imX_\imNxfers},
        \is{\aoNyield}{\mathbf{o}},
        \aoNgasused,
        \is{\aoNprovisions}{\imXY_\imNprovisions}
      } & \otherwhen \mathbf{o} \in \hash \\
      \tup{
        \is{\aoNpoststate}{\imX_\imNstate},
        \is{\aoNdefxfers}{\imX_\imNxfers},
        \is{\aoNyield}{\imX_\imNyield},
        \aoNgasused,
        \is{\aoNprovisions}{\imX_\imNprovisions}
      } & \otherwise \\
    \end{cases}
  }\end{aligned}$$

The mutator $F$ governs how this context will alter for any given parameterization, and the collapse function $C$ selects one of the two dimensions of context depending on whether the virtual machine's halt was regular or exceptional.

The initializer function $I$ maps some partial state along with a service account index to yield a mutator context such that no alterations to the given state are implied in either exit scenario. Note that the component $a$ utilizes the random accumulator $\entropyaccumulator'$ and the block's timeslot $\H_\Ntimeslot$ to create a deterministic sequence of identifiers which are extremely likely to be unique.

Concretely, we create the identifier from the Blake2 hash of the identifier of the creating service, the current random accumulator $\entropyaccumulator'$ and the block's timeslot. Thus, within a service's accumulation it is almost certainly unique, but it is not necessarily unique across all services, nor at all times in the past. We utilize a *check* function to find the first such index in this sequence which does not already represent a service: $$
  \text{check}(i \in \serviceid) \equiv \begin{cases}
    i &\when i \not\in \keys{\aoNpoststate_\psNaccounts} \\
    \text{check}((i - \Cminpublicindex + 1) \bmod (2^{32}-2^8-\Cminpublicindex) + \Cminpublicindex)&\otherwise
  \end{cases}$$

n.b. In the highly unlikely event that a block executes to find that a single service index has inadvertently been attached to two different services, then the block is considered invalid. Since no service can predict the identifier sequence ahead of time, they cannot intentionally disadvantage the block author.
