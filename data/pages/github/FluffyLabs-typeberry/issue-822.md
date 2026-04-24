---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/822'
title: Improve config ovewrite
site: github.com/FluffyLabs/typeberry
created_at: '2025-12-03T22:04:37.000Z'
last_modified: '2025-12-03T22:04:37.000Z'
content_kind: issue
---

# Improve config ovewrite

## Issue by @tomusdrw

Currently it's possible to overwrite some part of the config using the pseudo-jq syntax (introduced in #733).

So I can just load a different chain spec, like so:
```
npm start -- --config=default --config=".chain_spec = ./chain-spec.json"
```

However it's necessary to provide the initial `--config=default` as a base config, otherwise we get a rather cryptic error:
```bash
> NODE_ENV=development tsx ./index.ts --config=.chain_spec = ./chain-spec.json import ./fallback.bin

LOG   [config] 🔧 Loading config
LOG   [config] 🔧 Applying '.chain_spec = ./chain-spec.json'
Error: Unable to parse config: Error: [<root>] Error while parsing the value: Error: [<root>] Unexpected or missing keys: <missing>,"$schema" | <missing>,"authorship" | <missing>,"flavor" | <missing>,"version"
          Data: chain_spec,database_base_path
          Schema: $schema,version,flavor,chain_spec,database_base_path,authorship
```

My proposed solution would be to simply always apply `default` config at the very beginning. However we should make sure that loading another full config will ovewrite the entire config instead of doing a deep merge, so: `--config=default --config=dev` should simply load dev config and not deep merge `default` with `dev` (as it is currently)

CC @skoszuta 
