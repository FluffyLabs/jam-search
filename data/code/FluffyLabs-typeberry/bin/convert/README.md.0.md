---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/convert/README.md#L1-L84'
title: bin/convert/README.md
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: 6baa1968787a4316abcd00b6dd7a20266313eb516b32c714df51b9b5dfeeacef
language: markdown
---
`bin/convert/README.md` (lines 1–84)

```markdown
# @typeberry/convert

Convert JAM-related types between different formats.

## Usage

```bash
@typeberry/convert [options] <bin-hex-or-json-input-file> <type> [process] [output-format]
```

Attempts to read provided input file as 'type' and output in requested 'output-format'.
For some 'type's it's additionally possible to process the data before outputting it.
The input type is detected from file extension (`.bin`, `.hex` or `.json`).

### Options

- `--flavor` - Chain spec flavor, either `full` or `tiny` (default: `tiny`)

### Output Formats

- `to-print` - Print the object to the console (default)
- `to-json` - JSON format (when supported)
- `to-hex` - JAM-codec hex-encoded string (when supported)
- `to-repl` - Start a JavaScript REPL with the data loaded into a variable

### Input Types

- `block`
- `header`
- `work-report`
- `work-package`
- `work-item`
- `spi`
- `test-vector-pvm`
- `state-dump`
- `state-transition-vector`

### Processing Options

Some input types support additional processing before output:

- **state-dump**: `as-root-hash`, `as-entries`, `as-truncated-entries`
- **state-transition-vector**: `as-pre-state`, `as-post-state`

## Examples

```bash
# Convert header from JSON to hex
@typeberry/convert ./genesis-header.json header to-hex

# Convert state dump and process it to entries, output as JSON
@typeberry/convert ./state-snapshot.json state-dump as-entries to-json

# Start a REPL with header data loaded
@typeberry/convert ./genesis-header.json header to-repl

# Convert with specific chain spec flavor
@typeberry/convert --flavor=full ./genesis-header.json header to-json

# Process state dump to root hash and print (default output)
@typeberry/convert ./state-dump.json state-dump as-root-hash
```

## REPL Mode

When using `to-repl`, the tool starts an interactive JavaScript REPL with:

- Your converted data available in the `data` variable
- Utility functions:
  - `inspect(obj)` - Pretty-print objects 
  - `toJson(obj)` - Dump the object into JSON
  - `type` - Shows the data type name
- Standard REPL commands (`.help`, `.exit`, etc.)

Example REPL session:
```javascript
header> data.timeSlotIndex
42
header> Object.keys(data)
['parentHeaderHash', 'priorStateRoot', 'extrinsicHash', ...]
header> inspect(data)
Header { ... }
header> .exit
```
```
