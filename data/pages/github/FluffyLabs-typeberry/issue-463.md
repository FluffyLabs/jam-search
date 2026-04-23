---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/463'
title: Refactor `Jip4ChainSpec`
site: github.com/FluffyLabs/typeberry
created_at: '2025-07-07T15:37:33.000Z'
last_modified: '2025-07-07T15:37:33.000Z'
content_kind: issue
---

# Refactor `Jip4ChainSpec`

## Issue by @tomusdrw

- [ ] Rename `Jip4ChainSpec` to just `Chainspec` (as it is called in JIP-4 spec)
- [ ] Rename current `ChainSpec` into `ProtocolParameters`
- [ ] Read `protocol_parameters` from the `Jip4ChainSpec`
- [ ] Update `fetch` to return the parameters from `ProtocolParameters` directly.
- [ ] Rename `KnownChainSpec` to `Flavor` (i.e. `tiny`, or `full`).
- [ ] Open PR to jamcha.in/docs to propose updated naming as well.
