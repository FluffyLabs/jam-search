---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/config-node/node-config.test.ts#L227-L295
title: packages/jam/config-node/node-config.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 29d31059f04e05fb2c6e7086986c46af39704c0f4267db7e56802784865bf3d1
language: typescript
---
`packages/jam/config-node/node-config.test.ts` (lines 227–295)

```typescript
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
      () => loadConfig(["default", ".chain_spec+=file.json"], withRelPath),
      new Error(
        `Error while processing '.chain_spec+=file.json': Error: Unable to load config from file.json: SyntaxError: Unexpected token 'i', "invalid json" is not valid JSON`,
      ),
    );
  });

  it("should throw an error if non-existing json file path is provided using a pseudo-jq query", () => {
    mock.method(fs, "readFileSync", () => {
      throw new Error("File not found");
    });
    assert.throws(
      () => loadConfig(["default", ".chain_spec+=file.json"], withRelPath),
      new Error(
        "Error while processing '.chain_spec+=file.json': Error: Unable to load config from file.json: Error: File not found",
      ),
    );
  });

  it("should throw an error if the right side of a pseudo-jq query is not a valid json", () => {
    mock.method(fs, "existsSync", () => false);
    assert.throws(
      () => loadConfig(["default", ".chain_spec+=invalid json"], withRelPath),
      new Error(
        `Error while processing '.chain_spec+=invalid json': Error: Unrecognized syntax 'invalid json': SyntaxError: Unexpected token 'i', "invalid json" is not valid JSON`,
      ),
    );
  });

  it("should throw an error if the provided config is neither of the valid options (inline json, file path, pseudo-jq query)", () => {
    mock.method(fs, "existsSync", () => false);
    assert.throws(
      () => loadConfig(["invalid config"], withRelPath),
      new Error("Error while processing 'invalid config': Error: Unrecognized syntax."),
    );
  });

  it("should throw an error if the provided config has valid syntax but the resulting data is not a valid node config", () => {
    assert.throws(
      () => loadConfig(["default", ".chain_spec=1"], withRelPath),
      new Error(
        "Unable to parse config: Error: [<root>] Error while parsing the value: Error: [<root>.chain_spec] Error while parsing the value: Error: [<root>.chain_spec] Expected complex type but got number",
      ),
    );
  });
});
```
