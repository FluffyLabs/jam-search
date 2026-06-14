---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/config-node/jip-chain-spec.test.ts#L94-L136
title: packages/jam/config-node/jip-chain-spec.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 1
chunk_total: 2
content_sha: df2578f15c3474d62fc7a3da569b9f4347bc6c53e7416731380466a744e9acb3
language: typescript
---
`packages/jam/config-node/jip-chain-spec.test.ts` (lines 94–136)

```typescript
    assert.throws(() => parseFromJson(invalidSpec, JipChainSpec.fromJson));
  });

  it("should throw an error when the genesis state is missing", () => {
    const invalidSpec = {
      ...JIP_CHAIN_SPEC_TEST,
      genesisState: undefined,
    };
    assert.throws(() => parseFromJson(invalidSpec, JipChainSpec.fromJson));
  });

  it("should throw an error when bootnode has invalid format (1)", () => {
    const invalidSpec = {
      ...JIP_CHAIN_SPEC_TEST,
      bootnodes: ["192.168.50.18:62061"],
    };
    assert.throws(() => parseFromJson(invalidSpec, JipChainSpec.fromJson));
  });

  it("should throw an error when bootnode has invalid format (2)", () => {
    const invalidSpec = {
      ...JIP_CHAIN_SPEC_TEST,
      bootnodes: ["evysk4p563r2kappaebqykryquxw5lfcclvf23dqqhi5n765h4kkb"],
    };
    assert.throws(() => parseFromJson(invalidSpec, JipChainSpec.fromJson));
  });

  it("should throw an error when bootnode has invalid port (1)", () => {
    const invalidSpec = {
      ...JIP_CHAIN_SPEC_TEST,
      bootnodes: ["evysk4p563r2kappaebqykryquxw5lfcclvf23dqqhi5n765h4kkb@192.168.50.18:port"],
    };
    assert.throws(() => parseFromJson(invalidSpec, JipChainSpec.fromJson));
  });

  it("should throw an error when bootnode has invalid port (2)", () => {
    const invalidSpec = {
      ...JIP_CHAIN_SPEC_TEST,
      bootnodes: ["evysk4p563r2kappaebqykryquxw5lfcclvf23dqqhi5n765h4kkb@192.168.50.18:-62061"],
    };
    assert.throws(() => parseFromJson(invalidSpec, JipChainSpec.fromJson));
  });
});
```
