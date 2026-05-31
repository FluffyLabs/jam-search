---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/utils.ts#L1-L47
title: packages/jam/jam-host-calls/utils.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 7138082ee027acb149d938b90350b7cdb5f2bd2f5b2f100da9964126fd96a667
language: typescript
---
`packages/jam/jam-host-calls/utils.ts` (lines 1–47)

```typescript
import { type ServiceId, tryAsServiceId } from "@typeberry/block";
import { tryAsU32, tryAsU64, type U32, type U64, u32AsLeBytes, u64IntoParts } from "@typeberry/numbers";
import type { HostCallRegisters } from "@typeberry/pvm-host-calls";
import { NO_OF_REGISTERS, REGISTER_BYTE_SIZE } from "@typeberry/pvm-interface";
import { check, safeAllocUint8Array } from "@typeberry/utils";

const MAX_U32 = tryAsU32(2 ** 32 - 1);
const MAX_U32_BIG_INT = tryAsU64(MAX_U32);
export const SERVICE_ID_BYTES = 4;
export const CURRENT_SERVICE_ID = tryAsServiceId(2 ** 32 - 1);

export function getServiceIdOrCurrent(
  regNumber: number,
  regs: HostCallRegisters,
  currentServiceId: ServiceId,
): ServiceId | null {
  const regValue = regs.get(regNumber);
  if (regValue === 2n ** 64n - 1n) {
    return currentServiceId;
  }

  return getServiceId(regValue);
}

export function getServiceId(serviceId: U64): ServiceId | null {
  const { lower, upper } = u64IntoParts(serviceId);

  if (upper === 0) {
    return tryAsServiceId(lower);
  }

  return null;
}

export function writeServiceIdAsLeBytes(serviceId: ServiceId, destination: Uint8Array) {
  check`${destination.length >= SERVICE_ID_BYTES} Not enough space in the destination.`;
  destination.set(u32AsLeBytes(serviceId));
}

/** Clamp a U64 to the maximum value of a 32-bit unsigned integer. */
export function clampU64ToU32(value: U64): U32 {
  return value > MAX_U32_BIG_INT ? MAX_U32 : tryAsU32(Number(value));
}

export function emptyRegistersBuffer(): Uint8Array {
  return safeAllocUint8Array(NO_OF_REGISTERS * REGISTER_BYTE_SIZE);
}
```
