---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/in-core/is-authorized.test.ts#L92-L177
title: packages/jam/in-core/is-authorized.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 84aa0f38e59c4ffcdf3087ac09f82f3efd166187628b1a70c847c06dea470d06
language: typescript
---
`packages/jam/in-core/is-authorized.test.ts` (lines 92–177)

```typescript
  function getAuthCodeHash() {
    return blake2b.hashBytes(AUTHORIZER_PVM).asOpaque<CodeHash>();
  }

  function createStateWithService(codeHash: OpaqueHash, code: BytesBlob) {
    return InMemoryState.partial(spec, {
      timeslot: tryAsTimeSlot(16),
      services: new Map([[AUTH_SERVICE_ID, createService(AUTH_SERVICE_ID, codeHash, code)]]),
    });
  }

  it("should authorize when token matches configuration", async () => {
    const authCodeHash = getAuthCodeHash();
    const state = createStateWithService(authCodeHash, AUTHORIZER_PVM);
    const isAuthorized = new IsAuthorized(spec, PvmBackend.BuiltIn, blake2b);
    const token = BytesBlob.blobFromString("hello");

    const { fetchData } = buildPackageAndFetchData(authCodeHash, token, token);
    const result = await isAuthorized.invoke(state, tryAsCoreIndex(0), fetchData);

    assert.strictEqual(result.isOk, true, `Expected OK but got error: ${result.isError ? result.details() : ""}`);

    // Verify the authorization output starts with "Auth=<hello>"
    const outputStr = Buffer.from(result.ok.authorizationOutput.raw).toString("utf8");
    assert.ok(
      outputStr.startsWith("Auth=<hello>"),
      `Expected "Auth=<hello>" prefix but got "${outputStr.slice(0, 30)}"`,
    );

    // Verify the authorizer hash is H(code_hash ++ configuration)
    const expectedHash = blake2b.hashBlobs([authCodeHash, token]);
    assert.ok(result.ok.authorizerHash.isEqualTo(expectedHash), "authorizerHash should be H(code_hash || config)");

    // Verify gas was consumed
    assert.ok(Number(result.ok.authorizationGasUsed) > 0, "should have consumed some gas");
  });

  it("should authorize with empty token and configuration", async () => {
    const authCodeHash = getAuthCodeHash();
    const state = createStateWithService(authCodeHash, AUTHORIZER_PVM);
    const isAuthorized = new IsAuthorized(spec, PvmBackend.BuiltIn, blake2b);

    const empty = buildPackageAndFetchData(authCodeHash, BytesBlob.empty(), BytesBlob.empty());
    const result = await isAuthorized.invoke(state, tryAsCoreIndex(0), empty.fetchData);

    assert.strictEqual(result.isOk, true, `Expected OK but got error: ${result.isError ? result.details() : ""}`);
    const outputStr = Buffer.from(result.ok.authorizationOutput.raw).toString("utf8");
    assert.ok(outputStr.startsWith("Auth=<>"), `Expected "Auth=<>" prefix but got "${outputStr.slice(0, 30)}"`);
  });

  it("should fail when token does not match configuration", async () => {
    const authCodeHash = getAuthCodeHash();
    const state = createStateWithService(authCodeHash, AUTHORIZER_PVM);
    const isAuthorized = new IsAuthorized(spec, PvmBackend.BuiltIn, blake2b);

    const mismatch = buildPackageAndFetchData(
      authCodeHash,
      BytesBlob.blobFromString("wrong"),
      BytesBlob.blobFromString("right"),
    );
    const result = await isAuthorized.invoke(state, tryAsCoreIndex(0), mismatch.fetchData);

    assert.strictEqual(result.isError, true);
    assert.strictEqual(result.error, AuthorizationError.PvmFailed);
  });

  it("should fail when auth code host service is missing", async () => {
    const authCodeHash = getAuthCodeHash();
    const state = InMemoryState.partial(spec, {
      timeslot: tryAsTimeSlot(16),
      services: new Map(),
    });
    const isAuthorized = new IsAuthorized(spec, PvmBackend.BuiltIn, blake2b);

    const missing = buildPackageAndFetchData(authCodeHash, BytesBlob.empty(), BytesBlob.empty());
    const result = await isAuthorized.invoke(state, tryAsCoreIndex(0), missing.fetchData);

    assert.strictEqual(result.isError, true);
    assert.strictEqual(result.error, AuthorizationError.CodeNotFound);
  });

  it("should fail when auth code preimage is missing", async () => {
    const authCodeHash = getAuthCodeHash();
    // Service exists but with no preimages
    const emptyService = InMemoryService.new(AUTH_SERVICE_ID, {
      info: ServiceAccountInfo.create({
```
