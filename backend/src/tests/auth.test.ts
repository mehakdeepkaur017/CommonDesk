import { describe, it, expect } from "vitest";
import request from "supertest";
import server from "../server";

describe("Auth Endpoints", () => {
  it("should return 400 if login payload is missing", async () => {
    const res = await request(server).post("/api/v1/auth/login").send({});
    expect(res.status).toBe(400);
  });
});
