---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/utils/compatibility.ts#L1-L104
title: packages/core/utils/compatibility.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: 69a2626e8db35c83c4e2a51d836db5587a9acf2825db26f9e52a9af2c78d12bd
language: typescript
---
`packages/core/utils/compatibility.ts` (lines 1–104)

```typescript
import { env } from "./env.js";

export enum GpVersion {
  V0_7_1 = "0.7.1",
  V0_7_2 = "0.7.2",
}

export enum TestSuite {
  W3F_DAVXY = "w3f-davxy",
}

// NOTE: Also acts as a supported versions
const ALL_VERSIONS_IN_ORDER = [GpVersion.V0_7_1, GpVersion.V0_7_2];

export const DEFAULT_SUITE = TestSuite.W3F_DAVXY;
export const DEFAULT_VERSION = GpVersion.V0_7_2;

export let CURRENT_VERSION = parseCurrentVersion(env.GP_VERSION) ?? DEFAULT_VERSION;
export let CURRENT_SUITE = parseCurrentSuite(env.TEST_SUITE) ?? DEFAULT_SUITE;

function parseCurrentVersion(env?: string): GpVersion | undefined {
  if (env === undefined) {
    return undefined;
  }
  for (const v of Object.values(GpVersion)) {
    if (env === v) {
      return v;
    }
  }
  throw new Error(
    `Configured environment variable GP_VERSION is unknown: '${env}'. Use one of: ${ALL_VERSIONS_IN_ORDER}`,
  );
}

function parseCurrentSuite(env?: string): TestSuite | undefined {
  if (env === undefined) {
    return undefined;
  }
  for (const s of Object.values(TestSuite)) {
    if (env === s) {
      return s;
    }
  }
  throw new Error(
    `Configured environment variable TEST_SUITE is unknown: '${env}'. Use one of: ${Object.values(TestSuite)}`,
  );
}

export class Compatibility {
  static override(version?: GpVersion) {
    CURRENT_VERSION = version ?? DEFAULT_VERSION;
  }

  static overrideSuite(suite: TestSuite) {
    CURRENT_SUITE = suite;
  }

  static is(...version: GpVersion[]) {
    if (CURRENT_VERSION === undefined) {
      return version.includes(DEFAULT_VERSION);
    }
    return version.includes(CURRENT_VERSION);
  }

  static isSuite(suite: TestSuite, version?: GpVersion) {
    if (CURRENT_SUITE === undefined) {
      return false;
    }

    const isCorrectGPVersion = version === undefined || Compatibility.is(version);
    return suite === CURRENT_SUITE && isCorrectGPVersion;
  }

  static isGreaterOrEqual(version: GpVersion) {
    const index = ALL_VERSIONS_IN_ORDER.indexOf(version);
    if (index === -1) {
      throw new Error(`Invalid version: ${version}. Not found amongst supported versions: ${ALL_VERSIONS_IN_ORDER}`);
    }
    return Compatibility.is(...ALL_VERSIONS_IN_ORDER.slice(index));
  }

  /**
   * Allows selecting different values for different Gray Paper versions from one record.
   *
   * fallback The default value to return if no value is found for the current.
   * versions A record mapping versions to values, checking if the version is greater or equal to the current version.
   * @returns The value for the current version, or the default value.
   */
  static selectIfGreaterOrEqual<T>({
    fallback,
    versions,
  }: {
    fallback: T;
    versions: Partial<Record<GpVersion, T>>;
  }): T {
    for (const version of ALL_VERSIONS_IN_ORDER.toReversed()) {
      const value = versions[version];
      if (value !== undefined && Compatibility.isGreaterOrEqual(version)) {
        return value;
      }
    }
    return fallback;
  }
}
```
