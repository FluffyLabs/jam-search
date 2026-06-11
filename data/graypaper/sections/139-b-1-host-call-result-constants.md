---
type: graypaper_section
title: B.1 Host-Call Result Constants
index: 139
---
$\mathtt{NONE} = 2^{64} - 1$

:   The return value indicating an item does not exist.

$\mathtt{WHAT} = 2^{64} - 2$

:   Name unknown.

$\mathtt{OOB} = 2^{64} - 3$

:   The inner PVM memory index provided for reading/writing is not accessible.

$\mathtt{WHO} = 2^{64} - 4$

:   Index unknown.

$\mathtt{FULL} = 2^{64} - 5$

:   Storage full or resource already allocated.

$\mathtt{CORE} = 2^{64} - 6$

:   Core index unknown.

$\mathtt{CASH} = 2^{64} - 7$

:   Insufficient funds.

$\mathtt{LOW} = 2^{64} - 8$

:   Gas limit too low.

$\mathtt{HUH} = 2^{64} - 9$

:   The operation is invalid. For example, the item is already solicited, cannot be forgotten, or the service is insufficiently privileged.

$\mathtt{OK} = 0$

:   The return value indicating general success.

Inner PVM invocations have their own set of result codes:

$\mathtt{HALT} = 0$

:   The invocation completed and halted normally.

$\mathtt{PANIC} = 1$

:   The invocation completed with a panic.

$\mathtt{FAULT} = 2$

:   The invocation completed with a page fault.

$\mathtt{HOST} = 3$

:   The invocation completed with a host-call fault.

$\mathtt{OOG} = 4$

:   The invocation completed by running out of gas.

Note return codes for a host-call-request exit are any non-zero value less than $2^{64} - 13$.
