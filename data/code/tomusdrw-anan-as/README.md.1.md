---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/README.md#L146-L210'
title: README.md
site: github.com/tomusdrw/anan-as
created_at: '2026-04-22T10:07:05+01:00'
last_modified: '2026-04-22T10:07:05+01:00'
chunk_index: 1
chunk_total: 2
content_sha: 61e2cc3af383169b52cbf5c9edaae385812312a9a38a3ac972fb8e746b58d38c
language: markdown
---
`README.md` (lines 146–210)

```markdown
npx @fluffylabs/anan-as run [--spi] [--no-logs] [--no-metadata] [--pc <number>] [--gas <number>] <file.pvm> [spi-args.bin or hex]

# Replay an ecalli trace
# Learn more: https://github.com/tomusdrw/JIPs/blob/td-jip6-ecalliloggin/JIP-6.md
npx @fluffylabs/anan-as replay-trace [--no-metadata] [--no-verify] [--no-logs] <trace.log>

# Show help
npx @fluffylabs/anan-as --help
npx @fluffylabs/anan-as disassemble --help
npx @fluffylabs/anan-as run --help
```

The `run` command executes PVM bytecode until it encounters a `halt` instruction or a host call.
The `replay-trace` command re-executes an ecalli trace, replaying recorded host call responses.

### Commands

- `disassemble`: Convert PVM bytecode to human-readable assembly
- `run`: Execute PVM bytecode and show results
- `replay-trace`: Re-execute an ecalli trace with recorded host call responses

### Flags

- `--spi`: Treat input as JAM SPI format instead of generic PVM
- `--no-metadata`: Input does not start with metadata
- `--no-logs`: Disable execution logs (run and replay-trace commands)
- `--no-verify`: Skip verification against trace data (replay-trace only)
- `--pc <number>`: Set initial program counter (default: 0)
- `--gas <number>`: Set initial gas amount (default: 10,000)
- `--help`, `-h`: Show help information

### Examples

```bash
# Disassemble a JAM file (includes metadata by default)
npx @fluffylabs/anan-as disassemble program.pvm

# Disassemble without metadata
npx @fluffylabs/anan-as disassemble --no-metadata program.pvm

# Disassemble JAM SPI program
npx @fluffylabs/anan-as disassemble --spi program.jam

# Run a JAM program with logs (includes metadata by default)
npx @fluffylabs/anan-as run program.pvm

# Run a JAM program without metadata
npx @fluffylabs/anan-as run --no-metadata program.pvm

# Run a JAM program quietly
npx @fluffylabs/anan-as run --no-logs program.pvm

# Run a JAM program with custom initial PC and gas
npx @fluffylabs/anan-as run --pc 100 --gas 10000 program.pvm

# Run JAM SPI program with arguments (file or hex)
npx @fluffylabs/anan-as run --spi program.jam args.bin
npx @fluffylabs/anan-as run --spi program.jam 0xdeadbeef

# Replay an ecalli trace
npx @fluffylabs/anan-as replay-trace trace.log

# Replay without verification
npx @fluffylabs/anan-as replay-trace --no-verify trace.log
```
```
