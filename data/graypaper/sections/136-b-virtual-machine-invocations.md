---
type: graypaper_section
title: B Virtual Machine Invocations
index: 136
---
We now define the three practical instances where we wish to invoke a PVM instance as part of the protocol. In general, we avoid introducing unbounded data as part of the basic invocation arguments in order to minimize the chance of an unexpectedly large RAM allocation, which could lead to gas inflation and unavoidable underflow. This makes for a more cumbersome interface, but one which is more predictable and easier to reason about.
