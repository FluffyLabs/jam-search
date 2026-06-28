---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/protocol/up-0-block-announcement.ts#L115-L153
title: packages/jam/jamnp-s/protocol/up-0-block-announcement.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 1
chunk_total: 2
content_sha: 10b70c64733e73add65b6827cc55f901ccabf62a969945f5e68faf763675cbd1
language: typescript
---
`packages/jam/jamnp-s/protocol/up-0-block-announcement.ts` (lines 115–153)

```typescript
        sender.bufferAndSend(Encoder.encodeObject(Handshake.Codec, this.getHandshake()));
      }
      this.onHandshake(streamId, handshake);
      return;
    }

    // it's just an announcement
    const annoucement = Decoder.decodeObject(Announcement.Codec, message, this.spec);
    logger.log`[${streamId}] --> got blocks announcement: ${annoucement.final}`;
    this.onAnnouncement(streamId, annoucement);
  }

  onClose(streamId: StreamId): void {
    this.handshakes.delete(streamId);
    this.pendingHandshakes.delete(streamId);
  }

  sendHandshake(sender: StreamMessageSender) {
    const { streamId } = sender;
    if (this.handshakes.has(streamId) || this.pendingHandshakes.has(streamId)) {
      return;
    }
    const handshake = this.getHandshake();
    logger.trace`[${streamId}] <-- sending handshake`;
    this.pendingHandshakes.set(streamId, true);
    sender.bufferAndSend(Encoder.encodeObject(Handshake.Codec, handshake));
  }

  sendAnnouncement(sender: StreamMessageSender, annoucement: Announcement) {
    const { streamId } = sender;
    // only send announcement if we've handshaken
    if (this.handshakes.has(streamId)) {
      logger.trace`[${streamId}] <-- sending block announcement: ${annoucement.final}`;
      sender.bufferAndSend(Encoder.encodeObject(Announcement.Codec, annoucement, this.spec));
    } else {
      logger.warn`[${streamId}] <-- no handshake yet, skipping announcement.`;
    }
  }
}
```
