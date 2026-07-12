---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/jam/test/e2e.ts#L98-L213'
title: bin/jam/test/e2e.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 1
chunk_total: 3
content_sha: f73699d7ae7c4e74638e5038c57afa8eda4ab18508a643d2fd4cb6f248ab6dd7
language: typescript
---
`bin/jam/test/e2e.ts` (lines 98–213)

```typescript
      collectTicketLogs(`validator-${i}`, proc, EXPECTED_TICKETS),
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

    logger.info`All ${VALIDATOR_COUNT} validators have at least ${EXPECTED_TICKETS} tickets`;
  } finally {
    await Promise.all(processes.map((proc) => terminate(proc)));
    // clean up all test databases at once by removing parent folder
    rmSync(testDbParentPath, { recursive: true, force: true });
  }
});

/**
 * Collects ticket logs until the validator has observed the expected ticket count.
 * Returns array of matched log lines.
 */
async function collectTicketLogs(prefix: string, proc: ChildProcess, expectedTickets: number): Promise<string[]> {
  const blockPattern = /🧊 Best:.+#(\d+)/;
  const matchedLines: string[] = [];
  const recentLines: string[] = [];
  let currentBlock = 0;
  let maxTickets = 0;

  return new Promise((resolve, reject) => {
    // Buffer for incomplete lines across chunks
    let remainder = "";

    const handleOutput = (data: Buffer) => {
      const output = remainder + data.toString();
      const lines = output.split("\n");

      // Last element is incomplete line (or empty if output ends with \n)
      remainder = lines.pop() ?? "";

      for (const line of lines) {
        recentLines.push(line);
        if (recentLines.length > LOG_TAIL_LINES) {
          recentLines.shift();
        }

        // Check for new blocks
        const blockMatch = blockPattern.exec(line);
        if (blockMatch !== null) {
          currentBlock = Number.parseInt(blockMatch[1], 10);
        }

        const ticketCount = parseTicketCount(line);
        if (ticketCount !== null) {
          matchedLines.push(line);
          maxTickets = Math.max(maxTickets, ticketCount);
        }
      }

      // Resolve as soon as ticket distribution has completed. Waiting for a
      // later block height makes this test depend on multi-author chain
      // convergence, even though the assertion is only about ticket gossip.
      if (maxTickets >= expectedTickets) {
        // Note: remainder is intentionally NOT flushed - it's an incomplete fragment
        // Only fully-terminated lines (processed in the loop) are counted
        resolve(matchedLines);
      }
    };

    proc?.on("error", (err) => {
      reject(`(${prefix}) Failed to start process: ${err.message}`);
    });

    proc?.on("close", (code) => {
      if (maxTickets >= expectedTickets) {
        resolve(matchedLines);
        return;
      }
      if (code !== 0 && code !== null) {
        reject(
          new Error(
            `(${prefix}) Process exited with code ${code} at block ${currentBlock}\n${formatLogTail(recentLines)}`,
          ),
        );
      } else {
        reject(new Error(`(${prefix}) Process exited early at block ${currentBlock}\n${formatLogTail(recentLines)}`));
      }
    });

    // Capture both stdout and stderr (logs might go to either)
    proc?.stdout?.on("data", handleOutput);
    proc?.stderr?.on("data", handleOutput);
  });
}

function formatLogTail(lines: string[]): string {
  if (lines.length === 0) {
    return "No process output captured.";
  }
  return [`Last ${lines.length} process output lines:`, ...lines].join("\n");
}

/**
 * Extracts ticket count from addTicket log lines.
 * Returns the maximum "total" value found (represents final ticket count).
 */
function extractTicketCount(logLines: string[]): number {
  let maxTickets = 0;

  for (const line of logLines) {
    const count = parseTicketCount(line);
    if (count !== null && count > maxTickets) {
```
