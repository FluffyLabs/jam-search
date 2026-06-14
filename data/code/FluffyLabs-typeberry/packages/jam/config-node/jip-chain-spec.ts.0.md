---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/config-node/jip-chain-spec.ts#L1-L87
title: packages/jam/config-node/jip-chain-spec.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: cbea21b364072652af12b5c83d6c62d81fd1883e097da0ec2ac057488a21d63f
language: typescript
---
`packages/jam/config-node/jip-chain-spec.ts` (lines 1–87)

```typescript
import { fromJson, type JsonObject } from "@typeberry/block-json";
import { type Bytes, BytesBlob } from "@typeberry/bytes";
import { Bootnode } from "@typeberry/config";
import { json } from "@typeberry/json-parser";
import { isU16 } from "@typeberry/numbers";
import { asOpaqueType, WithDebug } from "@typeberry/utils";

export function parseBootnode(v: string): Bootnode {
  const [name, ipPort] = v.split("@");
  // spliting only by last `:` in case of IPv6
  const ip = ipPort.substring(0, ipPort.lastIndexOf(":"));
  const port = ipPort.substring(ipPort.lastIndexOf(":") + 1);
  if (name === "" || ip === "" || port === "") {
    throw new Error(`Invalid bootnode format, expected: <name>@<ip>:<port>, got: "${v}"`);
  }

  const portNumber = Number.parseInt(port, 10);
  if (!isU16(portNumber)) {
    throw new Error(`Invalid port number: "${port}"`);
  }

  // TODO [ToDr] we should probably validate the name!
  return Bootnode.new(asOpaqueType(name), ip, portNumber);
}

/**
 * Configuration file for any blockchain network built on the JAM protocol
 *
 * Provides all the essential information that a new node
 * needs to join, connect to others, and understand the blockchain's starting point
 *
 *  https://github.com/polkadot-fellows/JIPs/blob/90f809b84a9913a821437225f085cf5153870212/JIP-4.md#jip-4-chainspec-file
 */
export class JipChainSpec extends WithDebug {
  /** Optional list of initial contact points for a new node joining the network */
  readonly bootnodes?: Bootnode[];
  /** Human-readable identifier for the network */
  readonly id: string;
  /** Contains the serialized header of the first `block 0` */
  readonly genesisHeader: BytesBlob;
  /**
   * Initial state of the blockchain at the moment of its creation
   *
   * - `key`: is 31-byte object identifier
   * - `value`: is the data stored at this location, as BytesBlob of any length.
   */
  readonly genesisState: Map<Bytes<31>, BytesBlob>;

  static fromJson = json.object<JsonObject<JipChainSpec>, JipChainSpec>(
    {
      bootnodes: json.optional(json.array(json.fromString(parseBootnode))),
      id: "string",
      genesis_header: fromJson.bytesBlobNoPrefix,
      genesis_state: json.map(fromJson.bytesNNoPrefix(31), fromJson.bytesBlobNoPrefix),
    },
    (o) =>
      JipChainSpec.create({
        bootnodes: o.bootnodes,
        id: o.id,
        genesisHeader: o.genesis_header,
        genesisState: o.genesis_state ?? new Map(),
      }),
  );

  static create({
    bootnodes = [],
    id = "",
    genesisHeader = BytesBlob.empty(),
    genesisState = new Map(),
  }: {
    bootnodes?: Bootnode[];
    id?: string;
    genesisHeader?: BytesBlob;
    genesisState?: Map<Bytes<31>, BytesBlob>;
  }) {
    return new JipChainSpec({ bootnodes, id, genesisHeader, genesisState });
  }

  private constructor(data: Pick<JipChainSpec, keyof JipChainSpec>) {
    super();

    this.bootnodes = data.bootnodes;
    this.id = data.id;
    this.genesisHeader = data.genesisHeader;
    this.genesisState = data.genesisState;
  }
}
```
