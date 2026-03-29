---
type: graypaper_section
title: 12. Accumulation
index: 72
---
Accumulation may be defined as some function whose arguments are W and δ together with selected portions of (at times partially transitioned) state and which yields the posterior service state δ ′ together with additional state elements ι ′, φ ′ and χ ′. The proposition of accumulation is in fact quite simple: we merely wish to execute the Accumulate logic of the service code of each of the services which has at least one work-digest, passing to it relevant data from said digests together with useful contextual information. However, there are three main complications. Firstly, we must define the execution environment of this logic and in particular the host functions available to it. Secondly, we must define the amount of gas to be allowed for each service’s execution. Finally, we must determine the nature of transfers within Accumulate which, as we will see, leads to the need for a second entry-point, on-transfer.
