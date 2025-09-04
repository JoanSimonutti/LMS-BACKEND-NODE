import request from "supertest";
import apiService from "../../src/app";

describe("Healthcheck API", () => {
  it("should return status ok", async () => {
    const response = await request(apiService).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});