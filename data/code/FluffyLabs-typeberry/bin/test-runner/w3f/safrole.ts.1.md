---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/w3f/safrole.ts#L100-L217
title: bin/test-runner/w3f/safrole.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 1
chunk_total: 3
content_sha: e0c2569e7cb6e4eac94a4c11a36638e9fcde3b2dddffdf9330be51ed2cc4b6b1
language: typescript
---
`bin/test-runner/w3f/safrole.ts` (lines 100–217)

```typescript
      entropy: FixedSizeArray.new(state.eta, ENTROPY_ENTRIES),
      previousValidatorData: tryAsPerValidator(state.lambda, chainSpec),
      currentValidatorData: tryAsPerValidator(state.kappa, chainSpec),
      nextValidatorData: tryAsPerValidator(state.gamma_k, chainSpec),
      designatedValidatorData: tryAsPerValidator(state.iota, chainSpec),
      ticketsAccumulator: asKnownSize(state.gamma_a),
      sealingKeySeries: TicketsOrKeys.toSafroleSealingKeys(state.gamma_s, chainSpec),
      epochRoot: state.gamma_z.asOpaque(),
    };
  }
}

export class EpochMark {
  static fromJson: FromJson<EpochMark> = {
    entropy: fromJson.bytes32(),
    tickets_entropy: fromJson.bytes32(),
    validators: json.array(safroleFromJson.validatorKeys),
  };

  entropy!: EntropyHash;
  tickets_entropy!: EntropyHash;
  validators!: ValidatorKeys[];
}

export class OkOutput {
  static fromJson: FromJson<OkOutput> = {
    epoch_mark: json.optional(EpochMark.fromJson),
    tickets_mark: json.optional<Ticket[]>(json.array(ticketFromJson)),
  };
  epoch_mark?: EpochMark | null;
  tickets_mark?: Ticket[] | null;
}

export class Output {
  static fromJson: FromJson<Output> = {
    ok: json.optional(OkOutput.fromJson),
    err: json.optional("string"),
  };

  ok?: OkOutput;
  err?: TestErrorCode;

  static toSafroleOutput(output: Output, spec: ChainSpec): Result<Omit<OkResult, "stateUpdate">, SafroleErrorCode> {
    if (output.err !== undefined) {
      return Result.error(Output.toSafroleErrorCode(output.err), () => `Safrole validation failed: ${output.err}`);
    }

    const epochMark =
      output.ok?.epoch_mark === undefined || output.ok.epoch_mark === null
        ? null
        : EpochMarker.create({
            entropy: output.ok.epoch_mark.entropy,
            ticketsEntropy: output.ok.epoch_mark.tickets_entropy,
            validators: tryAsPerValidator(output.ok.epoch_mark.validators, spec),
          });
    const tickets = output.ok?.tickets_mark ?? null;
    const ticketsMark = tickets === null ? null : TicketsMarker.create({ tickets: tryAsPerEpochBlock(tickets, spec) });

    return Result.ok({
      epochMark,
      ticketsMark,
    });
  }

  static toSafroleErrorCode(error: TestErrorCode): SafroleErrorCode {
    switch (error) {
      case TestErrorCode.BadSlot:
        return SafroleErrorCode.BadSlot;
      case TestErrorCode.BadTicketAttempt:
        return SafroleErrorCode.BadTicketAttempt;
      case TestErrorCode.BadTicketOrder:
        return SafroleErrorCode.BadTicketOrder;
      case TestErrorCode.BadTicketProof:
        return SafroleErrorCode.BadTicketProof;
      case TestErrorCode.DuplicateTicket:
        return SafroleErrorCode.DuplicateTicket;
      case TestErrorCode.IncorrectData:
        return SafroleErrorCode.IncorrectData;
      case TestErrorCode.UnexpectedTicket:
        return SafroleErrorCode.UnexpectedTicket;
      default:
        throw new Error(`Invalid error code: ${error}`);
    }
  }
}

class TestInput {
  static fromJson: FromJson<TestInput> = {
    slot: "number",
    entropy: fromJson.bytes32(),
    extrinsic: json.array(safroleFromJson.ticketEnvelope),
  };

  slot!: TimeSlot;
  entropy!: EntropyHash;
  extrinsic!: TicketsExtrinsic;
}

export class SafroleTest {
  static fromJson: FromJson<SafroleTest> = {
    input: TestInput.fromJson,
    pre_state: JsonState.fromJson,
    output: Output.fromJson,
    post_state: JsonState.fromJson,
  };

  input!: TestInput;
  pre_state!: JsonState;
  output!: Output;
  post_state!: JsonState;
}

export const bwasm = BandernsatchWasm.new();

export async function runSafroleTest(testContent: SafroleTest, { chainSpec }: RunOptions) {
  const preState = JsonState.toSafroleState(testContent.pre_state, chainSpec);
  const punishSet = SortedSet.fromArrayUnique(hashComparator, testContent.pre_state.post_offenders);
  const safrole = new Safrole(chainSpec, await Blake2b.createHasher(), preState, bwasm);
```
