---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/fuzz-proto/v1/handler.ts#L117-L209
title: packages/jam/fuzz-proto/v1/handler.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 2
content_sha: c50f906694eebcc547db8eaf91792f15fc15ebbf684de3d86dc2c1a2e3f78cd5
language: typescript
---
`packages/jam/fuzz-proto/v1/handler.ts` (lines 117–209)

```typescript
            value: ErrorMessage.create({ message: `initialize error: ${e}` }),
          };
        }
        break;
      }

      case MessageType.ImportBlock: {
        try {
          const result = await this.msgHandler.importBlock(message.value);

          if (result.isOk) {
            response = {
              type: MessageType.StateRoot,
              value: result.ok,
            };
          } else {
            response = {
              type: MessageType.Error,
              value: result.error,
            };
          }
        } catch (e) {
          response = {
            type: MessageType.Error,
            value: ErrorMessage.create({ message: `importBlock error: ${e}` }),
          };
        }
        break;
      }

      case MessageType.GetState: {
        try {
          const state = await this.msgHandler.getSerializedState(message.value);
          response = {
            type: MessageType.State,
            value: state,
          };
        } catch (e) {
          response = {
            type: MessageType.Error,
            value: ErrorMessage.create({ message: `getState error: ${e}` }),
          };
        }
        break;
      }

      case MessageType.StateRoot: {
        logger.log`--> Received unexpected 'StateRoot' message from the fuzzer. Closing.`;
        this.sender.close();
        return;
      }

      case MessageType.State: {
        logger.log`--> Received unexpected 'State' message from the fuzzer. Closing.`;
        this.sender.close();
        return;
      }

      case MessageType.Error: {
        logger.log`--> Received unexpected 'Error' message from the fuzzer. Closing.`;
        this.sender.close();
        return;
      }

      default: {
        logger.log`--> Received unexpected message type ${JSON.stringify(message)} from the fuzzer. Closing.`;
        this.sender.close();
        try {
          assertNever(message);
        } catch {
          return;
        }
      }
    }

    if (response !== null) {
      logger.trace`<-- responding with: ${response.type}`;
      const encoded = Encoder.encodeObject(messageCodec, response, this.spec);
      this.sender.send(encoded);
    } else {
      logger.warn`<-- no response generated for: ${message.type}`;
    }
  }

  onClose({ error }: { error?: Error }): void {
    logger.log`Closing the v1 handler. Reason: ${error !== undefined ? error.message : "close"}.`;
  }

  /** Check if a specific feature is enabled in the session */
  hasFeature(feature: number): boolean {
    return (this.sessionFeatures & feature) !== 0;
  }
}
```
