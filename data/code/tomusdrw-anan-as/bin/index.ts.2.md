---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/bin/index.ts#L224-L340'
title: bin/index.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-07-10T09:46:52Z'
last_modified: '2026-07-10T09:46:52Z'
chunk_index: 2
chunk_total: 5
content_sha: 4247e6f57e5e851c04c87a74f5a1b64d1e153c87e7964874b998d00182c74512
language: typescript
---
`bin/index.ts` (lines 224–340)

```typescript
    const id = pvmStart(program);
    let gas = initialGas;
    let pc = initialPc;

    for (;;) {
      const pause = pvmResume(id, gas, pc, logs);
      if (!pause) {
        throw new Error("pvmResume returned null");
      }

      if (pause.status === STATUS.HOST && pause.exitCode === LOG_HOST_CALL_INDEX && logHostCall) {
        printLogHostCall(id, pause.registers);

        // Set r7 = WHAT
        const regs = pause.registers;
        regs[7] = WHAT;
        pvmSetRegisters(id, regs);

        // Deduct gas and advance PC
        gas = pause.gas >= LOG_GAS_COST ? pause.gas - LOG_GAS_COST : 0n;
        pc = pause.nextPc;
      } else {
        console.warn(`Unhandled host call: ecalli ${pause.exitCode}. Finishing.`);
        break;
      }
    }

    // Dump memory regions before destroying the VM
    for (const region of dumpRegions) {
      const data = pvmReadMemory(id, region.address, region.length);
      const addrHex = `0x${region.address.toString(16)}`;
      if (data) {
        console.log(`\nMemory @ ${addrHex} (${region.length} bytes):`);
        for (let off = 0; off < data.length; off += 16) {
          const addr = region.address + off;
          const slice = Array.from(data.slice(off, Math.min(off + 16, data.length)));
          const hex = slice.map((b: number) => b.toString(16).padStart(2, "0")).join(" ");
          const ascii = slice.map((b: number) => (b >= 0x20 && b < 0x7f ? String.fromCharCode(b) : ".")).join("");
          console.log(`  ${addr.toString(16).padStart(8, "0")}:  ${hex.padEnd(47)}  ${ascii}`);
        }
      } else {
        console.log(`\nMemory @ ${addrHex}: <page fault>`);
      }
    }

    const result = pvmDestroy(id);
    console.log(`Status: ${result?.status}`);
    console.log(`Exit code: ${result?.exitCode}`);
    console.log(`Program counter: ${result?.pc}`);
    console.log(`Gas remaining: ${result?.gas}`);
    console.log(`Registers: [${result?.registers.join(", ")}]`);
    console.log(`Result: [${hexEncode(result?.result ?? [])}]`);
  } catch (error) {
    console.error(`Error running ${programFile}:`, error);
    process.exit(1);
  }
}

function handleReplayTrace(args: string[]) {
  const { values, positionals: files } = parseArgs({
    args,
    allowPositionals: true,
    options: {
      "no-metadata": { type: "boolean", default: false },
      "no-verify": { type: "boolean", default: false },
      "no-logs": { type: "boolean", default: false },
      "no-log-host-call": { type: "boolean", default: false },
      help: { type: "boolean", short: "h", default: false },
    },
  });

  if (values.help) {
    console.log(HELP_TEXT);
    return;
  }

  if (files.length === 0) {
    console.error("Error: No trace file provided for replay-trace command.");
    console.error("Usage: anan-as replay-trace [--no-metadata] [--no-verify] [--no-logs] <trace.log>");
    process.exit(1);
  }
  if (files.length > 1) {
    console.error("Error: Only one trace file can be replayed at a time.");
    console.error("Usage: anan-as replay-trace [--no-metadata] [--no-verify] [--no-logs] <trace.log>");
    process.exit(1);
  }

  const file = files[0];
  const hasMetadata = values["no-metadata"] ? HasMetadata.No : HasMetadata.Yes;
  const verify = !values["no-verify"];
  const logs = !values["no-logs"];
  const logHostCall = !values["no-log-host-call"];

  try {
    const summary = replayTraceFile(file, {
      logs,
      hasMetadata,
      verify,
      logHostCall,
    });

    console.log(`✅ Replay complete: ${summary.ecalliCount} ecalli entries`);
    console.log(`Status: ${summary.termination.type}`);
    console.log(`Program counter: ${summary.termination.pc}`);
    console.log(`Gas remaining: ${summary.termination.gas}`);
  } catch (error) {
    console.error(`Error replaying trace ${file}:`, error);
    process.exit(1);
  }
}

function parseGas(gasStr?: string): bigint {
  if (gasStr === undefined) {
    return BigInt(10_000);
  }

  // Reject floats and non-integer strings
```
