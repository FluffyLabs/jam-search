---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/lib/README.md#L115-L272'
title: bin/lib/README.md
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 1
chunk_total: 3
content_sha: 1c294a83ae9e316a15e4d82d657f8fbeadb804f98f4b48b0dc88debeccfd44da
language: markdown
---
`bin/lib/README.md` (lines 115–272)

```markdown
const largeNumber = tryAsU32(1000000);

// Type checking
assert.ok(isU8(42));
assert.strictEqual(smallNumber, 42);
assert.strictEqual(largeNumber, 1000000);
```
<!-- /example-code:numbers -->

### Hashing with Blake2b

<!-- example-code:hash-blake2b -->
```typescript
import { Blake2b } from "@typeberry/lib/hash";

// Create a Blake2b hasher
const hasher = await Blake2b.createHasher();

// Hash some data
const data = new Uint8Array([1, 2, 3, 4, 5]);
const hash = hasher.hashBytes(data);

// hash is a 32-byte Blake2b hash
assert.strictEqual(hash.length, 32);
```
<!-- /example-code:hash-blake2b -->

### Hashing a String

<!-- example-code:hash-string -->
```typescript
import { Blake2b } from "@typeberry/lib/hash";

const hasher = await Blake2b.createHasher();

// Hash a string directly
const hash = hasher.hashString("Hello, world!");

// Returns a 32-byte hash
assert.strictEqual(hash.length, 32);
```
<!-- /example-code:hash-string -->

### Hashing Multiple Blobs

<!-- example-code:hash-multiple -->
```typescript
import { Blake2b } from "@typeberry/lib/hash";

const hasher = await Blake2b.createHasher();

// Hash multiple byte arrays together
const data1 = new Uint8Array([1, 2, 3]);
const data2 = new Uint8Array([4, 5, 6]);
const hash = hasher.hashBlobs([data1, data2]);

// Returns a single hash of all inputs
assert.strictEqual(hash.length, 32);
```
<!-- /example-code:hash-multiple -->

### Bytes - Parsing Hex Strings

<!-- example-code:bytes-parsing -->
```typescript
import { BytesBlob } from "@typeberry/lib/bytes";

// Parse hex string with 0x prefix
const hexString = "0x48656c6c6f";
const bytes = BytesBlob.parseBlob(hexString);

// Convert to regular Uint8Array
const data = bytes.raw;

// Verify the data
const text = new TextDecoder().decode(data);
assert.strictEqual(text, "Hello");
```
<!-- /example-code:bytes-parsing -->

### Bytes - Creating Bytes

<!-- example-code:bytes-create -->
```typescript
import { Bytes } from "@typeberry/lib/bytes";

// Create fixed-size bytes
const data = Bytes.fill(32, 0x42);

assert.strictEqual(data.length, 32);
assert.strictEqual(data.raw[0], 0x42);
```
<!-- /example-code:bytes-create -->

### JAM/GP Codec - Basic Usage

<!-- example-code:codec-basic -->
```typescript
import { Decoder, Encoder, codec } from "@typeberry/lib/codec";
import { Bytes } from "@typeberry/lib/bytes";

// Define a schema for fixed-size bytes
const hashSchema = codec.bytes(32);

// Create test data

const testHash = Bytes.fill(32, 0x42);

// Encode data
const encoded = Encoder.encodeObject(hashSchema, testHash);

// Decode data
const decoded = Decoder.decodeObject(hashSchema, encoded);

assert.deepStrictEqual(decoded, testHash);
```
<!-- /example-code:codec-basic -->

### PVM Interpreter - Basic Usage

<!-- example-code:pvm-basic -->
```typescript
import { Interpreter } from "@typeberry/lib/pvm-interpreter";
import { Status, tryAsGas } from "@typeberry/lib/pvm-interface";
import { BytesBlob } from "@typeberry/lib/bytes";

// Load a PVM program from hex
const programHex = "0x0000213308013309012803009577ff51070c648ac8980864a928f3648733083309013200499352d500";
const program = BytesBlob.parseBlob(programHex);

// Create interpreter and initialize with program
const pvm = Interpreter.new();
pvm.resetGeneric(program.raw, 0, tryAsGas(1000));

// dump the program data
console.table(pvm.dumpProgram());

// Run the program
pvm.runProgram();

// Program executed successfully
assert.equal(pvm.getStatus(), Status.OOG);
assert.equal(pvm.getPC(), 12);
```
<!-- /example-code:pvm-basic -->

### PVM Interpreter - Accessing Registers

<!-- example-code:pvm-registers -->
```typescript
import { Interpreter } from "@typeberry/lib/pvm-interpreter";
import { tryAsGas } from "@typeberry/lib/pvm-interface";
import { BytesBlob } from "@typeberry/lib/bytes";

const programHex = "0x0000210408010409010503000277ff07070c528a08980852a905f3528704080409111300499352d500";
const program = BytesBlob.parseBlob(programHex);

const pvm = Interpreter.new();
```
