import { Request, Response } from "express";
import { getActiveDataSource } from "../../../shared/database.utils";
import Lesson from "../models/Lesson";
import Module from "../../modules/models/Module";

const parseId = (value: string | undefined) => {
  if (!value) return null;
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

export const createLesson = async (req: Request, res: Response) => {
  try {
    const { title, content, moduleId } = req.body as {
      title?: string;
      content?: string;
      moduleId?: number | string;
    };

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const moduleIdNum = parseId(String(moduleId));
    if (!moduleIdNum) {
      return res.status(400).json({ message: "Invalid moduleId" });
    }

    const moduleRepo = getActiveDataSource().getRepository(Module);
    const lessonRepo = getActiveDataSource().getRepository(Lesson);

    // Verificar que el módulo existe
    const module = await moduleRepo.findOne({ where: { id: moduleIdNum } });
    if (!module) {
      return res.status(400).json({ message: "Module not found" });
    }

    const lesson = lessonRepo.create({
      title,
      content: content || "",
      moduleId: moduleIdNum,
      module,
    });

    const savedLesson = await lessonRepo.save(lesson);
    return res.status(201).json(savedLesson);
  } catch (err) {
    console.error("Error creating lesson:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getLessons = async (req: Request, res: Response) => {
  try {
    const moduleIdNum = parseId(req.query.moduleId as string | undefined);
    
    const lessonRepo = getActiveDataSource().getRepository(Lesson);
    
    const where: any = {};
    if (moduleIdNum) {
      where.moduleId = moduleIdNum;
    }

    const lessons = await lessonRepo.find({
      where,
      relations: ["module"],
      order: { id: "ASC" },
    });

    return res.json(lessons);
  } catch (err) {
    console.error("Error fetching lessons:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getLessonById = async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "Invalid lesson id" });
    }

    const lessonRepo = getActiveDataSource().getRepository(Lesson);
    const lesson = await lessonRepo.findOne({
      where: { id },
      relations: ["module"],
    });

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    return res.json(lesson);
  } catch (err) {
    console.error("Error fetching lesson by id:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateLesson = async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "Invalid lesson id" });
    }

    const { title, content, moduleId } = req.body as {
      title?: string;
      content?: string;
      moduleId?: number | string;
    };

    const lessonRepo = getActiveDataSource().getRepository(Lesson);
    const moduleRepo = getActiveDataSource().getRepository(Module);

    const lesson = await lessonRepo.findOne({ where: { id } });
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    if (title !== undefined) lesson.title = title;
    if (content !== undefined) lesson.content = content;

    if (moduleId !== undefined) {
      const moduleIdNum = parseId(String(moduleId));
      if (!moduleIdNum) {
        return res.status(400).json({ message: "Invalid moduleId" });
      }

      const module = await moduleRepo.findOne({ where: { id: moduleIdNum } });
      if (!module) {
        return res.status(400).json({ message: "Module not found" });
      }

      lesson.moduleId = moduleIdNum;
      lesson.module = module;
    }

    const savedLesson = await lessonRepo.save(lesson);
    return res.json(savedLesson);
  } catch (err) {
    console.error("Error updating lesson:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteLesson = async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: "Invalid lesson id" });
    }

    const lessonRepo = getActiveDataSource().getRepository(Lesson);
    const lesson = await lessonRepo.findOne({ where: { id } });

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    await lessonRepo.remove(lesson);
    return res.status(204).send();
  } catch (err) {
    console.error("Error deleting lesson:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};