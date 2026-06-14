---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/w3f/safrole.ts#L215-L281
title: bin/test-runner/w3f/safrole.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 2
chunk_total: 3
content_sha: d2aa9cfcf4da6c79f26114608a235b661d799f2c7363f7f4d3ccfc48bd9b463d
language: typescript
---
`bin/test-runner/w3f/safrole.ts` (lines 215–281)

```typescript
  const preState = JsonState.toSafroleState(testContent.pre_state, chainSpec);
  const punishSet = SortedSet.fromArrayUnique(hashComparator, testContent.pre_state.post_offenders);
  const safrole = new Safrole(chainSpec, await Blake2b.createHasher(), preState, bwasm);
  const expectedResult = Output.toSafroleOutput(testContent.output, chainSpec);
  const { epochMarker, ticketsMarker } = extractMarkers(expectedResult, chainSpec);

  const result = await safrole.transition({
    ...testContent.input,
    punishSet,
    epochMarker,
    ticketsMarker,
  });

  const expectedState = JsonState.toSafroleState(testContent.post_state, chainSpec);

  if (result.isError) {
    deepEqual(result, expectedResult, { ignore: ["details"] });
    deepEqual(safrole.state, expectedState);
  } else {
    const state = copyAndUpdateState(safrole.state, result.ok.stateUpdate);
    deepEqual(
      Result.ok({
        epochMark: result.ok.epochMark,
        ticketsMark: result.ok.ticketsMark,
      }),
      expectedResult,
    );
    deepEqual(state, expectedState);
  }
}
function extractMarkers(
  expectedResult: Result<Omit<OkResult, "stateUpdate">, SafroleErrorCode>,
  chainSpec: ChainSpec,
): {
  epochMarker: EpochMarkerView | null;
  ticketsMarker: TicketsMarkerView | null;
} {
  if (expectedResult.isOk) {
    const { ok } = expectedResult;
    const epochMarker =
      ok.epochMark === null
        ? null
        : Decoder.decodeObject(
            EpochMarker.Codec.View,
            Encoder.encodeObject(EpochMarker.Codec, ok.epochMark, chainSpec),
            chainSpec,
          );
    const ticketsMarker =
      ok.ticketsMark === null
        ? null
        : Decoder.decodeObject(
            TicketsMarker.Codec.View,
            Encoder.encodeObject(TicketsMarker.Codec, ok.ticketsMark, chainSpec),
            chainSpec,
          );

    return {
      epochMarker,
      ticketsMarker,
    };
  }

  return {
    epochMarker: null,
    ticketsMarker: null,
  };
}
```
