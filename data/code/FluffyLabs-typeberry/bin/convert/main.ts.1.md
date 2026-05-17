---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/convert/main.ts#L130-L270
title: bin/convert/main.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 1
chunk_total: 3
content_sha: 4a228eada28666dcba45d9dfa7ce66ece6de0fe42d86c1bbca50cbb75229060f
language: typescript
---
`bin/convert/main.ts` (lines 130–270)

```typescript
      console.info("💡 Your data is available in the 'data' variable");
      console.info("🔍 Try: data, inspect(data), toJson(data)");
      console.info("❓ Type .help for REPL commands or .exit to quit\n");

      const replServer = startRepl({
        prompt: `${type.name}> `,
        useColors: true,
      });

      replServer.defineCommand("load", {
        help: "Reload the input file and updata data: .load <file> [process]",
        async action(input: string) {
          const [file, process] = input.trim().split(/\s+/);
          const processOption = process ?? args.process;
          if (file === "") {
            console.error("❌ No file specified");
            this.displayPrompt();
            return;
          }
          try {
            const { processed } = await loadAndProcessDataFile(
              file,
              withRelPath,
              args.flavor,
              args.type,
              processOption,
            );
            replServer.context.data = processed;
            console.info("✅ File reloaded successfully!");
            console.info("📁 Current file:", file);
            if (processOption !== undefined) {
              console.info("⚙️ Process:", processOption);
            }
          } catch (error) {
            console.error("❌ Error reloading file:", error);
          }

          this.displayPrompt();
        },
      });

      reset();
      replServer.on("reset", reset);

      function reset() {
        // Make the data available in the REPL context
        replServer.context.data = data;

        // Add utility functions to the context
        replServer.context.inspect = inspect;
        replServer.context.type = type;
        replServer.context.toJson = toJson;
        replServer.context.Bytes = Bytes;
        replServer.context.BytesBlob = BytesBlob;
      }

      return;
    }
    default:
      assertNever(outputFormat);
  }
}

function toJson(data: unknown) {
  return JSON.stringify(
    data,
    (_key, value) => {
      if (value instanceof BytesBlob) {
        return value.toString();
      }

      if (value instanceof HashDictionary) {
        return Object.fromEntries(Array.from(value).map(([key, val]) => [key.toString(), val]));
      }

      if (value instanceof Map) {
        return Object.fromEntries(value.entries());
      }

      if (value instanceof ObjectView) {
        return value.materialize();
      }

      return value;
    },
    2,
  );
}

function processOutput(
  spec: ChainSpec,
  blake2b: Blake2b,
  data: unknown,
  type: SupportedType,
  process: string,
): {
  processed: unknown;
  type: SupportedType;
} {
  if (process === "") {
    return { processed: data, type };
  }

  if (type.process === undefined || !type.process.options.includes(process)) {
    throw new Error(`Unsupported processing: '${process}' for '${type.name}'`);
  }
  const processed = type.process.run(spec, data, process, blake2b);
  return {
    processed: processed.value,
    type: {
      ...type,
      name: `${type.name}(${process})`,
      // use encoding from processed type
      encode: processed.encode,
    },
  };
}

async function loadAndProcessDataFile(
  file: string | undefined,
  withRelPath: (v: string) => string,
  flavor: KnownChainSpec,
  decodeType: SupportedType,
  process: string,
) {
  const blake2b = Blake2b.createHasher();
  const input = loadInputFile(file, withRelPath);
  const spec = getChainSpec(flavor);

  let data: unknown;

  if (input.type === "blob") {
    if (decodeType.decode === undefined) {
      throw new Error(`${decodeType.name} does not support decoding from binary data.`);
    }
    const decoder = typeof decodeType.decode === "function" ? decodeType.decode(spec) : decodeType.decode;
    data = Decoder.decodeObject(decoder, input.data, spec);
  } else if (input.type === "json") {
    if (decodeType.json === undefined) {
      throw new Error(`${decodeType.name} does not support reading from JSON.`);
    }
```
