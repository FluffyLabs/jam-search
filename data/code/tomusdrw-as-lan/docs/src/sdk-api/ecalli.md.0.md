---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/docs/src/sdk-api/ecalli.md#L1-L52'
title: docs/src/sdk-api/ecalli.md
site: github.com/tomusdrw/as-lan
created_at: '2026-07-15T12:15:02+02:00'
last_modified: '2026-07-15T12:15:02+02:00'
chunk_index: 0
chunk_total: 1
content_sha: db3c1ebc1fcbbe254ddaabcc8464fadd9e43317981c0e7cfca7d6574e2a78a5e
language: markdown
---
`docs/src/sdk-api/ecalli.md` (lines 1–52)

```markdown
# Host Calls (ecalli)

Declared host functions available to services. Import from `"@fluffylabs/as-lan"` or
from a specific group (`"@fluffylabs/as-lan/ecalli/general"`, `.../refine`, `.../accumulate`).

## General (available in all contexts)

| ID | Function | Description |
|----|----------|-------------|
| 0 | `gas()` | Returns remaining gas |
| 1 | `fetch(dest_ptr, offset, length, kind, param1, param2)` | Fetch context data |
| 2 | `lookup(service, hash_ptr, out_ptr, offset, length)` | Look up preimage by hash |
| 3 | `read(service, key_ptr, key_len, out_ptr, offset, length)` | Read from storage |
| 4 | `write(key_ptr, key_len, value_ptr, value_len)` | Write to storage |
| 5 | `info(service, out_ptr, offset, length)` | Get service account info |
| 100 | `log(level, target_ptr, target_len, msg_ptr, msg_len)` | JIP-1 debug log (prefer `Logger`) |

## Refine (available during refinement)

| ID | Function | Description |
|----|----------|-------------|
| 6 | `historical_lookup(service, hash_ptr, out_ptr, offset, length)` | Historical preimage lookup |
| 7 | `export_segment(segment_ptr, segment_len)` | Export a data segment |
| 8 | `machine(code_ptr, code_len, entrypoint)` | Create inner PVM machine |
| 9 | `peek(machine_id, dest_ptr, source, length)` | Read inner machine memory |
| 10 | `poke(machine_id, source_ptr, dest, length)` | Write inner machine memory |
| 11 | `pages(machine_id, start_page, page_count, access_type)` | Set inner machine page access |
| 12 | `invoke(machine_id, io_ptr, out_r8)` | Run inner machine (r7=exit reason, r8 written to out\_r8) |
| 13 | `expunge(machine_id)` | Destroy inner machine |

## Accumulate (available during accumulation)

| ID | Function | Description |
|----|----------|-------------|
| 14 | `bless(manager, auth_queue_ptr, delegator, registrar, auto_accum_ptr, count)` | Set privileged config |
| 15 | `assign(core, auth_queue_ptr, assigners)` | Assign core |
| 16 | `designate(validators_ptr)` | Set next epoch validators |
| 17 | `checkpoint()` | Commit state, return remaining gas |
| 18 | `new_service(code_hash_ptr, code_len, gas, allowance, gratis_storage, id)` | Create service |
| 19 | `upgrade(code_hash_ptr, gas, allowance)` | Upgrade service code |
| 20 | `transfer(dest, amount, gas_fee, memo_ptr)` | Transfer funds |
| 21 | `eject(service, prev_code_hash_ptr)` | Remove service |
| 22 | `query(hash_ptr, length, out_r8)` | Query preimage status (r8 written to out\_r8) |
| 23 | `solicit(hash_ptr, length)` | Request preimage availability |
| 24 | `forget(hash_ptr, length)` | Cancel preimage solicitation |
| 25 | `yield_result(hash_ptr)` | Provide accumulation result hash |
| 26 | `provide(service, preimage_ptr, preimage_len)` | Supply solicited preimage |

## Error Sentinels

All functions return `i64`. Error sentinels are defined in `EcalliResult`:
`NONE` (-1), `WHAT` (-2), `OOB` (-3), `WHO` (-4), `FULL` (-5), `CORE` (-6), `CASH` (-7), `LOW` (-8), `HUH` (-9).
```
