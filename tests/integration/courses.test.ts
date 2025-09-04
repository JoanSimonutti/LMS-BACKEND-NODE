import request from "supertest";
import { TestDataSource as AppDataSource } from "../../src/database.test";
import apiService from "../../src/app";
import Course from "../../src/modules/courses/models/course.model";
import Module from "../../src/modules/modules/models/Module";
import Lesson from "../../src/modules/lessons/models/Lesson";
import Completion from "../../src/modules/completions/models/Completion";
import User from "../../src/modules/users/models/user.model";

describe("Courses API", () => {
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

  it("should create a new course", async () => {
    const res = await request(apiService)
      .post("/courses")
      .send({
        title: "Test Course",
        description: "This is a test course",
      })
      .expect(201);

    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe("Test Course");
  });

  it("should get all courses", async () => {
    await request(apiService).post("/courses").send({
      title: "Course 1",
      description: "First test course",
    });

    await request(apiService).post("/courses").send({
      title: "Course 2",
      description: "Second test course",
    });

    const res = await request(apiService).get("/courses").expect(200);

    expect(res.body.length).toBe(2);
  });

  it("should get a course by id", async () => {
    const createRes = await request(apiService).post("/courses").send({
      title: "Single Course",
      description: "For testing",
    });

    const courseId = createRes.body.id;

    const res = await request(apiService).get(`/courses/${courseId}`).expect(200);

    expect(res.body).toHaveProperty("id", courseId);
    expect(res.body.title).toBe("Single Course");
  });

  it("should update a course", async () => {
    const createRes = await request(apiService).post("/courses").send({
      title: "Old Title",
      description: "Old description",
    });

    const courseId = createRes.body.id;

    const res = await request(apiService)
      .put(`/courses/${courseId}`)
      .send({
        title: "Updated Title",
        description: "Updated description",
      })
      .expect(200);

    expect(res.body.title).toBe("Updated Title");
    expect(res.body.description).toBe("Updated description");
  });

  it("should delete a course", async () => {
    const createRes = await request(apiService).post("/courses").send({
      title: "Course to Delete",
      description: "Will be deleted",
    });

    const courseId = createRes.body.id;

    await request(apiService).delete(`/courses/${courseId}`).expect(204);

    const res = await request(apiService).get(`/courses/${courseId}`).expect(404);

    expect(res.body).toHaveProperty("message", "Course not found");
  });
});
