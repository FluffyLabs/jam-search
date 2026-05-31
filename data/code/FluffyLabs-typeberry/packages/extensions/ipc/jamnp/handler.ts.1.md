---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/extensions/ipc/jamnp/handler.ts#L113-L222
title: packages/extensions/ipc/jamnp/handler.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 1
chunk_total: 3
content_sha: f5865ce74d8f057609f474ffc828f27aa62cedc2bdb005a496cf7e44b235459d
language: typescript
---
`packages/extensions/ipc/jamnp/handler.ts` (lines 113–222)

```typescript
    sender.open(NewStream.create({ streamByte: kind }));

    work(handler as THandler, sender);
  }

  /** Handle incoming message on that socket. */
  async onSocketMessage(msg: Uint8Array): Promise<void> {
    // decode the message as `StreamEnvelope`
    const envelope = Decoder.decodeObject(StreamEnvelope.Codec, msg);
    const ipcStreamId = envelope.streamId;
    logger.log`[${ipcStreamId}] incoming message: ${envelope.type} ${envelope.data}`;
    // check if this is a already known stream id
    const streamHandler = this.streams.get(ipcStreamId);
    const streamSender = EnvelopeSender.new(ipcStreamId, this.sender);
    // we don't know that stream yet, so it has to be a new one
    if (streamHandler === undefined) {
      // closing or message of unknown stream - ignore.
      if (envelope.type !== StreamEnvelopeType.Open) {
        logger.warn`[${ipcStreamId}] (unknown) got invalid type ${envelope.type}.`;
        return;
      }
      const newStream = Decoder.decodeObject(NewStream.Codec, envelope.data);
      const handler = this.streamHandlers.get(newStream.streamByte);
      if (handler !== undefined) {
        logger.log`[${ipcStreamId}] new stream for ${handler.kind}`;
        // insert the stream
        this.streams.set(ipcStreamId, handler);
        // Just send back the same stream byte.
        streamSender.open(newStream);
        return;
      }
      // reply with an error, because we don't know how to handle that stream kind.
      streamSender.close();
      return;
    }

    if (envelope.type === StreamEnvelopeType.Open) {
      // display a warning but only if the stream was not pending for confirmation.
      if (!this.pendingStreams.delete(ipcStreamId)) {
        logger.warn`[${ipcStreamId}] got invalid type ${envelope.type}.`;
      }
      return;
    }

    // reject stream messages without open ack first.
    if (this.pendingStreams.has(ipcStreamId)) {
      logger.warn`[${ipcStreamId}] got invalid type ${envelope.type}. Expected Open.`;
      // closing the connection and removing the stream from pending.
      this.pendingStreams.delete(ipcStreamId);
      // the stream should not be in the collection yet, but we remove it just for safety.
      this.streams.delete(ipcStreamId);
      streamSender.close();
      return;
    }

    // this is a known stream, so just dispatch the message.
    if (envelope.type === StreamEnvelopeType.Msg) {
      streamHandler.onStreamMessage(streamSender, envelope.data);
      return;
    }

    // close the stream
    if (envelope.type === StreamEnvelopeType.Close) {
      streamHandler.onClose(toStreamId(ipcStreamId), false);
      this.streams.delete(ipcStreamId);
      // not really needed, but just for sure.
      this.pendingStreams.delete(ipcStreamId);
      return;
    }

    assertNever(envelope.type);
  }

  /** Notify about termination of the underlying socket. */
  onClose({ error }: { error?: Error }) {
    logger.log`Closing the handler. Reason: ${error !== undefined ? error.message : "close"}.`;
    // Socket closed - we should probably clear everything.
    for (const [ipcStreamId, handler] of this.streams.entries()) {
      handler.onClose(toStreamId(ipcStreamId), error !== undefined);
    }
    this.streams.clear();
    this.pendingStreams.clear();

    // finish the handler.
    this.onEnd.finished = true;
    if (error !== undefined) {
      this.onEnd.reject(error);
    } else {
      this.onEnd.resolve();
    }
  }

  /** Wait for the handler to be finished either via close or error. */
  waitForEnd(): Promise<void> {
    logger.log`Waiting for the handler to be closed.`;
    return this.onEnd.listen;
  }
}

class EnvelopeSender implements StreamMessageSender {
  public readonly streamId: StreamId;

  static new(ipcStreamId: IpcStreamId, sender: IpcSender) {
    return new EnvelopeSender(ipcStreamId, sender);
  }

  private constructor(
    private readonly ipcStreamId: IpcStreamId,
    private readonly sender: IpcSender,
  ) {
```
