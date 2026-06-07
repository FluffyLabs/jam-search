---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api-node/host-environment.ts#L91-L113
title: packages/workers/api-node/host-environment.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 55afe192376ad9d3276b7bfb5d9b0fa4a96dbf9487e28a7836a662fd672d9765
language: typescript
---
`packages/workers/api-node/host-environment.ts` (lines 91–113)

```typescript
/** Read the soft RLIMIT_AS (address space, i.e. `ulimit -v`) in bytes, or null if unlimited / unavailable. */
function readAddressSpaceLimit(): number | null {
  if (os.platform() !== "linux") {
    return null;
  }
  try {
    const limits = fs.readFileSync("/proc/self/limits", "utf8");
    const line = limits.split("\n").find((l) => l.startsWith("Max address space"));
    if (line === undefined) {
      return null;
    }
    // Columns are: name (multi-word), soft limit, hard limit, units.
    const soft = line.slice("Max address space".length).trim().split(/\s+/)[0];
    if (soft === undefined || soft === "unlimited") {
      return null;
    }
    const value = Number(soft);
    return Number.isFinite(value) && value > 0 ? value : null;
  } catch {
    // /proc not mounted or unreadable
    return null;
  }
}
```
