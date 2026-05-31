---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/disputes/disputes.test.data.ts#L85-L204
title: packages/jam/transition/disputes/disputes.test.data.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 088111a0b36cfb36454b6afe5f7cf77cdcf4417f395edc3c22988f7b131398ac
language: typescript
---
`packages/jam/transition/disputes/disputes.test.data.ts` (lines 85–204)

```typescript
export const verdicts = [
  {
    target: "0x11da6d1f761ddf9bdb4c9d6e5303ebd41f61858d0a5647a1a7bfe089bf921be9",
    age: 0,
    votes: [
      {
        vote: true,
        index: 0,
        signature:
          "0x0b1e29dbda5e3bba5dde21c81a8178b115ebf0cf5920fe1a38e897ecadd91718e34bf01c9fc7fdd0df31d83020231b6e8338c8dc204b618cbde16a03cb269d05",
      },
      {
        vote: true,
        index: 1,
        signature:
          "0x0d44746706e09ff6b6f2929e736c2f868a4d17939af6d37ca7d3c7f6d4914bd095a6fd4ff48c320b673e2de92bfdb5ed9f5c0c40749816ab4171a2272386fc05",
      },
      {
        vote: true,
        index: 2,
        signature:
          "0x0d5d39f2239b775b22aff53b74a0d708a9b9363ed5017170f0abebc8ffd97fc1cc3cf597c578b555ad5abab26e09ecda727c2909feae99587c6354b86e4cc50c",
      },
      {
        vote: true,
        index: 3,
        signature:
          "0x701d277fa78993b343a5d4367f1c2a2fb7ddb77f0246bf9028196feccbb7c0f2bd994966b3e9b1e51ff5dd63d8aa5e2331432b9cca4a125552c4700d51814a04",
      },
      {
        vote: true,
        index: 4,
        signature:
          "0x08d96d2e49546931dc3de989a69aa0ae3547d67a038bdaa84f7e549da8318d48aab72b4b30ecc0c588696305fce3e2c4657f409463f6a05c52bf641f2684460f",
      },
    ],
  },
  {
    target: "0x7b0aa1735e5ba58d3236316c671fe4f00ed366ee72417c9ed02a53a8019e85b8",
    age: 0,
    votes: [
      {
        vote: false,
        index: 0,
        signature:
          "0xd76bba06ffb8042bedce3f598e22423660e64f2108566cbd548f6d2c42b1a39607a214bddfa7ccccf83fe993728a58393c64283b8a9ab8f3dff49cbc3cc2350e",
      },
      {
        vote: false,
        index: 1,
        signature:
          "0x77edbe63b2cfab4bda9227bc9fcc8ac4aa8157616c3d8dff9f90fe88cc998fef871a57bbc43eaa1bdee241a1f903ffb42e39a4207c0752d9352f7d98835eda0a",
      },
      {
        vote: false,
        index: 2,
        signature:
          "0x1843d18350a8ddee1502bc47cbd1dd30a3354f24bf7e095ad848e8f0744afc4b04a224b5b2143297d571309799c3c0a17f1b7d7782aaeb8f4991cf5dd749310b",
      },
      {
        vote: false,
        index: 3,
        signature:
          "0x561bab9479abe38ed5d9609e92145fa689995ef2b71e94577a60eee6177663e8fd1f5bacd1f1afdadce1ea48598ad10a0893e733c34ab6f4aa821b0fdbdf0201",
      },
      {
        vote: false,
        index: 4,
        signature:
          "0xb579159c1ab983583ed8d95bf8632ac7d3be51bdff3d5221258105b801782a5146e08247c269c7bcec10bec76c7d648704e7e6bf3ace77951e828f23894b500c",
      },
    ],
  },
].map(createVerdict);

export const verdictsWithIncorrectValidatorIndex = [
  {
    target: "0x11da6d1f761ddf9bdb4c9d6e5303ebd41f61858d0a5647a1a7bfe089bf921be9",
    age: 0,
    votes: [
      {
        vote: true,
        index: 65000,
        signature:
          "0x0b1e29dbda5e3bba5dde21c81a8178b115ebf0cf5920fe1a38e897ecadd91718e34bf01c9fc7fdd0df31d83020231b6e8338c8dc204b618cbde16a03cb269d05",
      },
      {
        vote: true,
        index: 1,
        signature:
          "0x0d44746706e09ff6b6f2929e736c2f868a4d17939af6d37ca7d3c7f6d4914bd095a6fd4ff48c320b673e2de92bfdb5ed9f5c0c40749816ab4171a2272386fc05",
      },
      {
        vote: true,
        index: 2,
        signature:
          "0x0d5d39f2239b775b22aff53b74a0d708a9b9363ed5017170f0abebc8ffd97fc1cc3cf597c578b555ad5abab26e09ecda727c2909feae99587c6354b86e4cc50c",
      },
      {
        vote: true,
        index: 3,
        signature:
          "0x701d277fa78993b343a5d4367f1c2a2fb7ddb77f0246bf9028196feccbb7c0f2bd994966b3e9b1e51ff5dd63d8aa5e2331432b9cca4a125552c4700d51814a04",
      },
      {
        vote: true,
        index: 4,
        signature:
          "0x08d96d2e49546931dc3de989a69aa0ae3547d67a038bdaa84f7e549da8318d48aab72b4b30ecc0c588696305fce3e2c4657f409463f6a05c52bf641f2684460f",
      },
    ],
  },
].map(createVerdict);

export const faults = [
  {
    target: "0x11da6d1f761ddf9bdb4c9d6e5303ebd41f61858d0a5647a1a7bfe089bf921be9",
    vote: false,
    key: "0x3b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da29",
    signature:
```
