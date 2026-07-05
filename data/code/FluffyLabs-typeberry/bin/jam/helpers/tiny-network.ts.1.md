---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/jam/helpers/tiny-network.ts#L118-L185
title: bin/jam/helpers/tiny-network.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 97125c3f7eb22bf0921f0e2f88c1ced95e66af2aa571d485ec79f9a22dc972f5
language: typescript
---
`bin/jam/helpers/tiny-network.ts` (lines 118–185)

```typescript
          console.error(`${color}[node-${nodeIndex}]${RESET} ${line}`);
        });
      }
    } else {
      // File mode: write to log files
      const logFile = join(LOGS_DIR, `node-${i}.log`);
      const logFd = openSync(logFile, "w");

      child = spawn("npm", nodeArgs, {
        stdio: ["ignore", logFd, logFd],
        cwd: process.cwd(),
      });
    }

    children.push(child);

    if (child.pid !== undefined) {
      console.log(`    PID: ${child.pid}`);
    } else {
      console.error(`    Failed to start node ${i}`);
    }

    // Wait 1 second before starting next node to avoid networking issues
    if (i < NUM_NODES - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log("");
  console.log("All nodes started successfully!");
  console.log("");
  if (!liveMode) {
    console.log("To view logs:");
    console.log(`  tail -f ${LOGS_DIR}/node-0.log`);
    console.log(`  tail -f ${LOGS_DIR}/node-*.log  # all logs`);
    console.log("");
  }
  console.log("Press Ctrl+C to stop all nodes.");

  // Keep the process running
  await new Promise(() => {});
}

async function main() {
  const args = process.argv.slice(2);
  const fastForward = args.includes(FAST_FORWARD_ARG);
  const liveMode = args.includes(LIVE_ARG);
  const userArgs = args.filter((a) => a !== FAST_FORWARD_ARG && a !== LIVE_ARG);

  // Handle termination signals
  process.on("SIGINT", () => {
    stopAllNodes();
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    stopAllNodes();
    process.exit(0);
  });

  await startTinyNetwork(fastForward, liveMode, userArgs);
}

main().catch((err) => {
  console.error("Error:", err);
  stopAllNodes();
  process.exit(1);
});
```
