---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/config-node/node-config.test.ts#L103-L231
title: packages/jam/config-node/node-config.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 0065aaaacb04544f03aff4d82733b59cc252b6b7d62cfab7b00c9df8fc68fd1a
language: typescript
---
`packages/jam/config-node/node-config.test.ts` (lines 103–231)

```typescript
    const config = loadConfig(["dev"], withRelPath);
    assert.deepStrictEqual(config, parseFromJson(configs.devTiny, NodeConfiguration.fromJson));
  });

  it("should parse inline json config and deep merge onto previous entries", () => {
    const config = loadConfig(
      ["default", JSON.stringify({ database_base_path: "/test/path", chain_spec: { bootnodes: [] } })],
      withRelPath,
    );
    assert.deepStrictEqual(
      config,
      parseFromJson(
        {
          ...configs.default,
          database_base_path: "/test/path",
          chain_spec: { ...configs.default.chain_spec, bootnodes: [] },
        },
        NodeConfiguration.fromJson,
      ),
    );
  });

  it("should load config from file if a valid file path is specified", () => {
    mock.method(fs, "readFileSync", (src: string) => {
      if (src === withRelPath("file.json")) {
        return JSON.stringify(polkajamConfig);
      }
      throw new Error(`File ${src} not found`);
    });
    const config = loadConfig(["file.json"], withRelPath);
    assert.deepStrictEqual(config, parseFromJson(polkajamConfig, NodeConfiguration.fromJson));
  });

  it("should load config from file and deep merge onto previous entries", () => {
    mock.method(fs, "readFileSync", (src: string) => {
      if (src === withRelPath("file.json")) {
        return JSON.stringify({ chain_spec: { bootnodes: [] } });
      }
      throw new Error(`File ${src} not found`);
    });
    const config = loadConfig(["default", "file.json"], withRelPath);
    assert.deepStrictEqual(
      config,
      parseFromJson(
        {
          ...configs.default,
          chain_spec: { ...configs.default.chain_spec, bootnodes: [] },
        },
        NodeConfiguration.fromJson,
      ),
    );
  });

  it("should apply pseudo-jq queries by replacement", () => {
    const config = loadConfig(["default", ".chain_spec.bootnodes=[]"], withRelPath);
    assert.deepStrictEqual(
      config,
      parseFromJson(
        {
          ...configs.default,
          chain_spec: { ...configs.default.chain_spec, bootnodes: [] },
        },
        NodeConfiguration.fromJson,
      ),
    );
  });

  it("should apply pseudo-jq queries by merging", () => {
    const config = loadConfig(["default", `.chain_spec+={"bootnodes": []}`], withRelPath);
    assert.deepStrictEqual(
      config,
      parseFromJson(
        {
          ...configs.default,
          chain_spec: { ...configs.default.chain_spec, bootnodes: [] },
        },
        NodeConfiguration.fromJson,
      ),
    );
  });

  it("should load config from files specified in a pseudo-jq query", () => {
    mock.method(fs, "readFileSync", (src: string) => {
      if (src === withRelPath("file.json")) {
        return JSON.stringify({ bootnodes: [] });
      }
      throw new Error(`File ${src} not found`);
    });
    const config = loadConfig(["default", ".chain_spec+=file.json"], withRelPath);
    assert.deepStrictEqual(
      config,
      parseFromJson(
        {
          ...configs.default,
          chain_spec: { ...configs.default.chain_spec, bootnodes: [] },
        },
        NodeConfiguration.fromJson,
      ),
    );
  });

  it("should stack several config entries in order from left to right", () => {
    const config = loadConfig(
      [
        "dev",
        `.chain_spec+={"bootnodes": []}`,
        `.database_base_path="/test/path"`,
        `.database_base_path="/test/path-1"`,
      ],
      withRelPath,
    );
    assert.deepStrictEqual(
      config,
      parseFromJson(
        {
          ...configs.devTiny,
          database_base_path: "/test/path-1",
          chain_spec: { ...configs.devTiny.chain_spec, bootnodes: [] },
        },
        NodeConfiguration.fromJson,
      ),
    );
  });

  it("should throw an error if an invalid json file is provided", () => {
    mock.method(fs, "readFileSync", () => "invalid json");
    assert.throws(
      () => loadConfig(["file.json"], withRelPath),
      new Error(
```
