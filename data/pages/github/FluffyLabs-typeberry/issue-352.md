---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/352'
title: Support chain config JSON files
site: github.com/FluffyLabs/typeberry
created_at: '2025-04-24T20:05:54.000Z'
last_modified: '2025-04-24T20:05:54.000Z'
content_kind: issue
---

# Support chain config JSON files

## Issue by @coderabbitai[bot]

## Overview
Currently, the typeberry client accepts various command-line arguments for configuration, such as chain spec, genesis file path, and genesis root hash. As noted in the codebase, using JSON configuration files would be preferable to adding more CLI options.

## Requirements
The chain configuration JSON files should support:
1. Expected genesis root hash
2. Path to genesis JSON or BIN file
3. Expected chain spec (either a pre-defined one or passed explicitly with all parameters)
4. Name of the configuration

## Implementation Details
- Add support for loading configuration from JSON files
- Maintain backward compatibility with existing CLI arguments
- CLI arguments should take precedence over config file values
- Consider including a set of pre-defined config files in the repository for common use cases

## Benefits
- Improved user experience when working with different chains
- Easier to manage multiple configurations
- Cleaner command-line interface
- Better organization of configuration parameters

## Related Code
This is referenced in the comment in `bin/jam/args.ts`:
```
// NOTE [ToDr] Instead of adding more options here we should probably
// consider just using JSON config files and only leave the stuff
// that is actually meant to be easily overriden from CLI.
```


## Comment by @tomusdrw

Related: https://github.com/polkadot-fellows/JIPs/pull/1


## Comment by @DrEverr

https://docs.jamcha.in/basics/cli-args


## Comment by @tomusdrw

Closed via #455 follow up with CLI alignment in #457 
