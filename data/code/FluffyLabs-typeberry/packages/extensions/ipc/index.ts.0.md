---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/extensions/ipc/index.ts#L1-L129
title: packages/extensions/ipc/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 2
content_sha: 85e66740060966b90c450d05a342e2b5d262ed7cc50ecc18d947aad37f652ea7
language: typescript
---
`packages/extensions/ipc/index.ts` (lines 1–129)

```typescript
import {
  type BlockView,
  type Header,
  type HeaderHash,
  type HeaderView,
  type StateRootHash,
  type TimeSlot,
  tryAsTimeSlot,
} from "@typeberry/block";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import type { ChainSpec } from "@typeberry/config";
import { v1 } from "@typeberry/fuzz-proto";
import { HASH_SIZE, type WithHash } from "@typeberry/hash";
import { ce129, up0 } from "@typeberry/jamnp-s";
import { Listener } from "@typeberry/listener";
import { Logger } from "@typeberry/logger";
import { tryAsU32 } from "@typeberry/numbers";
import { StateEntries } from "@typeberry/state-merkleization";
import { assertNever, Result } from "@typeberry/utils";
import { startJamnpIpcServer } from "./jamnp/server.js";
import { startIpcServer } from "./server.js";

export interface ExtensionApi {
  nodeName: string;
  chainSpec: ChainSpec;
  bestHeader: Listener<WithHash<HeaderHash, HeaderView>>;
}

export function startExtension(api: ExtensionApi) {
  return startJamnpExtension(api);
}

export enum FuzzVersion {
  V1 = 1,
}

export interface FuzzTargetApi {
  nodeName: string;
  nodeVersion: v1.Version;
  gpVersion: v1.Version;
  chainSpec: ChainSpec;
  importBlock: (block: BlockView) => Promise<Result<StateRootHash, string>>;
  resetState: (header: Header, state: StateEntries, ancestry: [HeaderHash, TimeSlot][]) => Promise<StateRootHash>;
  getPostSerializedState: (hash: HeaderHash) => Promise<StateEntries | null>;
  getBestStateRootHash(): Promise<StateRootHash>;
}

export function startFuzzTarget(version: FuzzVersion, socket: string | null, api: FuzzTargetApi) {
  const socketName = socket ?? "jam_target.sock";

  if (version === FuzzVersion.V1) {
    return startIpcServer(socketName, (sender) => v1.FuzzTarget.new(FuzzHandler.new(api), sender, api.chainSpec));
  }

  assertNever(version);
}

function startJamnpExtension(api: ExtensionApi) {
  const announcements = new Listener<up0.Announcement>();
  let bestBlock: up0.HashAndSlot | null = null;

  api.bestHeader.on((headerWithHash) => {
    const header = headerWithHash.data.materialize();
    const hash = headerWithHash.hash;
    const final = up0.HashAndSlot.create({ hash, slot: header.timeSlotIndex });
    bestBlock = final;
    announcements.emit(up0.Announcement.create({ header, final }));
  });

  const getHandshake = () => {
    const final =
      bestBlock ?? up0.HashAndSlot.create({ hash: Bytes.zero(HASH_SIZE).asOpaque(), slot: tryAsTimeSlot(0) });
    return up0.Handshake.create({ final, leafs: [] });
  };

  const getBoundaryNodes = () => {
    return [];
  };

  const getKeyValuePairs = (_hash: HeaderHash, startKey: ce129.Key) => {
    const value = BytesBlob.blobFromNumbers([255, 255, 0, 0]);
    return [ce129.KeyValuePair.new(startKey, value)];
  };

  return startJamnpIpcServer(
    api.nodeName,
    api.chainSpec,
    announcements,
    getHandshake,
    getBoundaryNodes,
    getKeyValuePairs,
  );
}

const logger = Logger.new(import.meta.filename, "ext-ipc");

class FuzzHandler implements v1.FuzzMessageHandler {
  static new(api: FuzzTargetApi) {
    return new FuzzHandler(api);
  }

  private constructor(public readonly api: FuzzTargetApi) {}

  async getSerializedState(value: HeaderHash): Promise<v1.KeyValue[]> {
    const state = await this.api.getPostSerializedState(value);
    if (state === null) {
      logger.warn`Fuzzer requested non-existing state for: ${value}`;
      return [];
    }

    return Array.from(state).map(([key, value]) => {
      return {
        key,
        value,
      };
    });
  }

  initialize(value: v1.Initialize): Promise<StateRootHash> {
    const { keyvals, header, ancestry } = value;
    const entries = StateEntries.fromEntriesUnsafe(keyvals.map(({ key, value }) => [key.asOpaque(), value]));
    const root = this.api.resetState(
      header,
      entries,
      ancestry.map((x) => [x.headerHash, x.slot]),
    );
    return root;
  }

```
