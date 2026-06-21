---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/common.ts#L385-L479
title: bin/test-runner/common.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 3
chunk_total: 4
content_sha: 3868f813d992f91917fb0b84172f592f9e3543009dd408f5e1c027dae011a5b3
language: typescript
---
`bin/test-runner/common.ts` (lines 385–479)

```typescript
    // path to the file includes each part of our "test path" definition.
    if (!path.split("/").every((pathPart) => fullPath.includes(pathPart))) {
      continue;
    }
    const specs = chainSpecs.length > 0 ? chainSpecs : [tinyChainSpec];
    const matchChainSpecPath = chainSpecs.length > 0;
    for (const chainSpec of specs) {
      // if we care about the chain spec, we also need to match the path
      if (matchChainSpecPath && !fullPath.includes(chainSpec.name)) {
        continue;
      }

      for (const parser of parsers) {
        if (parser.kind === testFile.bin && testContent.kind === testFile.bin) {
          try {
            const parsedTest = Decoder.decodeObject(parser.codec, testContent.content, chainSpec);
            matchingRunners.push(...createTestDefinitions(path, run, variants, parsedTest, chainSpec, globalOptions));
          } catch (e) {
            handleError(path, e);
          }
        }

        if (parser.kind === testFile.json && testContent.kind === testFile.json) {
          try {
            const parsedTest = parseFromJson(testContent.content, parser.fromJson);
            matchingRunners.push(...createTestDefinitions(path, run, variants, parsedTest, chainSpec, globalOptions));
          } catch (e) {
            handleError(path, e);
          }
        }
      }
    }
  }

  if (matchingRunners.length > 0) {
    return matchingRunners;
  }

  return [
    {
      shouldSkip: false,
      runner: "Invalid",
      file: fileName,
      variant: noneVariant,
      test: () => {
        for (const [runner, error] of errors) {
          logger.error`[${runner}] Parsing error: ${error}`;
        }

        fail(`Unrecognized test case in ${fileName}`);
      },
    },
  ];

  function createTestDefinitions(
    path: string,
    run: RunFunction<T, V>,
    variants: V[],
    parsedTest: T,
    chainSpec: ChainSpec,
    globalOptions: GlobalsOptions,
  ) {
    const results: TestAndRunner<V>[] = [];
    let possibleVariants: V[] = variants.length === 0 ? [noneVariant] : variants;
    // a bit hacky way to detect pvm-variants and filtering.
    const idx = ALL_PVMS.indexOf(possibleVariants[0] as SelectedPvm);
    if (idx !== -1) {
      possibleVariants = possibleVariants.filter((x) => globalOptions.pvms.includes(x as SelectedPvm));
    }

    for (const variant of possibleVariants) {
      results.push({
        shouldSkip: false,
        runner: path,
        file: fileName,
        variant,
        test: (ctx) => {
          logger.log`[${path}:${variant}] running test from ${fileName} (spec: ${chainSpec.name})`;
          logger.trace` ${util.inspect(parsedTest, true, 2)}`;
          return run(
            parsedTest,
            {
              test: ctx,
              path: fullPath,
              chainSpec,
              accumulateSequentially: globalOptions.accumulateSequentially,
            },
            variant,
          );
        },
      });
    }
    return results;
  }
}
```
