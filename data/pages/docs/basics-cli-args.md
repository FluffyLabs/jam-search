---
type: page
url: 'https://docs.jamcha.in/basics/cli-args'
title: CLI Arguments | JAM Docs
site: docs.jamcha.in
created_at: '2025-05-26T09:22:35.065Z'
last_modified: '2025-09-02T22:02:07.304Z'
---
These command line arguments should be understood by all JAM nodes to make testnet setup easy. If implementors want to deviate from their meaning or syntax, they should provide either a compatibility wrapper binary or a `testnet` subcommand on which these arguments work.

## Arguments [​](https://docs.jamcha.in/basics/cli-args\#arguments "Direct link to Arguments")

### `--bandersnatch hex` [​](https://docs.jamcha.in/basics/cli-args\#--bandersnatch-hex "Direct link to --bandersnatch-hex")

Bandersnatch Seed (only for development).

### `--bls hex` [​](https://docs.jamcha.in/basics/cli-args\#--bls-hex "Direct link to --bls-hex")

BLS Seed (only for development).

### `--datadir path` [​](https://docs.jamcha.in/basics/cli-args\#--datadir-path "Direct link to --datadir-path")

Specifies the directory for the blockchain, keystore, and other data.

### `--ed25519 hex` [​](https://docs.jamcha.in/basics/cli-args\#--ed25519-hex "Direct link to --ed25519-hex")

Ed25519 Seed (only for development).

### `--genesis path` [​](https://docs.jamcha.in/basics/cli-args\#--genesis-path "Direct link to --genesis-path")

Specifies the genesis state json file.

### `--metadata string` [​](https://docs.jamcha.in/basics/cli-args\#--metadata-string "Direct link to --metadata-string")

Node metadata (default "Alice").

### `--port int` [​](https://docs.jamcha.in/basics/cli-args\#--port-int "Direct link to --port-int")

Specifies the network listening port (default 9900).

### `--ts int` [​](https://docs.jamcha.in/basics/cli-args\#--ts-int "Direct link to --ts-int")

Epoch0 Unix timestamp (will override genesis config).

### `--validatorindex int` [​](https://docs.jamcha.in/basics/cli-args\#--validatorindex-int "Direct link to --validatorindex-int")

Validator Index (only for development).

## Value Types [​](https://docs.jamcha.in/basics/cli-args\#value-types "Direct link to Value Types")

### `hex` [​](https://docs.jamcha.in/basics/cli-args\#hex "Direct link to hex")

Mixed-case hex string with possible `0x` prefix.

### `path` [​](https://docs.jamcha.in/basics/cli-args\#path "Direct link to path")

Relative or absolute file path according to the OS of being run on.

- [Arguments](https://docs.jamcha.in/basics/cli-args#arguments)
  - [`--bandersnatch hex`](https://docs.jamcha.in/basics/cli-args#--bandersnatch-hex)
  - [`--bls hex`](https://docs.jamcha.in/basics/cli-args#--bls-hex)
  - [`--datadir path`](https://docs.jamcha.in/basics/cli-args#--datadir-path)
  - [`--ed25519 hex`](https://docs.jamcha.in/basics/cli-args#--ed25519-hex)
  - [`--genesis path`](https://docs.jamcha.in/basics/cli-args#--genesis-path)
  - [`--metadata string`](https://docs.jamcha.in/basics/cli-args#--metadata-string)
  - [`--port int`](https://docs.jamcha.in/basics/cli-args#--port-int)
  - [`--ts int`](https://docs.jamcha.in/basics/cli-args#--ts-int)
  - [`--validatorindex int`](https://docs.jamcha.in/basics/cli-args#--validatorindex-int)
- [Value Types](https://docs.jamcha.in/basics/cli-args#value-types)
  - [`hex`](https://docs.jamcha.in/basics/cli-args#hex)
  - [`path`](https://docs.jamcha.in/basics/cli-args#path)
