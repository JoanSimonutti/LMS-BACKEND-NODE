import { TestDataSource } from "../../src/database.test";

describe("Database import test", () => {
  it("should import TestDataSource without hanging", () => {
    expect(TestDataSource).toBeDefined();
  });
});