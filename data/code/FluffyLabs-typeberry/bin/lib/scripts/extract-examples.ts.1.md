---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/lib/scripts/extract-examples.ts#L111-L185
title: bin/lib/scripts/extract-examples.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 2
content_sha: a92f106e98b7bbf8152787732d493b70a93e328838e56a4bc6e2102c7b224545
language: typescript
---
`bin/lib/scripts/extract-examples.ts` (lines 111–185)

```typescript
    let cleanedCode = lines.map((line) => (line.trim() === "" ? "" : line.slice(minIndent))).join("\n");

    // Convert dynamic imports to static imports for better readability in docs
    cleanedCode = convertDynamicImportsToStatic(cleanedCode);

    examples[name] = cleanedCode;
  }

  return examples;
}

/**
 * Get all example test files
 */
function getAllExampleFiles(): string[] {
  const files = fs.readdirSync(EXAMPLES_DIR);
  return files.filter((file) => file.endsWith(".test.ts")).map((file) => path.join(EXAMPLES_DIR, file));
}

/**
 * Extract all examples from all test files
 */
function extractAllExamples(): Record<string, string> {
  const allExamples: Record<string, string> = {};
  const files = getAllExampleFiles();

  for (const file of files) {
    const examples = extractExamples(file);
    Object.assign(allExamples, examples);
  }

  return allExamples;
}

/**
 * Update README with extracted examples
 */
function updateReadme(examples: Record<string, string>): void {
  let readme = fs.readFileSync(README_PATH, "utf-8");

  // Replace example placeholders with actual code
  // Format: <!-- example-code:name -->...<!-- /example-code:name -->
  for (const [name, code] of Object.entries(examples)) {
    const placeholder = `<!-- example-code:${name} -->`;
    const endPlaceholder = `<!-- /example-code:${name} -->`;

    const placeholderRegex = new RegExp(
      `${placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?${endPlaceholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
      "g",
    );

    const replacement = `${placeholder}\n\`\`\`typescript\n${code}\n\`\`\`\n${endPlaceholder}`;

    if (readme.includes(placeholder)) {
      readme = readme.replace(placeholderRegex, replacement);
    }
  }

  fs.writeFileSync(README_PATH, readme);
}

// Main execution
console.log("Extracting examples from test files...");
const examples = extractAllExamples();
console.log(`Found ${Object.keys(examples).length} examples`);

console.log("Updating README.md...");
updateReadme(examples);
console.log("README.md updated successfully!");

// Print summary
console.log("\nExtracted examples:");
for (const name of Object.keys(examples)) {
  console.log(`  - ${name}`);
}
```
