---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/config-node/node-config.test.ts#L106-L234
title: packages/jam/config-node/node-config.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 1
chunk_total: 3
content_sha: 319a2e4fee572ecbb9839c85637449fac6f1797e707980e2a589f104a770457c
language: typescript
---
`packages/jam/config-node/node-config.test.ts` (lines 106–234)

```typescript
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
        `Unable to load config from file.json: SyntaxError: Unexpected token 'i', "invalid json" is not valid JSON`,
      ),
    );
  });

  it("should throw an error if non-existing json file path is provided", () => {
    mock.method(fs, "readFileSync", () => {
      throw new Error("File not found");
    });
    assert.throws(
      () => loadConfig(["file.json"], withRelPath),
      new Error("Unable to load config from file.json: Error: File not found"),
    );
  });

  it("should throw an error if an invalid json file is provided using a pseudo-jq query", () => {
    mock.method(fs, "readFileSync", () => "invalid json");
    assert.throws(
```
