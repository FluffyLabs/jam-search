---
type: graypaper_section
title: 7 Recent History
index: 52
---
We retain in state information on the most recent $\Crecenthistorylen$ blocks. This is used to preclude the possibility of duplicate or out of date work-reports from being submitted. $$\begin{aligned}
  
  \recent &\equiv \tup{\recenthistory, \accoutbelt}\\
  
  \recenthistory &\in \sequence[:\Crecenthistorylen]{\tuple{
    \isa{\rhNheaderhash}{\hash},
    \isa{\rhNstateroot}{\hash},
    \isa{\rhNaccoutlogsuperpeak}{\hash},
    \isa{\rhNtimeslot}{\timeslot},
    \isa{\rhNreportedpackagehashes}{\dictionary{\hash}{\hash}}
  }}\\
  
  \accoutbelt &\in \sequence{\optional{\hash}} \\
  
  \lastaccout &\in \sequence{\tup{\serviceid, \hash}}\end{aligned}$$

For each recent block, we retain its header hash, its state root, its accumulation-result MMB and the corresponding work-package hashes of each item reported (which is no more than the total number of cores, $\Ccorecount = 341$).

During the accumulation stage, a value with the partial transition of this state is provided which contains the correction for the newly-known state-root of the parent block: $$
  \recenthistorypostparentstaterootupdate \equiv \recenthistory\quad\exc\quad\recenthistorypostparentstaterootupdate\subb{\len{\recenthistory} - 1}_\rhNstateroot = \H_\Npriorstateroot$$

We define the new Accumulation Output Log $\accoutbelt$. This is formed from the block's accumulation-output sequence $\lastaccout'$ (defined in section 12), taking its root using the basic binary Merklization function ($\fnmerklizewb$, defined in appendix 28) and appending it to the previous log value with the MMB append function (defined in appendix 28.2). Throughout, the Keccak hash function is used to maximize compatibility with legacy systems: $$\begin{aligned}
  \using \mathbf{s} &= \sq{\build{\encode[4]{s} \concat \encode{h}}{\tup{s, h} \orderedin \lastaccout'}}\\
  
  \accoutbelt' &\equiv \mmrappend{\accoutbelt, \merklizewb{\mathbf{s}, \fnkeccak}, \fnkeccak}\end{aligned}$$

The final state transition for $\recenthistory$ appends a new item including the new block's header hash, a Merkle commitment to the block's Accumulation Output Log and the set of work-reports made into it (for which we use the guarantees extrinsic, $\xtguarantees$). Formally: $$
  \begin{aligned}
    \recenthistory' &\equiv {\overleftarrow{\recenthistorypostparentstaterootupdate \append \tup{
      \is{\rhNheaderhash}{\blake{\theheader}},
      \is{\rhNstateroot}{\zerohash},
      \is{\rhNaccoutlogsuperpeak}{\mmrsuperpeak{\accoutbelt'}},
      \is{\rhNtimeslot}{\H_\Ntimeslot},
      \rhNreportedpackagehashes
      }}}^\Crecenthistorylen \\
    \where \rhNreportedpackagehashes &= \set{\build{
        \kv{
          ((g_\gNworkreport)_\wrNavspec)_\asNpackagehash
        }{
          ((g_\gNworkreport)_\wrNavspec)_\asNsegroot
        }
      }{
        g \in \xtguarantees
      }}
  \end{aligned}$$

The new state-trie root is the zero hash, $\zerohash$, which is inaccurate but safe since $\recent'$ is not utilized except to define the next block's $\recentpostparentstaterootupdate$, which contains a corrected value for this, as per equation [eq:correctlaststateroot].
