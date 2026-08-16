---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/utils/shutdown.test.ts#L141-L242
title: packages/core/utils/shutdown.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 9d38388045d047fc6ff00e971ebe76bf3d8ebb5d20382be30caafa09064cb6f4
language: typescript
---
`packages/core/utils/shutdown.test.ts` (lines 141–242)

```typescript
    releaseClose();
  });

  it("does nothing after uninstall", async () => {
    const exitRec = makeExitRecorder();
    let closeCalled = false;

    const uninstall = installShutdownHandlers(
      async () => {
        closeCalled = true;
      },
      { exit: exitRec.exit, log: silentLog },
    );
    uninstall();

    process.emit("SIGTERM", "SIGTERM");

    // Give any (incorrectly registered) handler a tick to fire.
    await new Promise((resolve) => setImmediate(resolve));

    assert.strictEqual(closeCalled, false);
    assert.strictEqual(exitRec.exitCode, null);
  });

  it("is a no-op from the generic shutdown module", async () => {
    const exitRec = makeExitRecorder();
    let closeCalled = false;

    const uninstall = installGenericShutdownHandlers(
      async () => {
        closeCalled = true;
      },
      { exit: exitRec.exit, log: silentLog },
    );

    uninstall();

    assert.strictEqual(typeof uninstall, "function");
    assert.strictEqual(closeCalled, false);
    assert.strictEqual(exitRec.exitCode, null);
  });

  it("exits with code 1 when close rejects", async () => {
    const exitRec = makeExitRecorder();
    let errorLogged: string | null = null;

    uninstallers.push(
      installShutdownHandlers(
        async () => {
          throw new Error("boom");
        },
        {
          exit: exitRec.exit,
          log: {
            info: () => {},
            error: (msg) => {
              errorLogged = msg;
            },
          },
        },
      ),
    );

    process.emit("SIGTERM", "SIGTERM");

    await exitRec.exited;

    assert.strictEqual(exitRec.exitCode, 1);
    assert.ok(errorLogged !== null, "expected error to be logged");
    assert.match(errorLogged as unknown as string, /boom/);
  });

  it("exits with code 1 when close throws synchronously", async () => {
    const exitRec = makeExitRecorder();
    let errorLogged: string | null = null;

    uninstallers.push(
      installShutdownHandlers(
        () => {
          throw new Error("sync boom");
        },
        {
          exit: exitRec.exit,
          log: {
            info: () => {},
            error: (msg) => {
              errorLogged = msg;
            },
          },
        },
      ),
    );

    process.emit("SIGTERM", "SIGTERM");

    await exitRec.exited;

    assert.strictEqual(exitRec.exitCode, 1);
    assert.ok(errorLogged !== null, "expected error to be logged");
    assert.match(errorLogged as unknown as string, /sync boom/);
  });
});
```
