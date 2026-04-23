---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/generator.test.ts#L93-L211
title: packages/workers/block-authorship/generator.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 6fe18f97928c8aae096258f948e4029d6a348c541ce538f37182154e64b31f0d
language: typescript
---
`packages/workers/block-authorship/generator.test.ts` (lines 93–211)

```typescript
const MOCK_SEAL_PAYLOAD = asOpaqueType(
  BytesBlob.blobFromParts(JAM_FALLBACK_SEAL, Bytes.zero(HASH_SIZE).raw),
) as BlockSealInput;

// Mock state entropy values
const MOCK_ENTROPY_0: EntropyHash = Bytes.fill(HASH_SIZE, 10).asOpaque();
const MOCK_ENTROPY_1: EntropyHash = Bytes.fill(HASH_SIZE, 20).asOpaque();
const MOCK_ENTROPY_2: EntropyHash = Bytes.fill(HASH_SIZE, 30).asOpaque();
const MOCK_ENTROPY_3: EntropyHash = Bytes.fill(HASH_SIZE, 40).asOpaque();

// Mock BlocksDb
function createMockBlocksDb(headerHash: Bytes<32>) {
  return {
    getBestHeaderHash: () => headerHash.asOpaque(),
  } as unknown as BlocksDb;
}

// Mock StatesDb
function createMockStatesDb(state: ReturnType<typeof createMockState>) {
  return {
    getState: () => state,
    getStateRoot: () => Promise.resolve(MOCK_STATE_ROOT.asOpaque()),
  } as unknown as StatesDb;
}

function createMockState(timeslot: number) {
  const bandersnatchKeys = validatorDataArray.map((v) => v.bandersnatch);

  return {
    timeslot: tryAsTimeSlot(timeslot),
    entropy: FixedSizeArray.new([MOCK_ENTROPY_0, MOCK_ENTROPY_1, MOCK_ENTROPY_2, MOCK_ENTROPY_3], 4),
    previousValidatorData: validators,
    currentValidatorData: validators,
    designatedValidatorData: validators,
    nextValidatorData: validators,
    ticketsAccumulator: asKnownSize([]),
    sealingKeySeries: {
      kind: SafroleSealingKeysKind.Keys as const,
      keys: asKnownSize(bandersnatchKeys),
    },
    epochRoot: Bytes.zero(BANDERSNATCH_RING_ROOT_BYTES).asOpaque(),
    disputesRecords: {
      punishSet: { size: 0, has: () => false },
    },
  };
}

/**
 * Creates an expected block based on mock values and provided parameters.
 * Used for asserting generated blocks match expected structure.
 */
function createExpectedBlock(params: {
  timeSlot: TimeSlot;
  validatorIndex: ValidatorIndex;
  extrinsicHash: Bytes<32>;
  epochMarker?: EpochMarker | null;
  ticketsMarker?: TicketsMarker | null;
}) {
  return Block.create({
    header: Header.create({
      parentHeaderHash: MOCK_PARENT_HASH.asOpaque(),
      priorStateRoot: MOCK_STATE_ROOT.asOpaque(),
      extrinsicHash: params.extrinsicHash.asOpaque(),
      timeSlotIndex: params.timeSlot,
      bandersnatchBlockAuthorIndex: params.validatorIndex,
      entropySource: MOCK_SEAL_SIGNATURE.asOpaque(),
      seal: MOCK_SEAL_SIGNATURE.asOpaque(),
      epochMarker: params.epochMarker ?? null,
      ticketsMarker: params.ticketsMarker ?? null,
      offendersMarker: [],
    }),
    extrinsic: Extrinsic.create({
      tickets: asOpaqueType([]),
      preimages: [],
      guarantees: asOpaqueType([]),
      assurances: asOpaqueType([]),
      disputes: DisputesExtrinsic.create({
        verdicts: [],
        culprits: [],
        faults: [],
      }),
    }),
  });
}

describe("Generator", () => {
  let blake2b: Blake2b;
  let keccakHasher: keccak.KeccakHasher;
  let bandersnatch: BandernsatchWasm;

  beforeEach(async () => {
    await initWasm();
    blake2b = await Blake2b.createHasher();
    keccakHasher = await keccak.KeccakHasher.create();
    bandersnatch = await BandernsatchWasm.new();

    // Mock VRF functions to return predictable results
    mock.method(bandersnatchVrf, "getVrfOutputHash", () =>
      Promise.resolve(Result.ok(Bytes.zero(HASH_SIZE).asOpaque())),
    );
    mock.method(bandersnatchVrf, "generateSeal", () => Promise.resolve(Result.ok(MOCK_SEAL_SIGNATURE.asOpaque())));
    mock.method(bandersnatchVrf, "getRingCommitment", () =>
      Promise.resolve(Result.ok(Bytes.zero(BANDERSNATCH_RING_ROOT_BYTES).asOpaque())),
    );
  });

  afterEach(() => {
    mock.restoreAll();
  });

  describe("nextBlock - fallback mode", () => {
    it("should create block for same-epoch slot", async () => {
      const state = createMockState(0);
      const blocksDb = createMockBlocksDb(MOCK_PARENT_HASH);
      const statesDb = createMockStatesDb(state);

      const generator = Generator.new({
        chainSpec: tinyChainSpec,
        bandersnatch,
```
