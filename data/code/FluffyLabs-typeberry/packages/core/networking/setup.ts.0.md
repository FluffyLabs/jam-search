---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/networking/setup.ts#L1-L108
title: packages/core/networking/setup.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 3
content_sha: eb57bae7f031774d0fc1384da81ede6b45bfeefe85d529d9b7d87d6fb407a5b2
language: typescript
---
`packages/core/networking/setup.ts` (lines 1–108)

```typescript
import QuicLogger, { formatting, LogLevel, StreamHandler } from "@matrixai/logger";
import { events, QUICClient, type QUICConnection, QUICServer, QUICSocket } from "@matrixai/quic";
import { BytesBlob } from "@typeberry/bytes";
import type { Ed25519Pair } from "@typeberry/crypto/ed25519.js";
import { Level, Logger } from "@typeberry/logger";
import { now } from "@typeberry/utils";
import {
  altNameRaw,
  certToPEM,
  ed25519AsJsonWebKeyPair,
  generateCertificate,
  type PeerInfo,
  privateKeyToPEM,
  verifyCertificate,
} from "./certificate.js";
import { getQuicClientCrypto, getQuicServerCrypto } from "./crypto.js";
import * as metrics from "./metrics.js";
import type { DialOptions } from "./network.js";
import { peerVerification } from "./peer-verification.js";
import { type PeerAddress, PeersManagement } from "./peers.js";
import { QuicNetwork } from "./quic-network.js";
import { QuicPeer } from "./quic-peer.js";
import { addEventListener } from "./quic-utils.js";

const logger = Logger.new(import.meta.filename, "net");

/** Networking server part options. */
export type Options = {
  /** Peer's ed25519key. */
  key: Ed25519Pair;
  /** Host interface to bound to. */
  host: string;
  /** Port to listen on. Use `0` for random. */
  port: number;
  /** Supported ALPNs (protocols) both for the inbound and outbound connections. */
  protocols: string[];
};

enum CloseReason {
  PeerIdMismatch = 0,
  DuplicateConnection = 1,
  ConnectionFromOurself = 2,
}

export class Quic {
  /** Setup QUIC socket and start listening for connections. */
  static async setup({ host, port, protocols, key }: Options): Promise<QuicNetwork> {
    const networkMetrics = metrics.createMetrics();

    const quicLoggerLvl = logger.getLevel() > Level.TRACE ? LogLevel.WARN : LogLevel.DEBUG;
    const quicLogger = new QuicLogger("quic", quicLoggerLvl, [
      new StreamHandler(formatting.format`${formatting.level}:${formatting.keys}:${formatting.msg}`),
    ]);

    // Load keypair
    const keyPair = ed25519AsJsonWebKeyPair(key);
    const privKeyPEM = await privateKeyToPEM(keyPair);
    const cert = await generateCertificate({
      certId: BytesBlob.blobFromString("QUIC Networking"),
      subjectKeyPair: keyPair,
      issuerKeyPair: keyPair,
    });

    // QUICConfig
    const config = {
      keepAliveIntervalTime: 3000,
      maxIdleTimeout: 6000,
      applicationProtos: protocols,
      cert: certToPEM(cert),
      key: privKeyPEM,
      verifyPeer: true,
      // Server accepts TLS and verifies the certificate in the connection handler
      // (EventQUICServerConnection). Client overrides this with peerVerification() per dial.
      verifyCallback: async () => undefined,
    };

    logger.info`🆔 Peer id: ** ${altNameRaw(key.pubKey)}@${host}:${port} ** (pubkey: ${key.pubKey})`;
    // Shared injected UDP socket
    const socket = new QUICSocket({
      logger: quicLogger.getChild("socket"),
    });

    // Start server on the socket.
    const server = new QUICServer({
      socket,
      config,
      crypto: getQuicServerCrypto(key),
      logger: quicLogger.getChild("server"),
    });

    // peer management
    const peers = new PeersManagement<QuicPeer>();

    // basic error handling
    addEventListener(server, events.EventQUICServerError, (error) => logger.error`🛜  Server error: ${error}`);
    addEventListener(server, events.EventQUICServerClose, (ev) => logger.error`🛜  Server stopped: ${ev}`);

    // handling incoming session
    addEventListener(server, events.EventQUICServerConnection, async (ev) => {
      const conn = ev.detail;
      const peerAddress = `${conn.remoteHost}:${conn.remotePort}`;

      networkMetrics.recordConnectingIn(peerAddress);

      // Verify the peer's certificate and extract peer info.
      const remoteCerts = conn.getRemoteCertsChain();
      const verification = await verifyCertificate(remoteCerts);
      if (verification.isError) {
```
