---
type: graypaper_section
title: 12.1 History and Queuing
index: 81
---
Accumulation of a work-report is deferred in the case that it has a not-yet-fulfilled dependency and is cancelled entirely in the case of an invalid dependency. Dependencies are specified as work-package hashes and in order to know which work-packages have been accumulated already, we maintain a history of what has been accumulated. This history, $\accumulated$, is sufficiently large for an epoch worth of work-reports. Formally: $$\begin{aligned}
  
  \accumulated &\in \sequence[\Cepochlen]{\protoset{\hash}} \\
  \accumulatedcup &\equiv \bigcup_{x \in \accumulated}(x)\end{aligned}$$

We also maintain knowledge of ready (i.e. available and/or audited) but not-yet-accumulated work-reports in the state item $\ready$. Each of these were made available at most one epoch ago but have or had unfulfilled dependencies. Alongside the work-report itself, we retain its unaccumulated dependencies, a set of work-package hashes. Formally: $$\begin{aligned}
  
  \ready &\in \sequence[\Cepochlen]{\sequence{\tuple{\workreport, \protoset{\hash}}}}\end{aligned}$$

The newly available work-reports, $\justbecameavailable$, are partitioned into two sequences based on the condition of having zero prerequisite work-reports. Those meeting the condition, $\justbecameavailable^!$, are accumulated immediately. Those not, $\justbecameavailable^Q$, are for queued execution. Formally: $$\begin{aligned}
  \justbecameavailable^! &\equiv \sq{\build{r}{r \orderedin \justbecameavailable, \len{(r_\wrNcontext)_\wcNprerequisites} = 0 \wedge r_\wrNsrlookup = \emset}} \\
  \justbecameavailable^Q &\equiv E(\sq{
    D(r) \mid
    r \orderedin \justbecameavailable,
    \len{(r_\wrNcontext)_\wcNprerequisites} > 0 \vee r_\wrNsrlookup \ne \emset
  }, \accumulatedcup)\!\!\!\!\\
  D(r) &\equiv (r, \set{(r_\wrNcontext)_\wcNprerequisites} \cup \keys{r_\wrNsrlookup})\end{aligned}$$

We define the queue-editing function $E$, which is essentially a mutator function for items such as those of $\ready$, parameterized by sets of now-accumulated work-package hashes (those in $\accumulated$). It is used to update queues of work-reports when some of them are accumulated. Functionally, it removes all entries whose work-report's hash is in the set provided as a parameter, and removes any dependencies which appear in said set. Formally: $$E\colon\abracegroup{
      &\tuple{\sequence{\tuple{\workreport, \protoset{\hash}}}, \protoset{\hash}} \to \sequence{\tuple{\workreport, \protoset{\hash}}} \\
    &\tup{\mathbf{r}, \mathbf{x}} \mapsto \sq{\build{
      \tup{r, \mathbf{d} \setminus \mathbf{x}}
    }{
      \begin{aligned}
        &\tup{r, \mathbf{d}} \orderedin \mathbf{r} ,\\
        &(r_\wrNavspec)_\asNpackagehash \not\in \mathbf{x}
      \end{aligned}
    }}
  }$$

We further define the accumulation priority queue function $Q$, which provides the sequence of work-reports which are able to be accumulated given a set of not-yet-accumulated work-reports and their dependencies. $$Q\colon\abracegroup{
    &\sequence{\tuple{\workreport, \protoset{\hash}}} \to \workreports \\
    &\mathbf{r} \mapsto \begin{cases}
      \sq{} &\when \mathbf{g} = \sq{} \\
      \mathbf{g} \concat Q(E(\mathbf{r}, P(\mathbf{g})))\!\!\!\! &\otherwise \\
      \multicolumn{2}{l}{\,\where \mathbf{g} = \sq{\build{r}{\tup{r, \emset} \orderedin \mathbf{r}}}}
    \end{cases}
  }$$

Finally, we define the mapping function $P$ which extracts the corresponding work-package hashes from a set of work-reports: $$P\colon\abracegroup{
    \protoset{\workreport} &\to \protoset{\hash}\\
    \mathbf{r} &\mapsto \set{
      \build{(r_\wrNavspec)_\asNpackagehash}{r \in \mathbf{r}}
    }
  }$$

We may now define the sequence of accumulatable work-reports in this block as $\justbecameavailable^*$: $$\begin{aligned}
  \using m &= \H_\Ntimeslot \bmod \Cepochlen\\
  \justbecameavailable^* &\equiv \justbecameavailable^! \concat Q(\mathbf{q}) \\
  \quad\where \mathbf{q} &= E(\concatall{\ready\interval{m}{}} \concat \concatall{\ready\interval{}{m}} \concat \justbecameavailable^Q, P(\justbecameavailable^!))\end{aligned}$$
