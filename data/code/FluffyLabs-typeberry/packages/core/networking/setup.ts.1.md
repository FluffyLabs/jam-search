---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/networking/setup.ts#L105-L203
title: packages/core/networking/setup.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 1
chunk_total: 3
content_sha: f713c07ccaec2a12e7cf969c9d1754acbe790bad91d5aefe6365a9e7eafce6df
language: typescript
---
`packages/core/networking/setup.ts` (lines 105–203)

```typescript
      // Verify the peer's certificate and extract peer info.
      const remoteCerts = conn.getRemoteCertsChain();
      const verification = await verifyCertificate(remoteCerts);
      if (verification.isError) {
        networkMetrics.recordConnectInFailed("cert_verification_failed");
        await conn.stop();
        return;
      }
      const peerInfo = verification.ok;

      if (peerInfo.key.isEqualTo(key.pubKey)) {
        logger.log`🛜 Rejecting connection from ourself from ${conn.remoteHost}:${conn.remotePort}`;
        networkMetrics.recordConnectionRefused(peerAddress);
        await conn.stop({ isApp: true, errorCode: CloseReason.ConnectionFromOurself });
        return;
      }

      if (peers.isConnected(peerInfo.id)) {
        logger.log`🛜 Rejecting duplicate connection with peer ${peerInfo.id} from ${conn.remoteHost}:${conn.remotePort}`;
        networkMetrics.recordConnectionRefused(peerAddress);
        await conn.stop({ isApp: true, errorCode: CloseReason.DuplicateConnection, force: false });
        return;
      }

      logger.log`🛜 Server handshake with ${conn.remoteHost}:${conn.remotePort}`;

      newPeer(conn, peerInfo, "in");
      networkMetrics.recordConnectedIn(peerInfo.id);
      await conn.start();
    });

    // connecting to a peer
    async function dial(peer: PeerAddress, options: DialOptions): Promise<QuicPeer> {
      return doDial();

      async function doDial() {
        const peerAddress = `${peer.host}:${peer.port}`;
        const peerDetails = peerVerification();

        try {
          const clientLater = QUICClient.createQUICClient(
            {
              socket: socket,
              host: peer.host,
              port: peer.port,
              crypto: getQuicClientCrypto(),
              config: {
                ...config,
                verifyCallback: peerDetails.verifyCallback,
              },
              logger: quicLogger.getChild("client"),
            },
            {
              signal: options.signal,
            },
          );
          const client = await clientLater;

          networkMetrics.recordConnectingOut(peerDetails.info?.id ?? "unknown", peerAddress);

          if (peerDetails.info === null) {
            networkMetrics.recordConnectOutFailed("no_peer_info");
            await client.destroy({ isApp: true, errorCode: CloseReason.PeerIdMismatch });
            throw new Error("Client connected, but there is no peer details!");
          }

          if (options.verifyName !== undefined && options.verifyName !== peerDetails.info.id) {
            networkMetrics.recordConnectOutFailed("peer_id_mismatch");
            await client.destroy({ isApp: true, errorCode: CloseReason.PeerIdMismatch });
            throw new Error(
              `Client connected, but the id didn't match. Expected: ${options.verifyName}, got: ${peerDetails.info.id}`,
            );
          }

          addEventListener(client, events.EventQUICClientClose, () => {
            logger.log`⚰️ Client connection closed.`;
          });

          addEventListener(client, events.EventQUICClientError, (error) => {
            logger.error`🔴 Client error: ${error.detail}`;
          });

          logger.log`🤝 Client handshake with: ${peer.host}:${peer.port}`;
          const newPeerInstance = newPeer(client.connection, peerDetails.info, "out");
          networkMetrics.recordConnectedOut(peerDetails.info.id);
          return newPeerInstance;
        } catch (error) {
          networkMetrics.recordConnectOutFailed(String(error));
          throw error;
        }
      }
    }

    function newPeer(conn: QUICConnection, peerInfo: PeerInfo, side: "in" | "out") {
      const peer = QuicPeer.new(conn, peerInfo);
      const connectionStartTime = now();
      addEventListener(peer.conn, events.EventQUICConnectionClose, (ev) => {
        const duration = now() - connectionStartTime;
        const reason = String(ev.detail) ?? "normal";
```
