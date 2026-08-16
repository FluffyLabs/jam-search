---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api-node/config.ts#L118-L252
title: packages/workers/api-node/config.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 1
chunk_total: 3
content_sha: e4e68cb4b1741e5a0c1b41d98b9ceebf4bb9f1e6995a413eccb3f6f666085dd0
language: typescript
---
`packages/workers/api-node/config.ts` (lines 118–252)

```typescript
        FjallStates.open(this.chainSpec, this.blake2b, fjall),
      ]);
    } catch (e) {
      if (ownsFjall) {
        await fjall.close();
      }
      throw e;
    }

    return {
      getBlocksDb: () => {
        if (blocks === null) {
          throw new Error("Fjall database is closed.");
        }
        return blocks;
      },
      getStatesDb: () => {
        if (states === null) {
          throw new Error("Fjall database is closed.");
        }
        return states;
      },
      close: async () => {
        blocks = null;
        states = null;
        if (ownsFjall) {
          await fjall.close();
        }
      },
    };
  }

  /** Convert this config into a thread-transferable object. */
  intoTransferable(paramsCodec: Encode<T>): TransferableConfig {
    return {
      databaseBackend: "fjall",
      nodeName: this.nodeName,
      chainSpec: this.chainSpec,
      workerParams: Encoder.encodeObject(paramsCodec, this.workerParams, this.chainSpec).raw,
      dbPath: this.dbPath,
      workerPorts: Array.from(this.ports.entries()).map(([name, port]) => [name, port.intoTransferable()]),
      cacheSizeBytes: this.cacheSizeBytes,
    };
  }
}

/** Config that's safe to transfer between worker threads. */
export type TransferableConfig = {
  databaseBackend: PersistentBackend;
  nodeName: string;
  chainSpec: ChainSpec;
  workerParams: Uint8Array;
  dbPath: string;
  workerPorts: [string, TransferablePort][];
  cacheSizeBytes?: number;
};

async function decodeTransferableConfig<T>(decodeParams: Decode<T>, config: TransferableConfig) {
  const blake2b = await Blake2b.createHasher();
  const chainSpec = ChainSpec.new(config.chainSpec);
  const workerParams = Decoder.decodeObject(decodeParams, config.workerParams, chainSpec);
  const ports = new Map(config.workerPorts.map(([name, port]) => [name, ThreadPort.fromTransferable(chainSpec, port)]));

  return {
    blake2b,
    chainSpec,
    workerParams,
    ports,
  };
}

/** Restore a persistent worker config from its transferable form. */
export async function persistentConfigFromTransferable<T>(
  decodeParams: Decode<T>,
  config: TransferableConfig,
): Promise<PersistentWorkerConfig<T>> {
  return FjallWorkerConfig.fromTransferable(decodeParams, config);
}

/**
 * Collect the transferable objects (communication ports) embedded in a config.
 *
 * `MessagePort`s can only be transferred, not structurally cloned, so they have to
 * be listed in the `postMessage` transfer list. Omitting them results in a
 * `DataCloneError`.
 */
export function configTransferList(config: TransferableConfig): MessagePort[] {
  return config.workerPorts.map(([, transferable]) => transferable.port);
}

/**
 * In-memory (direct) worker using serialized state database.
 *
 * Note the database is always empty, and needs to be initialized.
 */
export class InMemWorkerConfig<T = undefined> implements WorkerConfig<T, BlocksDb, SerializedStatesDb> {
  static new<T>({
    nodeName,
    chainSpec,
    workerParams,
    blake2b,
  }: {
    nodeName: string;
    chainSpec: ChainSpec;
    workerParams: T;
    blake2b: Blake2b;
  }) {
    return new InMemWorkerConfig(nodeName, chainSpec, workerParams, blake2b);
  }

  private readonly blocks: InMemoryBlocks;
  private readonly states: InMemorySerializedStates;

  private constructor(
    public readonly nodeName: string,
    public readonly chainSpec: ChainSpec,
    public readonly workerParams: T,
    public readonly blake2b: Blake2b,
  ) {
    this.blocks = InMemoryBlocks.new();
    this.states = InMemorySerializedStates.withHasher({ chainSpec, blake2b });
  }

  async openDatabase(
    _options: { readonly: boolean } = { readonly: true },
  ): Promise<RootDb<BlocksDb, SerializedStatesDb>> {
    // opening/closing db doesn't do anything, we persist the state.
    return {
      getBlocksDb: () => this.blocks,
      getStatesDb: () => this.states,
      close: async () => {},
    };
  }
}

```
