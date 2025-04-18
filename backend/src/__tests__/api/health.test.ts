import { describe, expect, it } from "vitest";
import { createApp } from "../../api.js";

describe("Healthcheck Endpoint", () => {
  it("should return 200 status and correct response format", async () => {
    const app = createApp();

    const response = await app.request("/health");

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty("status");
    expect(data.status).toBe("ok");
    expect(data).toHaveProperty("timestamp");
    expect(new Date(data.timestamp)).toBeInstanceOf(Date);
  });
});
