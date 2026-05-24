---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/jam/test/e2e.ts#L212-L266
title: bin/jam/test/e2e.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 2
chunk_total: 3
content_sha: a90ae9ed32c7c1f54be49059cc77613a95d7d459912ed4744068ceef48b9b1cb
language: typescript
---
`bin/jam/test/e2e.ts` (lines 212–266)

```typescript
    proc?.on("exit", (code, signal) => {
      reject(`(${prefix}) Process exited (code: ${code}, signal: ${signal})`);
    });
    proc?.stderr?.on("data", (data: Buffer) => {
      logger.error`(${prefix}) ${data.toString()}`;
    });

    proc?.stdout?.on("data", (data: Buffer) => {
      const output = data.toString();
      logger.info`(${prefix}) ${output}`;

      const match = bestBlockPattern.exec(output);
      if (match !== null) {
        const blockNum = Number.parseInt(match[1], 10);
        logger.info`(${prefix}) Got block ${blockNum}`;
        if (check(blockNum)) {
          resolve(`(${prefix}) Finished successfuly.`);
        }
      }
    });
  });
}

async function terminate(jamProcess: ChildProcess | null) {
  if (jamProcess !== null && !jamProcess.killed) {
    logger.error`Terminating process.`;
    const grace = promises.setTimeout(SHUTDOWN_GRACE_PERIOD);
    jamProcess.kill("SIGINT");
    jamProcess.stdin?.end();
    jamProcess.stdout?.destroy();
    jamProcess.stderr?.destroy();
    await grace;
    logger.error`Process shutdown timing out. Killing`;
    jamProcess.kill("SIGKILL");
  }
}

async function start(
  options: { devIndex: number | "all" | null; args?: string[]; timeout?: number } = { devIndex: "all" },
) {
  const devArgs = options.devIndex === null ? ["--", "--config=dev", "--name=test"] : ["dev", `${options.devIndex}`];
  const args = options.args !== undefined ? [...devArgs, ...options.args] : devArgs;
  const processTimeout = options.timeout ?? TEST_TIMEOUT;
  const spawned = spawn("npm", ["start", ...args], {
    cwd: process.cwd(),
  });
  const timeout = setTimeout(() => {
    logger.error`Test timing out, terminating the process.`;
    terminate(spawned);
  }, processTimeout);
  spawned.on("exit", () => {
    clearTimeout(timeout);
  });
  return spawned;
}
```
