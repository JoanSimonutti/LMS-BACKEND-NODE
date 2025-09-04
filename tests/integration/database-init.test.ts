import { TestDataSource } from "../../src/database.test";

describe("Database init test", () => {
  it("should initialize TestDataSource", async () => {
    if (!TestDataSource.isInitialized) {
      await TestDataSource.initialize();
    }
    expect(TestDataSource.isInitialized).toBe(true);
    
    if (TestDataSource.isInitialized) {
      await TestDataSource.destroy();
    }
  });
});