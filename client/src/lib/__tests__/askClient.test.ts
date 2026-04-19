import { describe, expect, it } from "vitest";
import { parseSseBuffer } from "../askClient";

describe("parseSseBuffer", () => {
  it("returns no events when buffer contains only an incomplete frame", () => {
    const { events, remainder } = parseSseBuffer(
      'event: tool_call\ndata: {"type":"too'
    );
    expect(events).toEqual([]);
    expect(remainder).toBe('event: tool_call\ndata: {"type":"too');
  });

  it("parses a single complete frame", () => {
    const { events, remainder } = parseSseBuffer(
      'event: done\ndata: {"type":"done"}\n\n'
    );
    expect(events).toEqual([{ type: "done" }]);
    expect(remainder).toBe("");
  });

  it("parses multiple frames in one buffer", () => {
    const buf =
      'event: content_delta\ndata: {"type":"content_delta","text":"a"}\n\n' +
      'event: content_delta\ndata: {"type":"content_delta","text":"b"}\n\n';
    const { events, remainder } = parseSseBuffer(buf);
    expect(events).toEqual([
      { type: "content_delta", text: "a" },
      { type: "content_delta", text: "b" },
    ]);
    expect(remainder).toBe("");
  });

  it("keeps a trailing partial frame as remainder", () => {
    const buf =
      'event: content_delta\ndata: {"type":"content_delta","text":"a"}\n\n' +
      'event: content_delta\ndata: {"type":"content_de';
    const { events, remainder } = parseSseBuffer(buf);
    expect(events).toEqual([{ type: "content_delta", text: "a" }]);
    expect(remainder).toBe(
      'event: content_delta\ndata: {"type":"content_de'
    );
  });

  it("ignores frames with no data line", () => {
    const { events, remainder } = parseSseBuffer(
      "event: done\n\n"
    );
    expect(events).toEqual([]);
    expect(remainder).toBe("");
  });
});
