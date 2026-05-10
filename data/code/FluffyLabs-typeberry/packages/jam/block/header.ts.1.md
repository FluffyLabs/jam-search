---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/block/header.ts#L112-L196
title: packages/jam/block/header.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 1
chunk_total: 2
content_sha: 2b69a24a0146b4b73c08103107d52146698f116a3040a82ced3a3f7c141f530a
language: typescript
---
`packages/jam/block/header.ts` (lines 112–196)

```typescript
export class Header extends WithDebug {
  static Codec = codec.Class(Header, {
    parentHeaderHash: codec.bytes(HASH_SIZE).asOpaque<HeaderHash>(),
    priorStateRoot: codec.bytes(HASH_SIZE).asOpaque<StateRootHash>(),
    extrinsicHash: codec.bytes(HASH_SIZE).asOpaque<ExtrinsicHash>(),
    timeSlotIndex: codec.u32.asOpaque<TimeSlot>(),
    epochMarker: codec.optional(EpochMarker.Codec),
    ticketsMarker: codec.optional(TicketsMarker.Codec),
    bandersnatchBlockAuthorIndex: codec.u16.asOpaque<ValidatorIndex>(),
    entropySource: codec.bytes(BANDERSNATCH_VRF_SIGNATURE_BYTES).asOpaque<BandersnatchVrfSignature>(),
    offendersMarker: codec.sequenceVarLen(codec.bytes(ED25519_KEY_BYTES).asOpaque<Ed25519Key>()),
    seal: codec.bytes(BANDERSNATCH_VRF_SIGNATURE_BYTES).asOpaque<BandersnatchVrfSignature>(),
  });

  static create(h: CodecRecord<Header>) {
    return Object.assign(Header.empty(), h);
  }

  /**
   * `H_p`: Hash of the parent header.
   *
   * In case of the genesis block, the hash will be zero.
   */
  public readonly parentHeaderHash: HeaderHash = Bytes.zero(HASH_SIZE).asOpaque();
  /** `H_r`: The state trie root hash before executing that block. */
  public readonly priorStateRoot: StateRootHash = Bytes.zero(HASH_SIZE).asOpaque();
  /** `H_x`: The hash of block extrinsic. */
  public readonly extrinsicHash: ExtrinsicHash = Bytes.zero(HASH_SIZE).asOpaque();
  /** `H_t`: JAM time-slot index. */
  public readonly timeSlotIndex: TimeSlot = tryAsTimeSlot(0);
  /**
   * `H_e`: Key and entropy relevant to the following epoch in case the ticket
   *        contest does not complete adequately.
   */
  public readonly epochMarker: EpochMarker | null = null;
  /**
   * `H_w`: Winning tickets provides the series of 600 slot sealing "tickets"
   *        for the next epoch.
   */
  public readonly ticketsMarker: TicketsMarker | null = null;
  /** `H_i`: Block author's index in the current validator set. */
  public readonly bandersnatchBlockAuthorIndex: ValidatorIndex = tryAsValidatorIndex(0);
  /** `H_v`: Entropy-yielding VRF signature. */
  public readonly entropySource: BandersnatchVrfSignature = Bytes.zero(BANDERSNATCH_VRF_SIGNATURE_BYTES).asOpaque();
  /** `H_o`: Sequence of keys of newly misbehaving validators. */
  public readonly offendersMarker: Ed25519Key[] = [];
  /**
   * `H_s`: Block seal.
   *
   * https://graypaper.fluffylabs.dev/#/579bd12/0d0c010d1101
   */
  public readonly seal: BandersnatchVrfSignature = Bytes.zero(BANDERSNATCH_VRF_SIGNATURE_BYTES).asOpaque();

  private constructor() {
    super();
  }

  /** Create an empty header with some dummy values. */
  public static empty() {
    return new Header();
  }
}

/** Undecoded View of the [`Header`]. */
export type HeaderView = DescribedBy<typeof Header.Codec.View>;

/**
 *  A codec-aware header with hash.
 *
 * TODO [ToDr] It seems that it's impossible to create a codec for generic class.
 * The typescript type system really needs concrete objects to resolve the types:
 * `DescriptorRecord` or `CodecRecord` for some reason.
 */
class HeaderViewWithHash extends WithHash<HeaderHash, HeaderView> {
  static Codec = codec.Class(HeaderViewWithHash, {
    hash: codec.bytes(HASH_SIZE).asOpaque<HeaderHash>(),
    data: Header.Codec.View,
  });

  static create({ hash, data }: CodecRecord<HeaderViewWithHash>) {
    return WithHash.new(hash, data);
  }
}
/** Encoding of header + hash. */
export const headerViewWithHashCodec = HeaderViewWithHash.Codec;
```
