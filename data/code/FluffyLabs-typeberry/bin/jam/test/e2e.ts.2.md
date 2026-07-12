---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/jam/test/e2e.ts#L208-L289
title: bin/jam/test/e2e.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 1638b6878b251e7dedf188897e1f9e3003b9b113a66e6f9230389398edf34ed6
language: typescript
---
`bin/jam/test/e2e.ts` (lines 208–289)

```typescript
function extractTicketCount(logLines: string[]): number {
  let maxTickets = 0;

  for (const line of logLines) {
    const count = parseTicketCount(line);
    if (count !== null && count > maxTickets) {
      maxTickets = count;
    }
  }

  return maxTickets;
}

function parseTicketCount(line: string): number | null {
  const ticketPattern = /\[addTicket\] Added ticket for epoch (\d+), total: (\d+)/;
  const match = ticketPattern.exec(line);
  if (match === null) {
    return null;
  }
  return Number.parseInt(match[2], 10);
}

async function listenForBestBlocks(prefix: string, proc: ChildProcess, check: (blockNum: number) => boolean) {
  return new Promise((resolve, reject) => {
    proc?.on("error", (err) => {
      reject(`(${prefix}) Failed to start process: ${err.message}`);
    });
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
  const devArgs = options.devIndex === null ? ["--config=dev", "--name=test"] : ["dev", `${options.devIndex}`];
  const args = options.args !== undefined ? [...devArgs, ...options.args] : devArgs;
  const processTimeout = options.timeout ?? TEST_TIMEOUT;
  const spawned = spawn("npm", ["start", "--", ...args], {
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
