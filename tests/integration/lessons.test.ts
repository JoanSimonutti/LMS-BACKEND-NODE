import request from "supertest";
import { TestDataSource as AppDataSource } from "../../src/database.test";
import apiService from "../../src/app";
import Course from "../../src/modules/courses/models/course.model";
import Module from "../../src/modules/modules/models/Module";
import Lesson from "../../src/modules/lessons/models/Lesson";

describe("Lessons API", () => {
  let course: Course;
  let module: Module;

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const courseRepo = AppDataSource.getRepository(Course);
    const moduleRepo = AppDataSource.getRepository(Module);

    course = courseRepo.create({
      title: "Test Course for Lessons",
      description: "Course for testing lessons",
    });
    await courseRepo.save(course);

    module = moduleRepo.create({
      title: "Test Module for Lessons",
      isRootModule: true,
      courseId: course.id,
      course: course,
      moduleId: null,
    });
    await moduleRepo.save(module);
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

beforeEach(async () => {
  await AppDataSource.query('DELETE FROM completions;');
  await AppDataSource.query('DELETE FROM lessons;');
  
  await AppDataSource.query('ALTER TABLE lessons AUTO_INCREMENT = 1;');
  await AppDataSource.query('ALTER TABLE completions AUTO_INCREMENT = 1;');
});

  it("should create a new lesson", async () => {
    const res = await request(apiService)
      .post("/lessons")
      .send({
        title: "Test Lesson",
        content: "This is test content",
        moduleId: module.id,
      })
      .expect(201);

    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe("Test Lesson");
    expect(res.body.content).toBe("This is test content");
    expect(res.body.moduleId).toBe(module.id);
  });

  it("should not create lesson without title", async () => {
    const res = await request(apiService)
      .post("/lessons")
      .send({
        content: "Content without title",
        moduleId: module.id,
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Title is required");
  });

  it("should not create lesson with invalid moduleId", async () => {
    const res = await request(apiService)
      .post("/lessons")
      .send({
        title: "Test Lesson",
        content: "Test content",
        moduleId: 999999,
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Module not found");
  });

  it("should get all lessons", async () => {
    // Crear dos lessons
    await request(apiService).post("/lessons").send({
      title: "Lesson 1",
      content: "Content 1",
      moduleId: module.id,
    });

    await request(apiService).post("/lessons").send({
      title: "Lesson 2", 
      content: "Content 2",
      moduleId: module.id,
    });

    const res = await request(apiService).get("/lessons").expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  it("should get lesson by id", async () => {
    const createRes = await request(apiService).post("/lessons").send({
      title: "Single Lesson",
      content: "Single content",
      moduleId: module.id,
    });

    const lessonId = createRes.body.id;

    const res = await request(apiService).get(`/lessons/${lessonId}`).expect(200);

    expect(res.body).toHaveProperty("id", lessonId);
    expect(res.body.title).toBe("Single Lesson");
  });

  it("should return 404 for non-existent lesson", async () => {
    const res = await request(apiService).get("/lessons/999999");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Lesson not found");
  });

  it("should update a lesson", async () => {
    const createRes = await request(apiService).post("/lessons").send({
      title: "Original Title",
      content: "Original content",
      moduleId: module.id,
    });

    const lessonId = createRes.body.id;

    const res = await request(apiService)
      .put(`/lessons/${lessonId}`)
      .send({
        title: "Updated Title",
        content: "Updated content",
      })
      .expect(200);

    expect(res.body.title).toBe("Updated Title");
    expect(res.body.content).toBe("Updated content");
  });

  it("should delete a lesson", async () => {
    const createRes = await request(apiService).post("/lessons").send({
      title: "Lesson to Delete",
      content: "Will be deleted",
      moduleId: module.id,
    });

    const lessonId = createRes.body.id;

    await request(apiService).delete(`/lessons/${lessonId}`).expect(204);

    const res = await request(apiService).get(`/lessons/${lessonId}`);
    expect(res.status).toBe(404);
  });

  it("should filter lessons by moduleId", async () => {
    await request(apiService).post("/lessons").send({
      title: "Lesson for Module",
      content: "Content",
      moduleId: module.id,
    });

    const res = await request(apiService)
      .get(`/lessons?moduleId=${module.id}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].moduleId).toBe(module.id);
  });
});