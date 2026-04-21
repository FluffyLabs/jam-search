import { describe, expect, it } from "vitest";
import { splitCitationMarkers } from "../askMarkers";

describe("splitCitationMarkers", () => {
  it("returns a single string when there are no markers", () => {
    expect(splitCitationMarkers("plain text")).toEqual(["plain text"]);
  });

  it("splits around a single marker", () => {
    expect(splitCitationMarkers("foo [1] bar")).toEqual([
      "foo ",
      { n: 1 },
      " bar",
    ]);
  });

  it("splits around multiple markers", () => {
    expect(splitCitationMarkers("a [1] b [2] c")).toEqual([
      "a ",
      { n: 1 },
      " b ",
      { n: 2 },
      " c",
    ]);
  });

  it("supports adjacent markers", () => {
    expect(splitCitationMarkers("foo [1][2]")).toEqual([
      "foo ",
      { n: 1 },
      { n: 2 },
    ]);
  });

  it("does not match markers with non-digit content", () => {
    expect(splitCitationMarkers("[foo] [1]")).toEqual(["[foo] ", { n: 1 }]);
  });

  it("returns [] for empty string", () => {
    expect(splitCitationMarkers("")).toEqual([]);
  });
});
