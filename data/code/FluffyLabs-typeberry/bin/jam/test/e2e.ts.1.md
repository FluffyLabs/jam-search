---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/jam/test/e2e.ts#L98-L218'
title: bin/jam/test/e2e.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 672fc9460e76225cf4375608200841796c1fcaac6096a4f9c73fcbad5eed47c4
language: typescript
---
`bin/jam/test/e2e.ts` (lines 98–218)

```typescript
      collectLogsUntilBlock(`validator-${i}`, proc, /\[addTicket\] Added ticket for epoch/, EPOCH_LENGTH),
    );

    const validatorLogs = await Promise.all(validatorLogPromises);

    // Verify each validator has expected number of tickets
    for (let i = 0; i < VALIDATOR_COUNT; i++) {
      const ticketCount = extractTicketCount(validatorLogs[i]);
      if (ticketCount < EXPECTED_TICKETS) {
        throw new Error(`Validator ${i} has ${ticketCount} tickets, expected at least ${EXPECTED_TICKETS}`);
      }
      logger.info`Validator ${i} has ${ticketCount} tickets`;
    }

    logger.info`All ${VALIDATOR_COUNT} validators have at least ${EXPECTED_TICKETS} tickets after ${EPOCH_LENGTH} blocks`;
  } finally {
    await Promise.all(processes.map((proc) => terminate(proc)));
    // clean up all test databases at once by removing parent folder
    rmSync(testDbParentPath, { recursive: true, force: true });
  }
});

/**
 * Collects log lines matching a pattern until target block is reached.
 * Returns array of matched log lines.
 */
async function collectLogsUntilBlock(
  prefix: string,
  proc: ChildProcess,
  pattern: RegExp,
  targetBlock: number,
): Promise<string[]> {
  const blockPattern = /🧊 Best block:.+#(\d+)/;
  const matchedLines: string[] = [];
  let currentBlock = 0;

  return new Promise((resolve, reject) => {
    // Buffer for incomplete lines across chunks
    let remainder = "";

    const handleOutput = (data: Buffer) => {
      const output = remainder + data.toString();
      const lines = output.split("\n");

      // Last element is incomplete line (or empty if output ends with \n)
      remainder = lines.pop() ?? "";

      for (const line of lines) {
        // Check for new blocks
        const blockMatch = blockPattern.exec(line);
        if (blockMatch !== null) {
          currentBlock = Number.parseInt(blockMatch[1], 10);
        }

        // Collect lines matching the pattern
        if (pattern.test(line)) {
          matchedLines.push(line);
        }
      }

      // Resolve when target block is reached
      if (currentBlock >= targetBlock) {
        // Note: remainder is intentionally NOT flushed - it's an incomplete fragment
        // Only fully-terminated lines (processed in the loop) are counted
        resolve(matchedLines);
      }
    };

    proc?.on("error", (err) => {
      reject(`(${prefix}) Failed to start process: ${err.message}`);
    });

    proc?.on("exit", (code) => {
      if (code !== 0 && code !== null) {
        reject(`(${prefix}) Process exited with code ${code}`);
      } else if (currentBlock >= targetBlock) {
        resolve(matchedLines);
      } else {
        reject(`(${prefix}) Process exited early at block ${currentBlock}`);
      }
    });

    // Capture both stdout and stderr (logs might go to either)
    proc?.stdout?.on("data", handleOutput);
    proc?.stderr?.on("data", handleOutput);
  });
}

/**
 * Extracts ticket count from addTicket log lines.
 * Returns the maximum "total" value found (represents final ticket count).
 */
function extractTicketCount(logLines: string[]): number {
  const ticketPattern = /\[addTicket\] Added ticket for epoch (\d+), total: (\d+)/;
  let maxTickets = 0;

  for (const line of logLines) {
    const match = ticketPattern.exec(line);
    if (match !== null) {
      const count = Number.parseInt(match[2], 10);
      if (count > maxTickets) {
        maxTickets = count;
      }
    }
  }

  return maxTickets;
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

```
