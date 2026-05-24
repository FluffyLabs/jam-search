---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/state-view.ts#L104-L120
title: packages/jam/state/state-view.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 1
chunk_total: 2
content_sha: eb2d1a24f88f40be680e0094ddccf1b03cd0fa68ebe08cf25087a63519c52ac8
language: typescript
---
`packages/jam/state/state-view.ts` (lines 104–120)

```typescript
   * `ξ xi`: In order to know which work-packages have been
   * accumulated already, we maintain a history of what has
   * been accumulated. This history, ξ, is sufficiently large
   * for an epoch worth of work-reports.
   *
   * https://graypaper.fluffylabs.dev/#/5f542d7/161a00161d00
   */
  recentlyAccumulatedView(): RecentlyAccumulatedView;

  /*
   * `γ gamma`: Safrole data.
   */
  safroleDataView(): SafroleDataView;

  /** Retrieve details about single service. */
  getServiceInfoView(id: ServiceId): ServiceAccountInfoView | null;
};
```
