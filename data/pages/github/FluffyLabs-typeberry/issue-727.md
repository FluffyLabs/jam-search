---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/727'
title: Config files merging
site: github.com/FluffyLabs/typeberry
created_at: '2025-10-17T11:11:21.000Z'
last_modified: '2025-10-17T11:11:21.000Z'
content_kind: issue
---

# Config files merging

## Issue by @tomusdrw

Related: #461 

It should be possible to override parts of the config file by merging it with another (partial) config file.

Example (`typeberry-dev.json`).
```json
{
  "$schema": "https://fluffylabs.dev/typeberry/schemas/config-v1.schema.json",
  "version": 1,
  "flavor": "tiny",
  "authorship": {
    "omit_seal_verification": true
  },
  "chain_spec": {
    "id": "typeberry-dev",
    "bootnodes": ["eyonydqt7gj7bjdek62lwdeuxdzr5q7nmxa2p5zwwtoijgamdnkka@127.0.0.1:12345"],
    "genesis_header":  "",
    { ✂︎ omitted for brevity }
  }
}
```
Bootnodes override (`bootnodes.json`)
```json
{
  "$schema": "https://fluffylabs.dev/typeberry/schemas/config-v1-partial.schema.json",
  "chain_spec": {
    "bootnodes": []
  }
}
```

Loading typeberry:
```
npm start -- --config=./typeberry-dev.json --config=bootnodes.json
```

We should start off with some default config, and then each `--config` CLI option adds on top of it.

Note it's a bit simplified (in usage) version of #461, where we don't need to specify in `bootnodes.json` file that it extends the `typeberry-dev.json` file, yet we create the merged config in-flight while running the CLI.



## Comment by @tomusdrw

Additional interesting possibility would be to inject partial configs in a specific place during merge, something like this:

`bootnodes.json`
```json
{
   "bootnodes": []
}
```

And loading
```
npm start -- --config=./typeberry-dev.json --config="chain_spec+=./bootnodes.json"
```

This would be especially cool, because that would allow us to keep JIP-4 chainspec files separate from our config files, and just inject them in the right place.

We could also allow overriding some config options without the need to create separate json files, like so
```
// change the database path by providing inline JSON
$ npm start -- --config=./typeberry-dev.json --config='{"database": "./xyz"}'
// change the database path by overriding one property
$ npm start -- --config=./typeberry-dev.json --config='database="./xyz"'

// Alter bootnodes (mix of override & inline JSON)
$ npm start -- --config=./typeberry-dev.json --config='chain_spec+={"bootnodes": [] }'
```

The API could simply mirror what `jq` does. We also don't want to overengineer this, since creating a JSON config in-flight with `jq` might be much more desired than inventing our own syntax and creating a parser.

The goal is basically to make the CLI surface as small as possible and have the node simply accept `config` object with all needed options, but at the same time being friendly to the user and enable some need quick overrides (i.e. changing JIP-4 chainspec, changing db path, etc) without the need of creating separate config files for everything and duplicating options.

