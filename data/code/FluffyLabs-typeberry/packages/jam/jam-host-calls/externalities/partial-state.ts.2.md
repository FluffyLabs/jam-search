---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/externalities/partial-state.ts#L248-L280
title: packages/jam/jam-host-calls/externalities/partial-state.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 2
chunk_total: 3
content_sha: f632e07e2b7872ff9b6cdd46b5ff77b2e56188850a8fd0e40310255d05399820
language: typescript
---
`packages/jam/jam-host-calls/externalities/partial-state.ts` (lines 248–280)

```typescript
  checkpoint(): void;

  /** Update authorization queue for given core and authorize a service for this core. */
  updateAuthorizationQueue(
    coreIndex: CoreIndex,
    authQueue: AuthorizationQueue,
    assigner: ServiceId | null,
  ): Result<OK, UpdatePrivilegesError>;

  /**
   * Update priviliged services and their gas.
   *
   * `m`: manager service (can change privileged services)
   * `a`: per-core manager of authorization queue
   * `v`: manages validator keys
   * `r`: manages create new services in protected id range.
   * `z`: collection of serviceId -> gas that auto-accumulate every block
   *
   */
  updatePrivilegedServices(
    m: ServiceId | null,
    a: PerCore<ServiceId>,
    v: ServiceId | null,
    r: ServiceId | null,
    z: Map<ServiceId, ServiceGas>,
  ): Result<OK, UpdatePrivilegesError>;

  /** Yield accumulation trie result hash. */
  yield(hash: OpaqueHash): void;

  /** Provide a preimage for given service. */
  providePreimage(service: ServiceId | null, preimage: BytesBlob): Result<OK, ProvidePreimageError>;
}
```
