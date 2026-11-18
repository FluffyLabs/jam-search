---
type: graypaper_section
title: 9.5 Supervisors
index: 63
---
Each service has a designated *supervisor* $\saNsupervisor$; all non-privileged mutating operations are permitted to be done on a service by its supervisor. Only the supervisor may designate a new supervisor (using the `supervisor` host-call). A service's supervisor may be itself.

In addition to the regular balance of a service $\saNbalance$, there is an additional supervisor balance $\saNsupervisorbalance$. This balance is aggregated with the regular balance when determining data footprint limits for the service, but may only be transferred by the supervisor.

Alongside a service's supervisor $\saNsupervisor$, we record the time slot in which the supervisor was created $\saNsupervisorcreated$. We define the *effective supervisor* of a service to be the designated supervisor $\saNsupervisor$ if this service exists and has the expected creation slot, or the service itself otherwise. The purpose of the creation slot check is to prevent unintentional transfer of power in the case that the supervisor is ejected and a new service is created with the same identifier: the new service will *not* be considered the supervisor despite having the correct identifier, as it will have a newer creation slot. For convenience, given a service accounts dictionary $\mathbf{d}$ and a service identifier $s$, we express the effective supervisor of $s$ as $\effectivesupervisor{\mathbf{d}}{s}$. Formally: $$
  \begin{aligned}
    &\forall \mathbf{d} \in \dictionary{\serviceid}{\serviceaccount}, s \in \keys{\mathbf{d}} : \\
    &\quad\begin{aligned}
      \effectivesupervisor{\mathbf{d}}{s} &\equiv \begin{cases}
        u &\when u \in \keys{\mathbf{d}} \land \mathbf{d}\subb{u}_\saNcreated = d \\
        s &\otherwise
      \end{cases} \\
      &\phantom{{}\equiv{}} \where u = \mathbf{d}\subb{s}_\saNsupervisor \\
      &\phantom{{}\equiv{}} \also d = \mathbf{d}\subb{s}_\saNsupervisorcreated
    \end{aligned}
  \end{aligned}$$
