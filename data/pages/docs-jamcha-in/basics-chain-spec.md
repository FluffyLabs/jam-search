---
type: page
url: 'https://docs.jamcha.in/basics/chain-spec'
title: Chain Spec | JAM Docs
site: docs.jamcha.in
created_at: '2026-06-09T04:23:02.116Z'
last_modified: '2026-06-09T04:23:02.116Z'
---
The Chain Specification is a configuration that defines all core constants of the JAM Chain. The JAM Chain itself has fixed parameters, but for testing and local deployments it can be useful to define alternative versions of these parameters.

Please consult a few other JAM implementer teams before changing these values, as it is in use for testnet setup and by W3F test vectors.

## Parameters[​](#parameters "Direct link to Parameters")

Each chain spec must define the following parameters. All other values are assumed to be set to the values of the Graypaper.

### chain[​](#chain "Direct link to chain")

The name of the spec.

### V `num_validators`[​](#v-num_validators "Direct link to v-num_validators")

The number of validators.

### C `num_cores`[​](#c-num_cores "Direct link to c-num_cores")

The number of cores.

### D `preimage_expunge_period`[​](#d-preimage_expunge_period "Direct link to d-preimage_expunge_period")

The period in timeslots after which an unreferenced preimage may be expunged.

### P `slot_duration`[​](#p-slot_duration "Direct link to p-slot_duration")

Slot time duration in seconds.

### E `epoch_duration`[​](#e-epoch_duration "Direct link to e-epoch_duration")

The number of slots in an epoch.

### Y `contest_duration`[​](#y-contest_duration "Direct link to y-contest_duration")

The epoch in which the ticket contest ends.  
Constraint: Y\>0∧Y<E\\mathsf{Y} > 0 \\land \\mathsf{Y} < \\mathsf{E}Y\>0∧Y<E

### N `tickets_per_validator`[​](#n-tickets_per_validator "Direct link to n-tickets_per_validator")

The maximum number of tickets each validator can submit. This must be configurable to ensure that a 2/3+1 majority of validators can still finish the ticket contest successfully.  
Constraint: (2∗V3+1)∗N\>\=E(\\frac{2\*\\mathsf{V}}{3} + 1) \* \\mathsf{N} >= \\mathsf{E}(32∗V​+1)∗N\>=E

### R `rotation_period`[​](#r-rotation_period "Direct link to r-rotation_period")

The rotation period of validator-core assignments, in timeslots.

### K `max_tickets_per_extrinsic`[​](#k-max_tickets_per_extrinsic "Direct link to k-max_tickets_per_extrinsic")

The maximum number of tickets which may be submitted in a single extrinsic.  
Constraint: K\>0\\mathsf{K} > 0K\>0

### WP `num_ec_pieces_per_segment`[​](#wp-num_ec_pieces_per_segment "Direct link to wp-num_ec_pieces_per_segment")

The number of erasure-coded pieces in a segment

### G\_T `max_block_gas`[​](#g_t-max_block_gas "Direct link to g_t-max_block_gas")

The total gas allocated across for **all** Accumulation.

### G\_R `max_refine_gas`[​](#g_r-max_refine_gas "Direct link to g_r-max_refine_gas")

The gas allocated to invoke a work-package's Refine logic

*   [Parameters](#parameters)
    *   [chain](#chain)
    *   [V `num_validators`](#v-num_validators)
    *   [C `num_cores`](#c-num_cores)
    *   [D `preimage_expunge_period`](#d-preimage_expunge_period)
    *   [P `slot_duration`](#p-slot_duration)
    *   [E `epoch_duration`](#e-epoch_duration)
    *   [Y `contest_duration`](#y-contest_duration)
    *   [N `tickets_per_validator`](#n-tickets_per_validator)
    *   [R `rotation_period`](#r-rotation_period)
    *   [K `max_tickets_per_extrinsic`](#k-max_tickets_per_extrinsic)
    *   [WP `num_ec_pieces_per_segment`](#wp-num_ec_pieces_per_segment)
    *   [G\_T `max_block_gas`](#g_t-max_block_gas)
    *   [G\_R `max_refine_gas`](#g_r-max_refine_gas)
