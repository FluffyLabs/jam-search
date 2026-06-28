---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/args-decoder/args-decoder.test.ts#L1215-L1240
title: packages/core/pvm-interpreter/args-decoder/args-decoder.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 10
chunk_total: 11
content_sha: 4fdf69b13a3e622cc4435c98f5721454953b3d12a39a469baa93a1647930e5a2
language: typescript
---
`packages/core/pvm-interpreter/args-decoder/args-decoder.test.ts` (lines 1215–1240)

```typescript
      0x06,
      0x07,
      0x08,
      0x09,
    ];
    const maskBytes = [0b0000_0011, 0b0000_0000];
    const { argsDecoder, result, argumentType } = prepareData({
      programBytes,
      maskBytes,
      argumentType: ArgumentType.ONE_REGISTER_ONE_EXTENDED_WIDTH_IMMEDIATE,
    });
    const expectedImmediateDecoder = prepareExtendedWidthImmediate([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]);
    const expectedResult = {
      noOfBytesToSkip: 1,
      type: argumentType,

      registerIndex: 4,

      immediateDecoder: expectedImmediateDecoder,
    };

    argsDecoder.fillArgs(0, result);

    assert.deepStrictEqual(result, expectedResult);
  });
});
```
