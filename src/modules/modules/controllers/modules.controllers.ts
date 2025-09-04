import { Request, Response } from "express";
import { getActiveDataSource } from "../../../shared/database.utils";
import Course from "@modules/courses/models/course.model";
import Module from "@modules/modules/models/Module";
import {
  sendBadRequest,
  sendCreated,
  sendNotFound,
  sendOk,
} from "@shared/responses.utils";

const parseId = (value: string | undefined) => {
  if (!value) return null;
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

export const createModule = async (req: Request, res: Response) => {
  try {
    const { title, courseId, moduleId, isRootModule } = req.body as {
      title?: string;
      courseId?: number | string;
      moduleId?: number | string | null;
      isRootModule?: boolean;
    };

    if (!title) return sendBadRequest(res, "Title is required");
    const courseIdNum = parseId(String(courseId));
    if (!courseIdNum) return sendBadRequest(res, "Invalid courseId");

    const courseRepo = getActiveDataSource().getRepository(Course);
    const moduleRepo = getActiveDataSource().getRepository(Module);

    const course = await courseRepo.findOne({ where: { id: courseIdNum } });
    if (!course) return sendBadRequest(res, "Invalid courseId");

    let parentId: number | null = null;
    if (moduleId !== undefined && moduleId !== null && moduleId !== "") {
      const parsedParentId = parseId(String(moduleId));
      if (!parsedParentId) return sendBadRequest(res, "Invalid moduleId");

      const parent = await moduleRepo.findOne({ where: { id: parsedParentId } });
      if (!parent) return sendBadRequest(res, "Invalid moduleId");

      parentId = parent.id;
    }

    const payload = moduleRepo.create({
      title,
      isRootModule: parentId ? false : Boolean(isRootModule),
      course,
      moduleId: parentId ?? null,
    });

    const saved = await moduleRepo.save(payload);
    return sendCreated(res, saved);
  } catch (err) {
    console.error("Error creating module:", err instanceof Error ? err.stack : err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getModules = async (req: Request, res: Response) => {
  try {
    const courseIdNum = parseId(req.query.courseId as string | undefined);
    const parentIdNum = parseId(req.query.moduleId as string | undefined);
    const onlyRoots = req.query.root === "true";

    const where: any = {};
    if (courseIdNum) where.course = { id: courseIdNum };
    if (parentIdNum !== null && parentIdNum !== undefined)
      where.moduleId = parentIdNum;
    if (onlyRoots) where.isRootModule = true;

    const moduleRepo = getActiveDataSource().getRepository(Module);
    const modules = await moduleRepo.find({
      where,
      relations: ["course"],
      order: { id: "ASC" },
    });

    return sendOk(res, modules);
  } catch (err) {
    console.error("Error fetching modules:", err instanceof Error ? err.stack : err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getModuleById = async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.moduleId);
    if (!id) return sendBadRequest(res, "Invalid module id");

    const moduleRepo = getActiveDataSource().getRepository(Module);
    const found = await moduleRepo.findOne({
      where: { id },
      relations: ["course"],
    });

    if (!found) return sendNotFound(res, "Module not found");
    return sendOk(res, found);
  } catch (err) {
    console.error(
      "Error fetching module by id:",
      err instanceof Error ? err.stack : err
    );
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateModule = async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.moduleId);
    if (!id) return sendBadRequest(res, "Invalid module id");

    const { title, courseId, moduleId, isRootModule } = req.body as {
      title?: string;
      courseId?: number | string;
      moduleId?: number | string | null;
      isRootModule?: boolean;
    };

    const moduleRepo = getActiveDataSource().getRepository(Module);
    const courseRepo = getActiveDataSource().getRepository(Course);

    const existing = await moduleRepo.findOne({ where: { id } });
    if (!existing) return sendNotFound(res, "Module not found");

    if (title !== undefined) existing.title = title;

    if (courseId !== undefined) {
      const courseIdNum = parseId(String(courseId));
      if (!courseIdNum) return sendBadRequest(res, "Invalid courseId");
      const course = await courseRepo.findOne({ where: { id: courseIdNum } });
      if (!course) return sendBadRequest(res, "Invalid courseId");
      existing.course = course;
    }

    if (moduleId !== undefined) {
      if (moduleId === null || moduleId === "") {
        existing.moduleId = null;
        existing.isRootModule = Boolean(isRootModule ?? true);
      } else {
        const parsedParentId = parseId(String(moduleId));
        if (!parsedParentId) return sendBadRequest(res, "Invalid moduleId");
        if (parsedParentId === id)
          return sendBadRequest(res, "A module cannot reference itself");

        const parent = await moduleRepo.findOne({ where: { id: parsedParentId } });
        if (!parent) return sendBadRequest(res, "Invalid moduleId");
        existing.moduleId = parent.id;
        existing.isRootModule = false;
      }
    }

    if (isRootModule !== undefined && existing.moduleId == null) {
      existing.isRootModule = isRootModule;
    }

    const saved = await moduleRepo.save(existing);
    return sendOk(res, saved);
  } catch (err) {
    console.error("Error updating module:", err instanceof Error ? err.stack : err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteModule = async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.moduleId);
    if (!id) return sendBadRequest(res, "Invalid module id");

    const moduleRepo = getActiveDataSource().getRepository(Module);
    const existing = await moduleRepo.findOne({ where: { id } });
    if (!existing) return sendNotFound(res, "Module not found");

    await moduleRepo.remove(existing);
    return res.status(204).send();
  } catch (err) {
    console.error("Error deleting module:", err instanceof Error ? err.stack : err);
    return res.status(500).json({ message: "Internal server error" });
  }
};