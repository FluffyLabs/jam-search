---
type: graypaper_section
title: B.1. Host-Call Result Constants
index: 108
---
NONE = 2 64 − 1 : The return value indicating an item does not exist. WHAT = 2 64 − 2 : Name unknown. OOB = 2 64 − 3 : The inner pvm memory index provided for reading/writing is not accessible. WHO = 2 64 − 4 : Index unknown. FULL = 2 64 − 5 : Storage full. CORE = 2 64 − 6 : Core index unknown. CASH = 2 64 − 7 : Insufficient funds. LOW = 2 64 − 8 : Gas limit too low. HUH = 2 64 − 9 : The item is already solicited or cannot be forgotten. OK = 0 : The return value indicating general success. Inner pvm invocations have their own set of result codes: HALT = 0 : The invocation completed and halted normally. PANIC = 1 : The invocation completed with a panic. FAULT = 2 : The invocation completed with a page fault. HOST = 3 : The invocation completed with a host-call fault. OOG = 4 : The invocation completed by running out of gas. Note return codes for a host-call-request exit are any non-zero value less than 2 64 − 13. JAM: JOIN-ACCUMULATE MACHINE DRAFT 0.6.6 - May 5, 2025 46
