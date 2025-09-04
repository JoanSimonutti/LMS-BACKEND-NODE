import request from "supertest";
import app from "../../src/app";
import { TestDataSource as AppDataSource } from "../../src/database.test";
import Course from "../../src/modules/courses/models/course.model";
import Module from "../../src/modules/modules/models/Module";

describe("Modules API", () => {
  let course: Course;

  beforeAll(async () => {
    await AppDataSource.initialize();
    const courseRepo = AppDataSource.getRepository(Course);
    course = courseRepo.create({
      title: "Course for Modules",
      description: "This course is used to test modules",
    });
    await courseRepo.save(course);
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  describe("POST /modules", () => {
    it("should create a root module", async () => {
      const res = await request(app)
        .post("/modules")
        .send({
          title: "Root Module",
          courseId: course.id,
          isRootModule: true,
        })
        .expect(201);

      expect(res.body).toHaveProperty("id");
      expect(res.body.title).toBe("Root Module");
      expect(res.body.isRootModule).toBe(true);
    });

    it("should create a child module", async () => {
      const parentRes = await request(app)
        .post("/modules")
        .send({
          title: "Parent Module",
          courseId: course.id,
          isRootModule: true,
        })
        .expect(201);

      const parentId = parentRes.body.id;

      const res = await request(app)
        .post("/modules")
        .send({
          title: "Child Module",
          courseId: course.id,
          moduleId: parentId,
        })
        .expect(201);

      expect(res.body).toHaveProperty("id");
      expect(res.body.title).toBe("Child Module");
      expect(res.body.isRootModule).toBe(false);
      expect(res.body.moduleId).toBe(parentId);
    });
  });

  describe("GET /modules", () => {
    it("should list all modules", async () => {
      const res = await request(app).get("/modules").expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /modules/:id", () => {
    it("should return a single module", async () => {
      const moduleRepo = AppDataSource.getRepository(Module);
      const oneModule = await moduleRepo.findOne({ where: { course: { id: course.id } } });
      const res = await request(app).get(`/modules/${oneModule!.id}`).expect(200);
      expect(res.body).toHaveProperty("id", oneModule!.id);
    });

    it("should return 404 if module does not exist", async () => {
      await request(app).get("/modules/999999").expect(404);
    });
  });

  describe("PUT /modules/:id", () => {
    it("should update an existing module", async () => {
      const moduleRepo = AppDataSource.getRepository(Module);
      const module = moduleRepo.create({
        title: "Temporary Module",
        course,
        isRootModule: true,
      });
      await moduleRepo.save(module);

      const res = await request(app)
        .put(`/modules/${module.id}`)
        .send({ title: "Updated Module" })
        .expect(200);

      expect(res.body).toHaveProperty("id", module.id);
      expect(res.body.title).toBe("Updated Module");
    });

    it("should return 404 when updating non-existent module", async () => {
      await request(app)
        .put("/modules/999999")
        .send({ title: "Does not exist" })
        .expect(404);
    });
  });

  describe("DELETE /modules/:id", () => {
    it("should delete an existing module", async () => {
      const moduleRepo = AppDataSource.getRepository(Module);
      const module = moduleRepo.create({
        title: "Module To Delete",
        course,
        isRootModule: true,
      });
      await moduleRepo.save(module);

      await request(app).delete(`/modules/${module.id}`).expect(204);

      const found = await moduleRepo.findOne({ where: { id: module.id } });
      expect(found).toBeNull();
    });

    it("should return 404 when deleting non-existent module", async () => {
      await request(app).delete("/modules/999999").expect(404);
    });
  });
});
