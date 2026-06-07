---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/chain-stf.ts#L96-L197
title: packages/jam/transition/chain-stf.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 1
chunk_total: 5
content_sha: f1224dc84c5107e8a7b5bbdd134ffbe738570fe02e86579c75545e98c875fbe6
language: typescript
---
`packages/jam/transition/chain-stf.ts` (lines 96–197)

```typescript
  | TaggedError<StfErrorKind.Accumulate, ACCUMULATION_ERROR>
  | TaggedError<StfErrorKind.Offenders, OFFENDERS_ERROR>;

export const stfError = <Kind extends StfErrorKind, Err extends StfError["error"]>(
  kind: Kind,
  nested: ErrorResult<Err>,
) => {
  return Result.taggedError<Ok, Kind, Err>(StfErrorKind, kind, nested);
};

const logger = Logger.new(import.meta.filename, "stf");

export class OnChain {
  // chapter 6: https://graypaper.fluffylabs.dev/#/68eaa1f/0d13000d1300?v=0.6.4
  private readonly safrole: Safrole;
  private readonly safroleSeal: SafroleSeal;
  // chapter 10: https://graypaper.fluffylabs.dev/#/68eaa1f/11a30111a301?v=0.6.4
  private readonly disputes: Disputes;
  // chapter 11: https://graypaper.fluffylabs.dev/#/68eaa1f/133100133100?v=0.6.4
  private readonly reports: Reports;
  private readonly assurances: Assurances;
  // chapter 12: https://graypaper.fluffylabs.dev/#/68eaa1f/159f02159f02?v=0.6.4
  private readonly accumulate: Accumulate;
  private readonly accumulateOutput: AccumulateOutput;
  // chapter 12.4: https://graypaper.fluffylabs.dev/#/68eaa1f/18cc0018cc00?v=0.6.4
  private readonly preimages: Preimages;
  // after accumulation
  // chapter 7: https://graypaper.fluffylabs.dev/#/68eaa1f/0faf010faf01?v=0.6.4
  private readonly recentHistory: RecentHistory;
  // chapter 8: https://graypaper.fluffylabs.dev/#/68eaa1f/0f94020f9402?v=0.6.4
  private readonly authorization: Authorization;
  // chapter 13: https://graypaper.fluffylabs.dev/#/68eaa1f/18b60118b601?v=0.6.4
  private readonly statistics: Statistics;

  private isReadyForNextEpoch: Promise<boolean> = Promise.resolve(false);

  public readonly chainSpec: ChainSpec;
  public readonly state: State & WithStateView;
  public readonly hasher: TransitionHasher;
  public readonly measureAccumulate: ReturnType<typeof measure>;

  /** Wire up a full on-chain STF from its dependencies. */
  static assemble(args: {
    chainSpec: ChainSpec;
    state: State & WithStateView;
    hasher: TransitionHasher;
    options: AccumulateOptions;
    headerChain: HeaderChain;
  }) {
    return new OnChain(args.chainSpec, args.state, args.hasher, args.options, args.headerChain);
  }

  private constructor(
    chainSpec: ChainSpec,
    state: State & WithStateView,
    hasher: TransitionHasher,
    options: AccumulateOptions,
    headerChain: HeaderChain,
  ) {
    this.chainSpec = chainSpec;
    this.state = state;
    this.hasher = hasher;

    const bandersnatch = BandernsatchWasm.new();
    this.statistics = new Statistics(chainSpec, state);

    this.safrole = new Safrole(chainSpec, hasher.blake2b, state, bandersnatch);
    this.safroleSeal = new SafroleSeal(bandersnatch);

    this.recentHistory = new RecentHistory(hasher, state);

    this.disputes = new Disputes(chainSpec, hasher.blake2b, state);

    this.reports = new Reports(chainSpec, hasher.blake2b, state, headerChain);
    this.assurances = new Assurances(chainSpec, state, hasher.blake2b);
    this.accumulate = new Accumulate(chainSpec, hasher.blake2b, state, options);
    this.accumulateOutput = new AccumulateOutput();
    this.preimages = new Preimages(state, hasher.blake2b);

    this.authorization = new Authorization(chainSpec, state);
    this.measureAccumulate = measure(`import:accumulate (${PvmBackend[options.pvm]})`);
  }

  /** Pre-populate things worth caching for the next epoch. */
  async prepareForNextEpoch() {
    if (await this.isReadyForNextEpoch) {
      return;
    }
    const timeslot = this.state.timeslot;
    logger.log`#${timeslot} preparing for next epoch`;
    const ready = this.safrole.prepareValidatorKeysForNextEpoch(this.state.disputesRecords.punishSet);
    this.isReadyForNextEpoch = ready.then((x) => {
      if (x.isOk) {
        logger.log`#${timeslot} next epoch ready`;
      } else {
        logger.log`#${timeslot} ${x.details()}`;
      }
      return true;
    });
  }

  private async verifySeal(timeSlot: TimeSlot, block: BlockView) {
```
