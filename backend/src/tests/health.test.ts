import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../app";

describe("GET /api/v1/health", () => {
  it("should return 200 OK and status object", async () => {
    const response = await request(app)
      .get("/api/v1/health")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toHaveProperty("status", "OK");
    expect(response.body).toHaveProperty("timestamp");
  });
});
