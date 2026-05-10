---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk-ecalli-mocks/README.md#L1-L17'
title: sdk-ecalli-mocks/README.md
site: github.com/tomusdrw/as-lan
created_at: '2026-05-07T23:20:06+02:00'
last_modified: '2026-05-07T23:20:06+02:00'
chunk_index: 0
chunk_total: 1
content_sha: edbbfcc9a869830819fb3e02fa4e5f960370a45512d92d9a6f67448eeaaec820
language: markdown
---
`sdk-ecalli-mocks/README.md` (lines 1–17)

```markdown
# @fluffylabs/as-lan-ecalli-mocks

JavaScript ecalli host-call stubs for testing [JAM](https://graypaper.com/) services built with [`@fluffylabs/as-lan`](https://www.npmjs.com/package/@fluffylabs/as-lan).

Wired as WASM imports during AssemblyScript tests to simulate the PVM runtime's host calls (`fetch`, `read`, `write`, `lookup`, `export`, `machine`, …). The export names match the `@external("ecalli", ...)` declarations in the SDK.

See the [repository README](https://github.com/tomusdrw/as-lan#readme) and [full documentation](https://todr.me/as-lan/) for usage.

## Install

```bash
npm install --save-dev @fluffylabs/as-lan @fluffylabs/as-lan-ecalli-mocks
```

## License

MPL-2.0
```
