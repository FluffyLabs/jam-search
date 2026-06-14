---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/registers.test.ts#L113-L143
title: packages/core/pvm-interpreter/registers.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 1
chunk_total: 2
content_sha: b972e38d99f288f29de3671da64efaca7886b14ca3f772d2d2bc033fc78f94b4
language: typescript
---
`packages/core/pvm-interpreter/registers.test.ts` (lines 113–143)

```typescript
      const fill = new Uint8Array(12 * U64_BYTES).fill(0); // we set 1st register so we fill remaining 12 with 0
      const bytes = new Uint8Array([...bytesReg, ...fill]);

      const expected = 0xef_cd_ab_89_67_45_23_01n;

      regs.setAllEncoded(bytes);

      const reg = regs.getU64(0);

      assert.deepStrictEqual(reg, expected);
    });

    it("should throw when trying to set all registers from bytes encoded with incorrect size", () => {
      const regs = Registers.empty();

      const bytesReg = new Uint8Array([0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef]);
      const fill = new Uint8Array(12 * U64_BYTES).fill(0); // we set 1st register so we fill remaining 12 with 0
      const bytes = new Uint8Array([...bytesReg, ...fill, 0x00]);

      // too many
      assert.throws(() => {
        regs.setAllEncoded(bytes);
      });

      // too little
      assert.throws(() => {
        regs.setAllEncoded(fill);
      });
    });
  });
});
```
