---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/bin/src/test-json.ts#L149-L172'
title: bin/src/test-json.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-04-24T09:46:09+02:00'
last_modified: '2026-04-24T09:46:09+02:00'
chunk_index: 1
chunk_total: 2
content_sha: cdc0802e256f1f4e056d1c2aa6abafc8930039ed3be14e001199701d154fc7d0
language: typescript
---
`bin/src/test-json.ts` (lines 149–172)

```typescript
    const result = processJson(jsonData, options, filePath);
    status.ok.push({ filePath, name: jsonData.name ?? filePath });
    return result;
  } catch (error) {
    status.fail.push({ filePath, name: jsonData.name ?? filePath });
    console.error(`Error running test: ${filePath}`);
    console.error((error as Error).message);
    return {};
  }
}

export function read<T extends object, K extends keyof T>(
  data: T,
  field: string & K,
  defaultValue: T[K] | undefined = undefined,
): T[K] {
  if (field in data) {
    return data[field];
  }
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  throw new Error(`Required field ${field} missing in ${JSON.stringify(data, null, 2)}`);
}
```
