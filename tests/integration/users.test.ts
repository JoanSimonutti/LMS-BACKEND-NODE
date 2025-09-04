import request from "supertest";
import { TestDataSource as AppDataSource } from "../../src/database.test";
import apiService from "../../src/app";
import User from "../../src/modules/users/models/user.model";
import Course from "../../src/modules/courses/models/course.model";
import Module from "../../src/modules/modules/models/Module";
import Lesson from "../../src/modules/lessons/models/Lesson";
import Completion from "../../src/modules/completions/models/Completion";

describe("Users API", () => {
  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

 beforeEach(async () => {
  await AppDataSource.query('DELETE FROM completions;');
  await AppDataSource.query('DELETE FROM lessons;');
  await AppDataSource.query('DELETE FROM modules;');
  await AppDataSource.query('DELETE FROM courses;');
  await AppDataSource.query('DELETE FROM users;');
  
  await AppDataSource.query('ALTER TABLE users AUTO_INCREMENT = 1;');
  await AppDataSource.query('ALTER TABLE courses AUTO_INCREMENT = 1;');
  await AppDataSource.query('ALTER TABLE modules AUTO_INCREMENT = 1;');
  await AppDataSource.query('ALTER TABLE lessons AUTO_INCREMENT = 1;');
  await AppDataSource.query('ALTER TABLE completions AUTO_INCREMENT = 1;');
});

   it("should register a new user", async () => {
    const res = await request(apiService)
      .post("/users/register")
      .send({
        name: "John Doe",
        email: "john@example.com",
        password: "password123"
      })
      .expect(201);

    expect(res.body).toHaveProperty("id");
    expect(res.body.email).toBe("john@example.com");
  });

  it("should not register a user with duplicate email", async () => {
    await request(apiService).post("/users/register").send({
      name: "Jane Doe",
      email: "jane@example.com",
      password: "password123"
    });

    const res = await request(apiService).post("/users/register").send({
      name: "Jane Again",
      email: "jane@example.com",
      password: "password123"
    });

    expect(res.status).toBe(400);
  });

  it("should login an existing user", async () => {
    await request(apiService).post("/users/register").send({
      name: "Alice",
      email: "alice@example.com",
      password: "password123"
    });

    const res = await request(apiService)
      .post("/users/login")
      .send({
        email: "alice@example.com",
        password: "password123"
      })
      .expect(200);

    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe("alice@example.com");
  });

  it("should reject login with wrong password", async () => {
    await request(apiService).post("/users/register").send({
      name: "Bob",
      email: "bob@example.com",
      password: "password123"
    });

    const res = await request(apiService)
      .post("/users/login")
      .send({
        email: "bob@example.com",
        password: "wrongpassword"
      });

    expect(res.status).toBe(401);
  });
});
