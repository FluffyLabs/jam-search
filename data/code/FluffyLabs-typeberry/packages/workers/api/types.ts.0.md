---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api/types.ts#L1-L62
title: packages/workers/api/types.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: 3c6220771ed71d63f32ebbb864aba6c1744ea58381944ef9a0b841aaa40934a2
language: typescript
---
`packages/workers/api/types.ts` (lines 1–62)

```typescript
import type { Codec } from "@typeberry/codec";

/**
 * Definition of communication protocol between workers.
 */
export type Protocol<To, From> = {
  name: string;
  toWorker: MessagesList<To>;
  fromWorker: MessagesList<From>;
};

/** Relaxed version of protocol definition to ensure proper type inference. */
export type LousyProtocol<To, From> = Protocol<To, From> & {
  toWorker: To & {};
  fromWorker: From & {};
};

/**
 * A one-way definition of the protocol, containing only request & response codecs
 * for supported messages.
 */
export type MessagesList<T> = {
  [K in keyof T]: T[K] extends MessageCodecs<infer Req, infer Res> ? MessageCodecs<Req, Res> : never;
};

/** Request and response codec definitions for protocol message. */
export type MessageCodecs<Req, Res> = {
  request: Codec<Req>;
  response: Codec<Res>;
};

/** Request handler. Takes a `Req` and converts it into `Promise<Res>` */
export type Handler<Req, Res> = (x: (req: Req) => Promise<Res>) => void;

/** Collection of request handlers with naming based on protocol messages. */
export type Handlers<In> = {
  [K in keyof In as HandlerKey<K>]: In[K] extends MessageCodecs<infer Req, infer Res> ? Handler<Req, Res> : never;
};
/** Request handler key type. */
export type HandlerKey<K> = `setOn${Capitalize<string & K>}`;

/** Request sender. Takes a `Req` and promises a response. */
export type Sender<Req, Res> = (req: Req) => Promise<Res>;

/** Collection of request senders with naming based on protocol messages. */
export type Senders<Out> = {
  [K in keyof Out as SenderKey<K>]: Out[K] extends MessageCodecs<infer Req, infer Res> ? Sender<Req, Res> : never;
};

export type Destroy = { destroy(): void };

/** Request sender key type. */
export type SenderKey<K> = `send${Capitalize<string & K>}`;

/** Receiving end of the protocol communication channel. */
export type Rx<To, From> = Handlers<To> & Senders<From> & Destroy;

/** Transmitting end of the protocol communication channel. */
export type Tx<To, From> = Senders<To> & Handlers<From> & Destroy;

export type Api<T> = T extends LousyProtocol<infer To, infer From> ? Tx<To, From> : never;
export type Internal<T> = T extends LousyProtocol<infer To, infer From> ? Rx<To, From> : never;
```
