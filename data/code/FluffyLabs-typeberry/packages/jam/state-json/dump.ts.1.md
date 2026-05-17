---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-json/dump.ts#L98-L167
title: packages/jam/state-json/dump.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 1
chunk_total: 2
content_sha: a6ca40f203c1cebb2c039f4fad737184cdd8f721a37c67bf7ce7d1aaa18a113c
language: typescript
---
`packages/jam/state-json/dump.ts` (lines 98–167)

```typescript
      accounts: json.array(JsonServicePre072.fromJson),
    },
    ({
      alpha,
      varphi,
      beta,
      gamma,
      psi,
      eta,
      iota,
      kappa,
      lambda,
      rho,
      tau,
      chi,
      pi,
      omega,
      xi,
      theta,
      accounts,
    }): InMemoryState => {
      return InMemoryState.new(spec, {
        authPools: tryAsPerCore(
          alpha.map((perCore) => {
            if (perCore.length > MAX_AUTH_POOL_SIZE) {
              throw new Error(`AuthPools: expected less than ${MAX_AUTH_POOL_SIZE}, got ${perCore.length}`);
            }
            return asKnownSize(perCore);
          }),
          spec,
        ),
        authQueues: tryAsPerCore(
          varphi.map((perCore) => {
            if (perCore.length !== AUTHORIZATION_QUEUE_SIZE) {
              throw new Error(`AuthQueues: expected ${AUTHORIZATION_QUEUE_SIZE}, got: ${perCore.length}`);
            }
            return asKnownSize(perCore);
          }),
          spec,
        ),
        recentBlocks: beta ?? RecentBlocks.empty(),
        nextValidatorData: gamma.gamma_k,
        epochRoot: gamma.gamma_z,
        sealingKeySeries: TicketsOrKeys.toSafroleSealingKeys(gamma.gamma_s, spec),
        ticketsAccumulator: gamma.gamma_a,
        disputesRecords: psi,
        entropy: eta,
        designatedValidatorData: iota,
        currentValidatorData: kappa,
        previousValidatorData: lambda,
        availabilityAssignment: rho,
        timeslot: tau,
        privilegedServices: PrivilegedServices.create({
          manager: chi.chi_m,
          assigners: chi.chi_a,
          delegator: chi.chi_v,
          registrar: chi.chi_r,
          autoAccumulateServices: chi.chi_g ?? new Map(),
        }),
        statistics: JsonStatisticsData.toStatisticsData(spec, pi),
        accumulationQueue: omega,
        recentlyAccumulated: tryAsPerEpochBlock(
          xi.map((x) => HashSet.from(x)),
          spec,
        ),
        accumulationOutputLog: SortedArray.fromArray(accumulationOutputComparator, theta ?? []),
        services: new Map(accounts.map((x) => [x.serviceId, x])),
      });
    },
  );
```
