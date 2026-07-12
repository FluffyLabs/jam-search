---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/convert/types.ts#L109-L234
title: bin/convert/types.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 659e226e0f3ba50e8239f3a3ce9101b303533fcf97c1dc29d00fd40edef41a64
language: typescript
---
`bin/convert/types.ts` (lines 109–234)

```typescript
    json: fullStateDumpFromJson,
    process: {
      options: ["as-root-hash", "as-entries"],
      run(spec: ChainSpec, data: unknown, option: string, blake2b: Blake2b) {
        const state = data as InMemoryState;
        if (option === "as-entries") {
          return looseType({
            value: Object.fromEntries(StateEntries.serializeInMemory(spec, blake2b, state)),
          });
        }

        if (option === "as-root-hash") {
          return looseType({
            value: StateEntries.serializeInMemory(spec, blake2b, state).getRootHash(blake2b),
            encode: codec.bytes(HASH_SIZE),
          });
        }

        throw new Error(`Invalid processing option: ${option}`);
      },
    },
  },
  {
    name: "stf-genesis",
    encode: StateTransitionGenesis.Codec,
    decode: StateTransitionGenesis.Codec,
    json: (_spec: ChainSpec) => StateTransitionGenesis.fromJson,
    process: {
      options: ["as-state", "as-jip4", "as-fuzz-message"],
      run(spec: ChainSpec, data: unknown, option: string, blake2b) {
        const test = data as StateTransitionGenesis;
        if (option === "as-state") {
          return looseType({
            value: stateFromKeyvals(spec, blake2b, test.state),
          });
        }

        if (option === "as-jip4") {
          const genesisState = new Map(test.state.keyvals.map((x) => [x.key, x.value]));
          return looseType({
            value: JipChainSpec.create({
              genesisHeader: Encoder.encodeObject(Header.Codec, test.header, spec),
              genesisState,
            }),
          });
        }

        if (option === "as-fuzz-message") {
          const init = v1.Initialize.create({
            header: test.header,
            keyvals: test.state.keyvals,
            ancestry: [],
          });
          const msg: v1.MessageData = {
            type: v1.MessageType.Initialize,
            value: init,
          };
          return looseType({
            value: msg,
            encode: v1.messageCodec,
          });
        }

        throw new Error(`Invalid processing option: ${option}`);
      },
    },
  },
  {
    name: "stf-vector",
    encode: StateTransition.Codec,
    decode: StateTransition.Codec,
    json: () => StateTransition.fromJson,
    process: {
      options: [
        "as-pre-state",
        "as-post-state",
        "as-fuzz-message",
        "as-block-fuzz-message",
        "as-state-fuzz-message",
        "as-block",
      ],
      run(spec: ChainSpec, data: unknown, option: string, blake2b) {
        const test = data as StateTransition;
        if (option === "as-pre-state") {
          return looseType({
            value: stateFromKeyvals(spec, blake2b, test.pre_state),
          });
        }

        if (option === "as-post-state") {
          return looseType({
            value: stateFromKeyvals(spec, blake2b, test.post_state),
          });
        }

        if (option === "as-block") {
          return looseType({
            encode: Block.Codec,
            value: test.block.materialize(),
          });
        }

        if (option === "as-fuzz-message") {
          // biome-ignore lint/suspicious/noConsole: deprecation warning
          console.warn(
            "⚠️  Warning: 'as-fuzz-message' is deprecated and will be removed in version 0.6.0. Use 'as-block-fuzz-message' instead.",
          );
        }

        if (option === "as-block-fuzz-message" || option === "as-fuzz-message") {
          const msg: v1.MessageData = {
            type: v1.MessageType.ImportBlock,
            value: test.block,
          };
          return looseType({
            value: msg,
            encode: v1.messageCodec,
          });
        }

        if (option === "as-state-fuzz-message") {
          const blockHeader = test.block.header.materialize();
          const init = v1.Initialize.create({
            header: Header.empty(),
            keyvals: test.pre_state.keyvals,
            ancestry: [
```
