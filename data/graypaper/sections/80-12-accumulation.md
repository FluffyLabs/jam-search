---
type: graypaper_section
title: 12 Accumulation
index: 80
---
Accumulation may be defined as some function whose arguments are $\justbecameavailable$ and $\accounts$ together with selected portions of (at times partially transitioned) state and which yields the posterior service state $\accountspostpreimage$ together with additional state elements $\stagingset'$, $\authqueue'$ and $\privileges'$.

The proposition of accumulation is in fact quite simple: we merely wish to execute the *Accumulate* logic of the service code of each of the services which has at least one work-digest, passing to it relevant data from said digests together with useful contextual information. However, there are three main complications. Firstly, we must define the execution environment of this logic and in particular the host functions available to it. Secondly, we must define the amount of gas to be allowed for each service's execution. Finally, we must determine the nature of transfers within Accumulate.
