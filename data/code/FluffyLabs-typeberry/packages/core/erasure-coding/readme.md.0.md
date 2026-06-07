---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/erasure-coding/readme.md#L1-L42
title: packages/core/erasure-coding/readme.md
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 46690ca39542ad74f0ecd1b66b3c9cf6c73f9358e747ce75595660f6f25ad3b1
language: markdown
---
`packages/core/erasure-coding/readme.md` (lines 1–42)

```markdown
## Data Structure and Erasure Coding

This document outlines the data structures and erasure coding scheme used.

### Core Units

* **`Piece`**: A fundamental data unit of **684 bytes**.
* **`Segment`**: Composed of **6 `Pieces`**, totaling **4104 bytes** (6 * 684 bytes).
* **`Point`**: The smallest component within a `Chunk`, consisting of **2 bytes**.

---

### Erasure Coding (EC) Process

Erasure coding is applied to a `Piece` or a multiple of `Pieces`.

* **Input**: Data to be encoded (must be a multiple of `Piece` size).
* **Output**: The EC process always generates **1023 `Chunks`**.
    * These consist of **342 main `Chunks`** (original data).
    * And **681 redundancy `Chunks`** (for recovery).
    * The order of `Chunks` matter for recovery, so each `Chunk` has an index associated with it. The index is implicit though and is not part of the `Chunk` bytes.
* **`Chunk` Composition**: Each `Chunk` is made up of `Points`. The number of `Points` per `Chunk` depends on the input data size:
    * If the input is a single **`Piece`** (684 bytes):
        * Each `Chunk` contains **1 `Point`** (2 bytes).
    * If the input is a single **`Segment`** (4104 bytes, i.e., 6 `Pieces`):
        * Each `Chunk` contains **6 `Points`** (12 bytes).
    * For other input sizes (always a multiple of a `Piece`), the number of `Points` per `Chunk` scales proportionally. For an input of $k \times \text{Piece}$, each of the 1023 `Chunks` will contain $k \text{ Points}$.

---

### Data Reconstruction

* To reconstruct the original encoded data, **any 342 `Chunks`** (along with their indices) out of the 1023 available `Chunks` are required.

---

### Terminology: `Chunks` vs. `Shards`

* **`Chunk`**: A unit of data produced by the erasure coding process.
* **`Shard`**: A `Chunk` that has been distributed, for example, to validators in a network. In case of a full network (1023 validators), a `Shard` is equivalent to `Chunk`.

---
```
