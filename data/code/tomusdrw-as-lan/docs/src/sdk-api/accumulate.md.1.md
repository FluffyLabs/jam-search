---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/docs/src/sdk-api/accumulate.md#L106-L172
title: docs/src/sdk-api/accumulate.md
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 547e2e0b00f746f6a8a2a140c47d6cd9a1ef72c16d8c471a1e767135a92a8ddc
language: markdown
---
`docs/src/sdk-api/accumulate.md` (lines 106–172)

```markdown
| `Unavailable` | `slot0`, `slot1` | Was available, now removed |
| `Reavailable` | `slot0`, `slot1`, `slot2` | Removed then re-added |

## Admin (Privileged Governance)

High-level wrappers for ecallis 14-16 (`bless`, `assign`, `designate`). Only
callable by privileged services (manager, delegator, registrar, core assigners).

```typescript
const admin = ctx.admin();

// Full bless — only the manager can set all fields
admin.bless(
  managerServiceId,
  [assigner1, assigner2],       // one ServiceId per core
  delegatorServiceId,
  registrarServiceId,
  [AutoAccumulateEntry.create(100, 5000)],
);  // ResultN<bool, BlessError>

// Partial bless — delegator/registrar can transfer their own role
admin.blessDelegator(newDelegatorId);   // ResultN<bool, BlessError>
admin.blessRegistrar(newRegistrarId);   // ResultN<bool, BlessError>

// Assign auth queue for a core (only that core's assigner)
admin.assign(coreIndex, [codeHash1, codeHash2]);  // ResultN<bool, AssignError>

// Transfer assigner permission to another service
admin.assign(coreIndex, authQueue, newAssignerServiceId);

// Designate next epoch validators
const key = ValidatorKey.create(ed25519, bandersnatch, bls, metadata);
admin.designate([key]);  // ResultN<bool, DesignateError>
```

## Child Services

Create and eject child services (ecallis 18, 21).

```typescript
const cs = ctx.childServices();

// Create a child service
const result = cs.newChild(codeHash, codeLen, gas, allowance);
// ResultN<ServiceId, NewChildError>
if (result.isOkay) {
  const childId = result.okay;  // the new ServiceId
}

// Eject a child service (it must have called requestEjection first)
cs.ejectChild(childServiceId, prevCodeHash);  // ResultN<bool, EjectChildError>
```

## Self-Service

Upgrade the current service's code or request ejection (ecalli 19).

```typescript
const self = ctx.selfService();

// Upgrade to new code (ensure preimage is available first!)
self.upgradeCode(newCodeHash, minGas, allowance);

// Request ejection by a parent service
// WARNING: clear all storage before calling this!
self.requestEjection(parentServiceId);
```
```
